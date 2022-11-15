import 'leaflet/dist/leaflet.css';
import L from 'leaflet'; // goes first always!

import { WxTileSource, type WxVars, WxAPI, WxTilesLogging, type WxTileInfo } from '../src/index';
import { WxLegendControl } from '../src/controls/WxLegendControl';
import { WxStyleEditorControl } from '../src/controls/WxStyleEditorControl';
import { WxInfoControl } from '../src/controls/WxInfoControl';
import { WxTimeControl } from '../src/controls/WxTimeControl ';
import { WxAPIControl } from '../src/controls/WxAPIControl';

start();

const OPACITY = 1;

// this is universal function for Leaflet and Mapbox.
// Functions below are just framework specific wrappers for this universal function
// start() is the fully interchangable function for Leaflet and Mapbox
async function start() {
	const map = await initFrameWork();
	addRaster(map, 'baseS', 'baseL', 'https://tiles.metoceanapi.com/base-lines/{z}/{x}/{y}', 5);
	WxTilesLogging(false);
	const dataServerURL = 'http://localhost:9191/data/';
	// const dataServerURL = 'https://tiles.metoceanapi.com/data/';
	// const dataServerURL = 'http://tiles3.metoceanapi.com/';
	const myHeaders = new Headers();
	// myHeaders.append('x-api-key', 'SpV3J1RypVrv2qkcJE91gG');
	const wxapi = new WxAPI({ dataServerURL, maskURL: 'none', qtreeURL: 'none', requestInit: { headers: myHeaders } });

	// let datasetName = 'gfs.global'; /* 'mercator.global/';  */ /* 'ecwmf.global/'; */ /* 'obs-radar.rain.nzl.national/'; */
	// let variables: WxVars = ['air.temperature.at-2m'];
	// let variables: WxVars = ['wind.speed.eastward.at-10m', 'wind.speed.northward.at-10m'];

	let datasetName = 'ww3-ecmwf.global';
	let variables: WxVars = ['wave.direction.mean'];

	// let datasetName = 'obs-radar.rain.nzl.national';
	// let variables: WxVars = ['reflectivity'];

	// get datasetName from URL
	let time = '';
	let zoom = 0;
	let lat = 0;
	let lng = 0;
	let bearing = 0;
	let pitch = 0;
	const urlParams = window.location.toString().split('#')[1];
	if (urlParams) {
		const params = urlParams.split('/');
		if (params.length > 0) datasetName = params[0];
		if (params.length > 1) variables = params[1].split(',') as WxVars;
		if (params.length > 2) time = params[2];
		if (params.length > 3) zoom = parseFloat(params[3]);
		if (params.length > 4) lng = parseFloat(params[4]);
		if (params.length > 5) lat = parseFloat(params[5]);
		if (params.length > 6) bearing = parseFloat(params[6]);
		if (params.length > 7) pitch = parseFloat(params[7]);
		flyTo(map, zoom, lng, lat, bearing, pitch);
	}

	map.on('zoom', () => setURL(map, time, datasetName, variables));
	map.on('drag', () => setURL(map, time, datasetName, variables));
	map.on('rotate', () => setURL(map, time, datasetName, variables));
	map.on('pitch', () => setURL(map, time, datasetName, variables));

	const frameworkOptions = { id: 'wxsource', opacity: OPACITY, attribution: 'WxTiles' };

	let wxsource: WxTileSource | undefined;

	const legendControl = new WxLegendControl();
	addControl(map, legendControl, 'top-right');

	const apiControl = new WxAPIControl(wxapi, datasetName, variables[0]);
	addControl(map, apiControl, 'top-left');

	const timeControl = new WxTimeControl(10);
	addControl(map, timeControl, 'top-left');
	timeControl.onchange = (time_) => setURL(map, (time = time_), datasetName, variables);

	const customStyleEditorControl = new WxStyleEditorControl();
	addControl(map, customStyleEditorControl, 'top-left');
	customStyleEditorControl.onchange = async (style) => {
		if (!wxsource) return;
		await wxsource.updateCurrentStyleObject(style);
		const nstyle = wxsource.getCurrentStyleObjectCopy();
		legendControl.drawLegend(nstyle);
		customStyleEditorControl.setStyle(nstyle);
	};

	const infoControl = new WxInfoControl();
	addControl(map, infoControl, 'bottom-left');
	map.on('mousemove', (e) => infoControl.update(wxsource, map, position(e)));

	apiControl.onchange = async (datasetName_: string, variable: string): Promise<void> => {
		// remove existing source and layer
		removeLayer(map, frameworkOptions.id, wxsource);
		//
		wxsource = undefined;
		datasetName = datasetName_;
		const wxdatasetManager = await wxapi.createDatasetManager(datasetName);
		const meta = wxdatasetManager.meta.variablesMeta[variable];
		variables = meta?.vector || [variable]; // check if variable is vector and use vector components if so
		//
		if (wxdatasetManager.meta.variablesMeta[variable]?.units === 'RGB') {
			addRaster(map, frameworkOptions.id, 'wxtiles', wxdatasetManager.createURI(variables[0], 0), wxdatasetManager.meta.maxZoom);
			timeControl.setTimes(wxdatasetManager.meta.times);
			legendControl.clear();
		} else {
			wxsource = new WxTileSource({ wxdatasetManager: await wxapi.createDatasetManager(datasetName), variables }, frameworkOptions);
			await addLayer(map, frameworkOptions.id, 'wxtiles', wxsource);
			await customStyleEditorControl.onchange?.(wxsource.getCurrentStyleObjectCopy());
			legendControl.drawLegend(wxsource.getCurrentStyleObjectCopy());
			timeControl.updateSource(wxsource);
		}
	};

	await apiControl.onchange(datasetName, variables[0]); // initial load

	/*/ DEMO: more interactive - additional level and a bit of the red transparentness around the level made from current mouse position6
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
	let b = 0;
	let db = 1;
	const nextAnim = async () => {
		if (!wxsource) return;
		await wxsource.updateCurrentStyleObject({ blurRadius: b }); // await always !!

		b += db;
		if (b > 16 || b < 0) db = -db;
		setTimeout(nextAnim, 1);
	};
	setTimeout(nextAnim, 2000); //*/
}

function flyTo(map: L.Map, zoom: number, lng: number, lat: number, bearing: number, pitch: number) {
	map.flyTo([lat, lng], zoom);
}
function setURL(map: L.Map, time: string, datasetName: string, variables: string[]) {
	const center = map.getCenter();
	location.href = `#${datasetName}/${variables.join(',')}/${time}/${map.getZoom().toFixed(2)}/${center.lng.toFixed(2)}/${center.lat.toFixed(2)}`;
}

async function initFrameWork() {
	let map: L.Map;
	map = L.map('map', {
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
