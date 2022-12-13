import 'leaflet/dist/leaflet.css';
import L from 'leaflet'; // goes first always!

import { WxTileSource, type WxVars, WxAPI, WxTilesLogging, type WxTileInfo, FrameworkOptions, WxGetColorStyles, WXLOG, WxColorStyleWeak } from '../src/index';
import { WxLegendControl } from '../src/controls/WxLegendControl';
import { WxStyleEditorControl } from '../src/controls/WxStyleEditorControl';
import { WxInfoControl } from '../src/controls/WxInfoControl';
import { WxTimeControl } from '../src/controls/WxTimeControl ';
import { WxAPIControl } from '../src/controls/WxAPIControl';

start();
// simpleDemo();
// twoLayersDemo();

const OPACITY = 1;

// this is universal function for Leaflet and Mapbox.
// Functions below are just framework specific wrappers for this universal function
// start() is the fully interchangable function for Leaflet and Mapbox
async function start() {
	const map = await initFrameWork();
	addRaster(map, 'baseS', 'baseL', 'https://tiles.metoceanapi.com/base-lines/{z}/{x}/{y}', 5);
	WxTilesLogging(false);
	// const dataServerURL = 'http://localhost:9191/data/';
	const dataServerURL = 'https://tiles.metoceanapi.com/data/';
	// const dataServerURL = 'http://tiles3.metoceanapi.com/';
	const myHeaders = new Headers();
	// myHeaders.append('x-api-key', 'SpV3J1RypVrv2qkcJE91gG');
	const wxapi = new WxAPI({
		dataServerURL,
		maskURL: dataServerURL + 'masks/{z}/{x}/{y}.png',
		maskChannel: 'R',
		maskDepth: 9, // currently only max 9 is supported
		qtreeURL: dataServerURL + 'masks/9+1.seamask.qtree',
		requestInit: { headers: myHeaders },
	});

	let datasetName = 'gfs.global'; /* 'mercator.global/';  */ /* 'ecwmf.global/'; */ /* 'obs-radar.rain.nzl.national/'; */
	let variable = 'air.temperature.at-2m';
	// let variables: WxVars = ['wind.speed.eastward.at-10m', 'wind.speed.northward.at-10m'];

	// let datasetName = 'ww3-ecmwf.global';
	// let variables: WxVars = ['wave.direction.mean'];

	// let datasetName = 'obs-radar.rain.nzl.national';
	// let variables: WxVars = ['reflectivity'];

	// get datasetName from URL
	const urlParams = window.location.toString().split('##')[1];
	const params = urlParams?.split('/');
	datasetName = params?.[0] || datasetName;
	if (params?.[1]) variable = params[1];
	let time = params?.[2] || '';
	const zoom = (params && parseFloat(params[3])) || 0;
	const lng = (params && parseFloat(params[4])) || 0;
	const lat = (params && parseFloat(params[5])) || 0;
	const bearing = (params && parseFloat(params[6])) || 0;
	const pitch = (params && parseFloat(params[7])) || 0;
	if (params?.length > 8) params[8] = params.slice(8).join('/');

	const str = params?.[8] && params[8];
	const sth = { style: {} as WxColorStyleWeak };
	try {
		// get style from URL
		sth.style = str && { ...JSON.parse(decodeURI(str)) }; // reset levels if change units
	} catch (e) {
		/* ignore errors silently */
		console.log(e);
	}

	flyTo(map, zoom, lng, lat, bearing, pitch);

	// const sth = { style: {} };
	map.on('zoom', () => setURL(map, time, datasetName, variable, sth.style));
	map.on('drag', () => setURL(map, time, datasetName, variable, sth.style));
	map.on('rotate', () => setURL(map, time, datasetName, variable, sth.style));
	map.on('pitch', () => setURL(map, time, datasetName, variable, sth.style));

	let wxsource: WxTileSource | undefined;

	const legendControl = new WxLegendControl();
	addControl(map, legendControl, 'top-right');

	const frameworkOptions = { id: 'wxsource', opacity: OPACITY, attribution: 'WxTiles' };
	const apiControl = new WxAPIControl(wxapi, datasetName, variable);
	addControl(map, apiControl, 'top-left');
	apiControl.onchange = async (datasetName_, variable_, nonnativecall): Promise<void> => {
		WXLOG('apiControl.onchange datasetName=', datasetName_, 'variable=', variable_);
		// remove existing source and layer
		removeLayer(map, frameworkOptions.id, wxsource);
		//
		nonnativecall || (sth.style = {}); // reset style if change dataset/variable
		wxsource = undefined;
		datasetName = datasetName_;
		variable = variable_;
		const wxdatasetManager = await wxapi.createDatasetManager(datasetName);
		const boundaries = wxdatasetManager.getBoundaries();
		if (boundaries && !nonnativecall) {
			const { east, west, north, south } = boundaries.boundariesnorm;
			const zoom = Math.round(Math.log((360 * 360) / Math.max((east - west + 360) % 360, north - south) / 360) / Math.LN2); // from https://stackoverflow.com/questions/6048975/google-maps-v3-how-to-calculate-the-zoom-level-for-a-given-bounds
			flyTo(map, zoom, (east + west) / 2, (north + south) / 2, 0, 0);
		}
		const meta = wxdatasetManager.getVariableMeta(variable);
		if (meta?.units === 'RGB') {
			addRaster(map, frameworkOptions.id, 'wxtiles', wxdatasetManager.createURI(variable, 0), wxdatasetManager.getMaxZoom());
			timeControl.setTimes(wxdatasetManager.getTimes());
			legendControl.clear();
		} else {
			wxsource = wxdatasetManager.createSourceLayer({ variable, time, wxstyle: sth.style }, frameworkOptions);
			await addLayer(map, frameworkOptions.id, 'wxtiles', wxsource);
			const styleCopy = wxsource.getCurrentStyleObjectCopy();
			legendControl.drawLegend(styleCopy); // first draw legend with current style
			styleCopy.levels = sth.style?.levels; // no need to show defaults it in the editor and URL
			styleCopy.colors = sth.style?.colors; // no need to show defaults it in the editor and URL
			await customStyleEditorControl.onchange?.(styleCopy, true);
		}

		timeControl.updateSource(wxsource);
	};

	const timeControl = new WxTimeControl(50);
	addControl(map, timeControl, 'top-left');
	timeControl.onchange = (time_) => {
		setURL(map, (time = time_), datasetName, variable, sth.style);
	};

	const customStyleEditorControl = new WxStyleEditorControl();
	addControl(map, customStyleEditorControl, 'top-right');
	customStyleEditorControl.onchange = async (style, nonnativecall) => {
		WXLOG('customStyleEditorControl.onchange');
		if (!wxsource) return;
		nonnativecall || (await wxsource.updateCurrentStyleObject(style)); // if called manually, do not update wxsource's style
		const nstyle = wxsource.getCurrentStyleObjectCopy();
		legendControl.drawLegend(nstyle);
		nstyle.levels = style?.levels; // keep levels empty if they are not defined
		nstyle.colors = style?.colors; // keep colors empty if they are not defined
		customStyleEditorControl.setStyle(nstyle); // if called from wxsource, update customStyleEditorControl
		sth.style = nstyle;
		setURL(map, time, datasetName, variable, sth.style);
	};

	const infoControl = new WxInfoControl();
	addControl(map, infoControl, 'bottom-left');
	map.on('mousemove', (e) => infoControl.update(wxsource, map, position(e)));

	await apiControl.onchange(datasetName, variable, true); // initial load

	/*/ DEMO: more interactive - additional level and a bit of the red transparentness around the level made from current mouse position
	if (wxsource) {
		let busy = false;
		await wxsource.updateCurrentStyleObject({ levels: undefined }); // await always !!
		const levels = wxsource.getCurrentStyleObjectCopy().levels || []; // get current/default/any levels
		const colMap: [number, string][] = levels.map((level) => [level, '#' + Math.random().toString(16).slice(2, 8) + 'ff']);
		map.on('mousemove', async (e) => {
			if (!wxsource || busy) return;
			busy = true;
			const tileInfo: WxTileInfo | undefined = wxsource.getLayerInfoAtLatLon(position(e), map);
			if (tileInfo) {
				await customStyleEditorControl.onchange?.({ colorMap: [...colMap, [tileInfo.inStyleUnits[0], '#ff000000']] }); // await always !!
			}
			busy = false;
		});
	} //*/

	/*/ DEMO: abort
	if (wxsource) {
		const abortController = new AbortController();
		console.log('setTime(5)');
		const prom = wxsource.setTime(5, abortController);
		abortController.abort(); // aborts the request
		await prom; // await always !! even if aborted
		console.log('aborted');
		await wxsource.setTime(5); // no abort
		console.log('setTime(5) done'); 
	}//*/

	/*/ DEMO: preload a timestep
	map.once('click', async () => {
		if (!wxsource) return;
		console.log('no preload time=5');
		const t = Date.now();
		await wxsource.setTime(5); // await always !! or abort
		console.log(Date.now() - t);
		await wxsource.preloadTime(10); // await always !! even if aborted
		await wxsource.preloadTime(20); // await always !! even if aborted
		console.log('preloaded timesteps 10, 20');
		map.once('click', async () => {
			if (!wxsource) return;
			const t = Date.now();
			await wxsource.setTime(10); // await always !! or abort
			console.log(Date.now() - t, ' step 10');
			map.once('click', async () => {
				if (!wxsource) return;
				const t = Date.now();
				await wxsource.setTime(20); // await always !! or abort
				console.log(Date.now() - t, ' step 20');
			});
		});
	}); //*/

	/*/ DEMO: change style's units
	let i = 0;
	map.on('click', async () => {
		if (!wxsource) return;
		const u = ['knots', 'm/s', 'km/h', 'miles/h'];
		await wxsource.updateCurrentStyleObject({ units: u[i], levels: undefined }); // levels: undefined - to recalculate levels
		legendControl.drawLegend(wxsource.getCurrentStyleObjectCopy());
		i = (i + 1) % u.length;
	}); //*/

	/*/ DEMO : read lon lat data
	map.on('mousemove', (e) => {
		if (!wxsource) return;
		const pos = position(e); //
		const tileInfo: WxTileInfo | undefined = wxsource.getLayerInfoAtLatLon(pos.wrap(), map);
		if (tileInfo) {
			console.log(tileInfo);
		}
	}); //*/

	/*/ DEMO: timesteps
	let t = 0;
	const nextTimeStep = async () => {
		if (!wxsource) return;
		await wxsource.setTime(t++ % wxsource.wxdatasetManager.getTimes().length); // await always !!
		setTimeout(nextTimeStep, 0);
	};
	setTimeout(nextTimeStep, 2000);
	//*/

	/*/ DEMO: Dynamic blur effect /
	wxsource &&
		(async function step(n: number = 0) {
			await wxsource.updateCurrentStyleObject({ isolineText: false, blurRadius: ~~(10 * Math.sin(n / 500) + 10) }); // await always !!
			requestAnimationFrame(step);
		})();
		//*/
}

