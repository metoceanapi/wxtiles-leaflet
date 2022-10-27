import 'leaflet/dist/leaflet.css';
import L from 'leaflet'; // goes first always!

import { WxTileSource, type WxVars, WxAPI, WxTilesLogging, type WxTileInfo } from '../src/index';
import { WxLegendControl } from '../src/controls/WxLegendControl';
import { WxStyleEditorControl } from '../src/controls/WxStyleEditorControl';

async function start() {
	// Leaflet basic setup // set the main Leaflet's map object, compose and add base layers
	let map: L.Map;
	map = L.map('map', {
		center: [-40.75, 174.5],
		zoom: 3,
		zoomControl: false,
	});

	L.control.zoom({ position: 'bottomright' }).addTo(map);

	//******* WxTiles stuff *******//
	WxTilesLogging(false);
	// const dataServerURL = 'http://localhost:9191/data/';
	const dataServerURL = 'https://tiles.metoceanapi.com/data/';
	// const dataServerURL = 'http://tiles3.metoceanapi.com/';
	const myHeaders = new Headers();
	// myHeaders.append('x-api-key', 'SpV3J1RypVrv2qkcJE91gG');
	const wxapi = new WxAPI({ dataServerURL, maskURL: 'none', qtreeURL: 'none', requestInit: { headers: myHeaders } });

	// const datasetName = 'wrf-ecmwf.gbr.national'; /* 'mercator.global/';  */ /* 'ecwmf.global/'; */ /* 'obs-radar.rain.nzl.national/'; */
	// const variables: WxVars = ['air.temperature.at-2m'];

	const datasetName = 'gfs.global'; /* 'mercator.global/';  */ /* 'ecwmf.global/'; */ /* 'obs-radar.rain.nzl.national/'; */
	const variables: WxVars = ['air.temperature.at-2m'];
	// const variables: WxVars = ['wind.speed.eastward.at-10m', 'wind.speed.northward.at-10m'];

	// const datasetName = 'ww3-ecmwf.global';
	// const variables: WxVars = ['wave.direction.mean'];

	// const datasetName = 'obs-radar.rain.nzl.national';
	// const variables: WxVars = ['reflectivity'];

	const wxdatasetManager = await wxapi.createDatasetManager(datasetName);

	const wxsource = new WxTileSource(
		{
			wxdatasetManager,
			variables,
		},
		{
			opacity: 0.5,
			attribution: 'WxTiles',
		}
	);

	wxsource.addTo(map);
	await new Promise((done) => wxsource.once('load', done)); // highly recommended to await for the first load

	const legendControl = new WxLegendControl();
	map.addControl(new (L.Control.extend(legendControl.extender()))({ position: 'topright' }));

	const editor = new WxStyleEditorControl();
	map.addControl(new (L.Control.extend(editor.extender()))({ position: 'topleft' }));

	const styleChanged = (editor.onchange = async (style) => {
		await wxsource.updateCurrentStyleObject(style);
		const nstyle = wxsource.getCurrentStyleObjectCopy();
		legendControl.drawLegend(nstyle);
		editor.setStyle(nstyle);
	});

	await styleChanged({ streamLineColor: 'inverted', streamLineStatic: false }); // await always !!
	console.log('time', wxsource.getTime());

	// DEMO (leaflet): more interactive - additional level and a bit of the red transparentness around the level made from current mouse position6
	let busy = false;
	await wxsource.updateCurrentStyleObject({ units: 'C', levels: undefined }); // await always !!
	const levels = wxsource.getCurrentStyleObjectCopy().levels || []; // get current/default/any levels
	const colMap: [number, string][] = levels.map((level) => [level, '#' + Math.random().toString(16).slice(2, 8) + 'ff']);
	map.on('mousemove', async (e) => {
		const pos = e.latlng;
		if (busy) return;
		busy = true;
		const tileInfo: WxTileInfo | undefined = wxsource.getLayerInfoAtLatLon(pos.wrap(), map);
		if (tileInfo) {
			await styleChanged({ colorMap: [...colMap, [tileInfo.inStyleUnits[0], '#ff000000']] }); // await always !!
		}
		busy = false;
	}); //*/

	/*/ DEMO: abort
	const abortController = new AbortController();
	console.log('setTime(5)');
	const prom = wxsource.setTime(5, abortController);
	abortController.abort(); // aborts the request
	await prom; // await always !! even if aborted
	console.log('aborted');
	await wxsource.setTime(5); // no abort
	console.log('setTime(5) done'); //*/

	/*/ DEMO: preload a timestep
	map.once('click', async () => {
		console.log('no preload time=5');
		const t = Date.now();
		await wxsource.setTime(5); // await always !! or abort
		console.log(Date.now() - t);
		await wxsource.preloadTime(10); // await always !! even if aborted
		await wxsource.preloadTime(20); // await always !! even if aborted
		console.log('preloaded timesteps 10, 20');
		map.once('click', async () => {
			const t = Date.now();
			await wxsource.setTime(10); // await always !! or abort
			console.log(Date.now() - t, ' step 10');
			map.once('click', async () => {
				const t = Date.now();
				await wxsource.setTime(20); // await always !! or abort
				console.log(Date.now() - t, ' step 20');
			});
		});
	}); //*/

	/*/ DEMO: change style's units
	let i = 0;
	map.on('click', async () => {
		const u = ['knots', 'm/s', 'km/h', 'miles/h'];
		await wxsource.updateCurrentStyleObject({ units: u[i], levels: undefined }); // levels: undefined - to recalculate levels
		legendControl.drawLegend(wxsource.getCurrentStyleObjectCopy());
		i = (i + 1) % u.length;
	}); //*/

	// DEMO (leaflet): read lon lat data
	map.on('mousemove', (e) => {
		const pos = e.latlng; // (leaflet)
		const tileInfo: WxTileInfo | undefined = wxsource.getLayerInfoAtLatLon(pos.wrap(), map);
		if (tileInfo) {
			const { min, max } = wxsource.getMetadata();
			let content = `lnglat=(${pos.lng.toFixed(2)}, ${pos.lat.toFixed(2)})<br>
			dataset=${wxsource.wxdatasetManager.datasetName}<br>
			variables=${wxsource.getVariables()}<br>
			style=${tileInfo.inStyleUnits.map((d) => d.toFixed(2))} ${tileInfo.styleUnits}<br>
			source=${tileInfo.data.map((d) => d.toFixed(2))} ${tileInfo.dataUnits}<br>
			min=${min.toFixed(2)} ${tileInfo.dataUnits}, max=${max.toFixed(2)} ${tileInfo.dataUnits}<br>
			time=${wxsource.getTime()}`;
			L.popup() // (leaflet)
				.setLatLng(pos)
				.setContent(content + `${pos}`)
				.openOn(map);
		}
	}); //*/

	/*/ DEMO: timesteps
	const tlength = wxsource.wxdatasetManager.getTimes().length;
	let t = 0;
	const nextTimeStep = async () => {
		await wxsource.setTime(t++ % tlength); // await always !!
		setTimeout(nextTimeStep, 0);
	};
	setTimeout(nextTimeStep, 2000);
	//*/

	/*/ DEMO: Dynamic blur effect /
	let b = 0;
	let db = 1;
	const nextAnim = async () => {
		await wxsource.updateCurrentStyleObject({ blurRadius: b }); // await always !!

		b += db;
		if (b > 16 || b < 0) db = -db;
		setTimeout(nextAnim, 1);
	};
	setTimeout(nextAnim, 2000); //*/
}

start();
