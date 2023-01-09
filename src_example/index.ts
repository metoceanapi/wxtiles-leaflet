import 'leaflet/dist/leaflet.css';

import { start } from './start';
start();

/*
import L from 'leaflet'; // goes first always!
import { WxTileSource, WxAPI, WxTilesLogging, FrameworkOptions } from '../src/index';
// simpleDemo();
// twoLayersDemo();

async function simpleDemo() {
	const map = L.map('map', { center: [0, 0], zoom: 2, zoomControl: true });

	const dataServerURL = 'https://tiles.metoceanapi.com/data/';
	// const headers = new Headers();
	// headers.append('x-api-key', '--proper-key-value--'); // If needed in the future
	const requestInit: RequestInit = {
		// headers //
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
*/