function flyTo(map: L.Map, zoom: number, lng: number, lat: number, bearing: number, pitch: number) {
	map.flyTo([lat, lng], zoom);
}

function setURL(map: L.Map, time: string, datasetName: string, variable: string, style: any) {
	const base = WxGetColorStyles()['base'];
	for (const i in style) style[i] === base[i] && delete style[i]; // remove default values

	const center = map.getCenter().wrap();
	const href =
		`##${datasetName}/${variable}/${time}/${map.getZoom().toFixed(2)}/${center.lng.toFixed(2)}/${center.lat.toFixed(2)}/0/0` +
		(style ? '/' + JSON.stringify(style) : '');

	history.replaceState(null, '', href);
	// location.href = `#${datasetName}/${variables.join(',')}/${time}/${map.getZoom().toFixed(2)}/${center.lng.toFixed(2)}/${center.lat.toFixed(2)}`;
}

async function initFrameWork() {
	const map = L.map('map', {
		center: [-40.75, 174.5],
		zoom: 3,
		zoomControl: false,
	});

	L.control.zoom({ position: 'bottomright' }).addTo(map);
	return map;
}

function addControl(map: L.Map, control: { extender: () => any }, position: string) {
	position = position.replace('-', '');
	map.addControl(new (L.Control.extend(control.extender()))({ position: position as any }));
}

