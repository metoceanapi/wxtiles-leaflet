// https://everythingfonts.com/ttf-to-woff - converter
// https://caniuse.com/?search=woff
import './styles.css';

import L from 'leaflet';

import { WXLOG } from './wxtools';
import { WxTilesLayer, WxTilesLayerSettings } from './tilesLayer';

export { WxTilesLibSetup, WxGetColorStyles, ColorStylesWeakMixed, Units, ColorSchemes, LibSetupObject } from './wxtools';
export { WxTilesLayer, WxTilesLayerSettings, DataSource } from './tilesLayer';

export function CreateWxTilesLayer(settings: WxTilesLayerSettings): WxTilesLayer {
	return new WxTilesLayer(settings);
}

export class WxWatermark extends L.Control {
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

export function CreateWxTilesWatermark(options: any): WxWatermark {
	if (window.wxlogging) {
		console.log('Add watermark:', JSON.stringify(options));
	}

	return new WxWatermark(options);
}

export class WxDebugLayer extends L.GridLayer {
	createTile(coords: { x: number; y: number; z: number }) {
		const tile = document.createElement('div');
		tile.innerHTML = [coords.x, coords.y, coords.z].join(', ');
		tile.style.outline = '1px solid red';
		return tile;
	}
}

export function CreateWxDebugCoordsLayer(): WxDebugLayer {
	WXLOG('Add WxDebugCoordsLayer:');
	return new WxDebugLayer().setZIndex(1000);
}

export function CreateWxTilesGroupLayer(group: WxTilesLayerSettings[], options?: L.LayerOptions): L.LayerGroup<any> {
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
