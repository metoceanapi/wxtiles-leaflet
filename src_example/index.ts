import 'leaflet/dist/leaflet.css';
import L from 'leaflet'; // goes first always!

import { WxAPI } from '../src/wxAPI/wxAPI';
import { WxVars } from '../src/wxlayer/wxlayer';
import { WxTileSource } from '../src/tilesLayer';
import { WxTilesLogging } from '../src/utils/wxtools';
let map: L.Map;

async function start() {
	// Leaflet basic setup // set the main Leaflet's map object, compose and add base layers
	map = L.map('map', {
		center: [-40.75, 174.5],
		zoom: 3,
		zoomControl: false,
	});

	const dataServerURL = 'https://tiles.metoceanapi.com/data/';
	// const dataServerURL = 'http://tiles3.metoceanapi.com/';
	const myHeaders = new Headers();
	// myHeaders.append('x-api-key', 'SpV3J1RypVrv2qkcJE91gG');
	const wxapi = new WxAPI({ dataServerURL, maskURL: 'none', qtreeURL: 'none', requestInit: { headers: myHeaders } });
	// WxTilesLogging(true);
	const datasetName = 'gfs.global'; /* 'mercator.global/';  */ /* 'ecwmf.global/'; */ /* 'obs-radar.rain.nzl.national/'; */
	// const variables: WxVars = ['air.temperature.at-2m'];
	const variables: WxVars = ['wind.speed.eastward.at-10m', 'wind.speed.northward.at-10m'];

	// const datasetName = 'ww3-ecmwf.global';
	// const variables = ['wave.direction.mean'];

	// const datasetName = 'obs-radar.rain.nzl.national';
	// const variables = ['reflectivity'];

	const wxdatasetManager = await wxapi.createDatasetManager(datasetName);

	const wxlayer = new WxTileSource({
		wxstyleName: 'base',
		wxdatasetManager,
		variables,
		time: 0,
		options: {
			opacity: 1,
		},
	});

	map.once('click', async () => {
		console.log(wxlayer.getTime());
		await wxlayer.setTime(10);
		console.log(wxlayer.getTime());
	});

	wxlayer.startAnimation();

	wxlayer.addTo(map);

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

	/*/ DEMO: read lon lat data
	let popup: mapboxgl.Popup = new mapboxgl.Popup({ closeOnClick: false }).setLngLat([0, 0]).setHTML('').addTo(map);
	map.on('mousemove', (e) => {
		popup.setHTML(`${e.lngLat}`);
		const tileInfo: WxTileInfo | undefined = wxsource.getLayerInfoAtLatLon(e.lngLat.wrap(), map);
		if (tileInfo) {
			const { min, max } = wxsource.getMetadata();
			let content = `lnglat=(${e.lngLat.lng.toFixed(2)}, ${e.lngLat.lat.toFixed(2)})<br>
			dataset=${wxmanager.datasetName}<br>
			variables=${wxsource.getVariables()}<br>
			style=${tileInfo.inStyleUnits.map((d) => d.toFixed(2))} ${tileInfo.styleUnits}<br>
			source=${tileInfo.data.map((d) => d.toFixed(2))} ${tileInfo.dataUnits}<br>
			min=${min.toFixed(2)} ${tileInfo.dataUnits}, max=${max.toFixed(2)} ${tileInfo.dataUnits}<br>
			time=${wxsource.getTime()}`;
			popup.setHTML(content);
		}

		popup.setLngLat(e.lngLat);
	}); //*/

	// DEMO: timesteps
	const tlength = wxdatasetManager.getTimes().length;
	let t = 0;
	const nextTimeStep = async () => {
		await wxlayer.setTime(t++ % tlength); // await always !!
		setTimeout(nextTimeStep, 0);
	};
	setTimeout(nextTimeStep, 2000);
	//*/

	/*/ DEMO: Dynamic blur effect /
	let b = 0;
	let db = 1;
	const nextAnim = async () => {
		await wxlayer.updateCurrentStyleObject({ blurRadius: b }); // await always !!

		b += db;
		if (b > 16 || b < 0) db = -db;
		setTimeout(nextAnim, 1);
	};
	setTimeout(nextAnim, 2000); //*/
}

start();