function position(e: L.LeafletMouseEvent): L.LatLng {
	return e.latlng.wrap(); // (mapbox)
}

function removeLayer(map: L.Map, layerId: string, layer?: L.Layer) {
	map.eachLayer((l: any) => {
		if (l.options.id === layerId) {
			map.removeLayer(l);
		}
	});
}

async function addLayer(map: L.Map, idS: string, idL: string, layer: L.Layer) {
	map.addLayer(layer);
	await new Promise((done) => layer.once('load', done)); // highly recommended to await for the first load
}

function addRaster(map: L.Map, idS: string, idL: string, URL: string, maxZoom: number) {
	const layer = L.tileLayer(URL, { id: idS, maxNativeZoom: maxZoom, zIndex: idL === 'baseL' ? 100 : 0 });
	map.addLayer(layer);
}

async function simpleDemo() {
	const map = L.map('map', { center: [0, 0], zoom: 2, zoomControl: true });

	const dataServerURL = 'https://tiles.metoceanapi.com/data/';
	// const headers = new Headers();
	// headers.append('x-api-key', '--proper-key-value--'); // If needed in the future
	const requestInit: RequestInit = {
		/* headers */
	}; // add more options if needed such as headers, mode, credentials, etc

	// Get the API ready - should be ONE per application
	WxTilesLogging(true); // If needed
	const wxapi = new WxAPI({ dataServerURL, maskURL: 'none', qtreeURL: 'none', requestInit });

	const datasetName = 'gfs.global';
	const variable = 'air.temperature.at-2m'; // Scalar example
	// const variable = 'wind.speed.eastward.at-10m'; // Vector example

	// Create a dataset manager (may be used for many layers from this dataset)
	const wxdatasetManager = await wxapi.createDatasetManager(datasetName);

	// Usefull to automatically get the vector component variables from the dataset manager if given variable is northward or eastward
	// if not a vector component, then just return the variable itself
	const variables = wxdatasetManager.checkCombineVariableIfVector(variable);

	// create a layer
	const leafletOptions: FrameworkOptions = { id: 'wxsource', opacity: 1, attribution: 'WxTiles' };
	const wxsource = new WxTileSource({ wxdatasetManager, variables }, leafletOptions);

	// add the layer to the map
	map.addLayer(wxsource);

	// await for the first load
	await new Promise((done) => wxsource.once('load', done)); // highly recommended to await for the first load
}

