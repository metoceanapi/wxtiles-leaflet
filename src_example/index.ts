import 'leaflet/dist/leaflet.css';

import { start } from './start';
start();

/*
import L from 'leaflet'; // goes first always!
import { WxTileSource, WxAPI, WxTilesLogging, FrameworkOptions } from '../src/index';

start1();
async function start1() {
	//// Leaflet initialization START
	const map = L.map('map', { center: [0, 0], zoom: 2, zoomControl: true });
	// add navigation controls
	L.control.zoom({ position: 'bottomright' }).addTo(map);
	//// Leaflet initialization END

	//// Helper
	const addWxLayer = async (wxsource) => {
		map.addLayer(wxsource);
		await new Promise((done) => wxsource.once('load', done)); // highly recommended to await for the first load
	};

	const getCoords = (e) => e.latlng.wrap();
	//// Helpers END

	//// WXTILES START
	// grab the WxTiles API
	// const { WxTilesLogging, WxAPI } = window.wxtilesleaflet;

	WxTilesLogging(true); // log WxTiles info to console if needed

	const dataServerURL = 'https://tiles.metoceanapi.com/data/';
	// Get the API ready - should be ONE per application
	const wxapi = new WxAPI({ dataServerURL, maskURL: 'auto', qtreeURL: 'auto' });

	// Define the dataset and variable
	const datasetName = 'gfs.global';
	// const variable = 'air.temperature.at-2m'; // Scalar example
	const variable = 'wind.speed.eastward.at-10m'; // Vector example

	// Create a dataset manager (may be used for many layers from this dataset)
	const wxdatasetManager = await wxapi.createDatasetManager(datasetName);

	// create a layer
	const layerFrameworkOptions = { id: 'wxsource', opacity: 1, attribution: 'WxTiles' };
	const wxsource = wxdatasetManager.createSourceLayer({ variable, time: 0 }, layerFrameworkOptions);

	// add the layer to the map
	await addWxLayer(wxsource);

	// extra magic
	await wxsource.updateCurrentStyleObject({ streamLineColor: 'inverted' });
}
// */
