import L from 'leaflet';
import { WxGetColorStyles } from '../src';

export function flyTo(map: L.Map, zoom: number, lng: number, lat: number, bearing: number, pitch: number) {
	map.flyTo([lat, lng], zoom);
}

export function setURL(map: L.Map, time: string, datasetName: string, variable: string, style: any) {
	const base = WxGetColorStyles()['base'];
	for (const i in style) style[i] === base[i] && delete style[i]; // remove default values

	const center = map.getCenter().wrap();
	const href =
		`##${datasetName}/${variable}/${time}/${map.getZoom().toFixed(2)}/${center.lng.toFixed(2)}/${center.lat.toFixed(2)}/0/0` +
		(style ? '/' + JSON.stringify(style) : '');

	history.replaceState(null, '', href);
	// location.href = `#${datasetName}/${variables.join(',')}/${time}/${map.getZoom().toFixed(2)}/${center.lng.toFixed(2)}/${center.lat.toFixed(2)}`;
}

export async function initFrameWork() {
	const map = L.map('map', {
		center: [-40.75, 174.5],
		zoom: 3,
		zoomControl: false,
	});

	L.control.zoom({ position: 'bottomright' }).addTo(map);
	return map;
}

export function addControl(map: L.Map, control: { extender: () => any }, position: string) {
	position = position.replace('-', '');
	map.addControl(new (L.Control.extend(control.extender()))({ position: position as any }));
}

export function position(e: L.LeafletMouseEvent): L.LatLng {
	return e.latlng.wrap(); // (mapbox)
}

export function removeLayer(map: L.Map, layerId: string, layer?: L.Layer) {
	map.eachLayer((l: any) => {
		if (l.options.id === layerId) {
			map.removeLayer(l);
		}
	});
}

export async function addLayer(map: L.Map, idS: string, idL: string, layer: L.Layer) {
	map.addLayer(layer);
	await new Promise((done) => layer.once('load', done)); // highly recommended to await for the first load
}

export function addRaster(map: L.Map, idS: string, idL: string, URL: string, maxZoom: number) {
	const layer = L.tileLayer(URL, { id: idS, maxNativeZoom: maxZoom, zIndex: idL === 'baseL' ? 100 : 0 });
	map.addLayer(layer);
}
