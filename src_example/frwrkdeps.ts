import L from 'leaflet';
import { WxGetColorStyles } from '../src';

export function flyTo(map: L.Map, zoom: number, lng: number, lat: number, bearing: number, pitch: number) {
	map.flyTo([lat, lng], zoom);
}

export function setURL(map: L.Map, time: string, datasetName: string, variable: string, style: any) {
	const base = WxGetColorStyles()['base'];
	for (const i in style) style[i] === base[i] && delete style[i]; // remove default values
	if (style.gl) {
		for (const i in style.gl) style.gl[i] === base.gl?.[i] && delete style.gl[i]; // remove default values from gl
		Object.keys(style.gl).length === 0 && delete style.gl; // remove gl if empty
	}
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
		zoom: 7,
		zoomControl: false,
	});

	L.control.zoom({ position: 'bottomright' }).addTo(map);

	// class WxDebugLayer extends L.GridLayer {
	// 	createTile(coords: { x: number; y: number; z: number }) {
	// 		const tile = document.createElement('div');
	// 		tile.innerHTML = [coords.x, coords.y, coords.z].join(', ');
	// 		tile.style.outline = '1px solid red';
	// 		return tile;
	// 	}
	// }
	// map.addLayer(new WxDebugLayer().setZIndex(1000));

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

export async function addLayer(map: L.Map, idL: string, layer: L.Layer) {
	map.addLayer(layer);
	await new Promise((done) => layer.once('load', done)); // highly recommended to await for the first load
}

export function addRaster(map: L.Map, idS: string, idL: string, URL: string, maxZoom: number, bounds?: any) {
	const layer = L.tileLayer(URL, { id: idS, maxNativeZoom: maxZoom, zIndex: idL === 'baseL' ? 1 : 0 });
	map.addLayer(layer);
}
