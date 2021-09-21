// https://everythingfonts.com/ttf-to-woff - converter
// https://caniuse.com/?search=woff
import './styles.css';

import { WxGridLayerProto } from './tileLayer';
export { WxTilesLibSetup, WxGetColorStyles, ColorStylesWeakMixed, Units, ColorSchemes, LibSetupObject } from './wxtools';

import L from 'leaflet';

// const L = window.L;
const WxGridLayerL = L.GridLayer.extend(WxGridLayerProto);

export interface WxTilesLayerSettings {
	dataSource: {
		serverURI: string; // server to fetch data from
		ext: string; // png / webp (default) - wxtilesplitter output format
		dataset: string; // dataset of the dataset
		variables: string[]; // variabls to be used for the layer rendering
		name: string; // attribute of the dataSource to be used externally
		styleName: string; // The name of the style (from styles.json) to apply for the layer
	};
	// Lazy setup
	// 'true': perform setup and data loading on 'addTo(map)'.
	// 'false': start loading immediately, but loading is not finished when layer is created.
	// the signal 'setupcomplete' is fired when loading is finished.
	// useful when a big bunch of layers is used, so layers are not wasting memory and bandwidth.
	lazy: boolean;
	options: any; // leaflet's options for the layer
}

export interface WxLayer extends L.GridLayer {
	getSetupCompletePromise(): Promise<void>;
	getTile(latlng: { lat: number; lng: number }): {
		data: number;
		raw: number;
		rgba: number;
		hexColor: string;
		inStyleUnits: number;
		tilePoint: { x: number; y: number };
		units: string;
	};
	setStyle(name: string): void;
	getStyle(): string;
	getStyleName(): string;
	setTime(unixTime: number): Promise<void> | undefined;
	getTime(): string;
	getTimes(): string[];
	checkDataChanged(): Promise<boolean>;
	reloadData(): void;
	getLegendData(legendSize: number): {
		// legendSize - width of a canvas to render this legend
		units: string;
		colors: Uint32Array; // legend colors RGBA
		ticks: {
			data: number; //  (float) data in legend units
			color: string; // representation of a color at this tick
			pos: number; //   (int) position in pixels of this tick on the legend. If style uses values out of data's range it clamps pos to (0, pixSize)
		}[];
	};
	setTimeAnimationMode(l: number): void;
	unsetTimeAnimationMode(): void;
	getMinMax(): {
		// layer data's min max
		min: number;
		max: number;
	};
}

export function WxTilesLayer(settings: WxTilesLayerSettings): WxLayer {
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

export function WxTilesWatermark(options: any) {
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

export function WxTilesGroupLayer(group) {
	return L.layerGroup(group.map(WxTilesLayer));
}

export function WxTilesLogging(on) {
	if (on) {
		console.log('Logging on');
	} else {
		console.log('Logging off');
	}
	window.wxlogging = on;
}
