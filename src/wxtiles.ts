// https://everythingfonts.com/ttf-to-woff - converter
// https://caniuse.com/?search=woff
import './styles.css';

import L from 'leaflet';
import { WxTilesLayerSettings, WxTilesLayer } from './tilesLayer';

export { WxTilesLibSetup, WxGetColorStyles, ColorStylesWeakMixed, Units, ColorSchemes, LibSetupObject } from './wxtools';

export function CreateWxTilesLayer(settings: WxTilesLayerSettings): WxTilesLayer {
	return new WxTilesLayer(settings);
}

// const WatermarkProto = {
// 	options: { URI: '' },
// 	onAdd() {
// 		const w = document.createElement('img');
// 		w.src = this.options.URI;
// 		w.className = 'wxtiles-logo';
// 		return w;
// 	},
// };
// const WxWatermark = L.Control.extend(WatermarkProto);

class WxWatermark extends L.Control {
	URI: string;
	constructor(options: L.ControlOptions & { URI: string }) {
		super(options);
		this.URI = options.URI;
	}
	onAdd() {
		const w = document.createElement('img');
		w.src = this.URI;
		w.className = 'wxtiles-logo';
		return w;
	}
}

export function WxTilesWatermark(options: any): WxWatermark {
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

export function WxDebugCoordsLayer(): L.GridLayer {
	if (window.wxlogging) {
		console.log('Add WxDebugCoordsLayer:');
	}
	const debLayer = new WxDebugLayer();
	debLayer.setZIndex(1000);
	return debLayer;
}

export function WxTilesGroupLayer(group: WxTilesLayerSettings[], options?: L.LayerOptions | undefined) {
	return L.layerGroup(group.map(CreateWxTilesLayer), options);
}

export function WxTilesLogging(on: boolean) {
	if (on) {
		console.log('Logging on');
	} else {
		console.log('Logging off');
	}
	window.wxlogging = on;
}
