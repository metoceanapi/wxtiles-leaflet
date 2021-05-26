import { WxGridLayerProto } from './tileLayer';
export { WxTileLibSetup, WxGetColorStyles, ColorStylesWeakMixed, Units, ColorSchemes } from './wxtools';

// import * as L from 'leaflet';
const L = window.L;
const WxGridLayerL = L.GridLayer.extend(WxGridLayerProto);

export function WxTileLayer(settings: any) {
	const layer = new WxGridLayerL();
	layer.initializeLayer(settings);
	return layer;
}

const WatermarkProto = {
	options: { URI: '' },
	onAdd() {
		const w = document.createElement('img');
		w.src = this.options.URI;
		w.className = 'wxtiles-logo';
		return w;
	},
};

const WxWatermark = L.Control.extend(WatermarkProto);

export function WxTileWatermark(options: any) {
	if (window.wxlogging) {
		console.log('Add watermark:', JSON.stringify(options));
	}

	return new WxWatermark(options);
}

const WxDebugLayer = L.GridLayer.extend({
	createTile(coords: { x: number; y: number; z: number }) {
		const tile = document.createElement('div');
		tile.innerHTML = [coords.x, coords.y, coords.z].join(', ');
		tile.style.outline = '1px solid red';
		return tile;
	},
});

export function WxDebugCoordsLayer() {
	if (window.wxlogging) {
		console.log('Add WxDebugCoordsLayer:');
	}
	const debLayer = new WxDebugLayer();
	debLayer.setZIndex(1000);
	return debLayer;
}

export function WxTileGroupLayer(group) {
	return L.layerGroup(group.map(WxTileLayer));
}

export function WxTileLogging(on) {
	if (on) {
		console.log('Logging on');
	} else {
		console.log('Logging off');
	}
	window.wxlogging = on;
}