async function twoLayersDemo() {
	const dataServerURL = 'https://tiles.metoceanapi.com/data/';
	const requestInit: RequestInit = {
		//  headers: new Headers([['x-api-key', '--proper-key-value--']]),
	}; // add more options if needed such as headers, mode, credentials, etc

	// Get the API ready - should be ONE per application
	WxTilesLogging(true); // If needed
	const wxapi = new WxAPI({ dataServerURL, maskURL: 'none', qtreeURL: 'none', requestInit });

	// Create a dataset manager (may be used for many layers from this dataset)
	const wxdatasetManager = await wxapi.createDatasetManager('gfs.global');

	// create a layer
	const leafletOptions = { id: 'wxsource', attribution: 'WxTiles' };
	const wxsource = wxdatasetManager.createSourceLayer({ variable: 'air.temperature.at-2m' }, leafletOptions);

	// create a layer
	const leafletOptions1 = { id: 'wxsource1', opacity: 0.5 };
	const wxsource1 = wxdatasetManager.createSourceLayer({ variable: 'air.visibility' }, leafletOptions1);

	// MAP
	const map = L.map('map', { center: [0, 0], zoom: 2, zoomControl: true });
	// add leaflet layerGroup to map
	const group = L.layerGroup([wxsource, wxsource1]).addTo(map);
	// create control
	const control = L.control.layers(undefined, { wxsource, wxsource1 }).addTo(map);
	// add the group to the control layer
	control.addOverlay(group, 'wxsources group');
}
