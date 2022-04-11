// https://stackoverflow.com/questions/36471220/how-can-i-convert-a-uint8array-with-offset-into-an-int32array
// tile.style.pointerEvents = `auto`; tile.addEventListener(`click`, function(e) {console.log(`X=` + e.offsetX + ` Y=` + e.offsetY + ` ` + coords);});

import L from 'leaflet';

import { RawCLUT, createLegend, Legend } from './utils/RawCLUT';
import { newWxTile, TileEl, WxTile } from './tile';
import {
	loadDataIntegralCachedAbortable,
	fetchJson,
	RGBtoHEX,
	WxGetColorStyles,
	ColorStylesStrict,
	WXLOG,
	ColorStyleStrict,
	AbortableCacheableURILoaderPromiseFunc,
	getClosestTimeString,
	DataIntegral,
	loadImageDataCachedAbortable,
	refineColor,
} from './utils/wxtools';

// A SINGLETON
let loadMaskFunc: AbortableCacheableURILoaderPromiseFunc<ImageData> | undefined = undefined;

export function WxInitLoadMaskFunc(requestInit?: RequestInit) {
	loadMaskFunc = loadImageDataCachedAbortable(requestInit);
}

export interface WxTileInfo {
	wxtile: WxTile;
	data: number[];
	raw: number[];
	rgba: number[];
	hexColor: string[];
	inStyleUnits: number[];
	tilePoint: { x: number; y: number };
	styleUnits: string;
	dataUnits: string;
}

export interface VariableMeta {
	[name: string]: {
		units: string;
		min: number;
		max: number;
	};
}

export interface BoundaryMeta {
	west: number;
	north: number;
	east: number;
	south: number;
}

export interface AllBoundariesMeta {
	boundariesnorm: BoundaryMeta;
	boundaries180: BoundaryMeta[];
	boundaries360: BoundaryMeta[];
}

export interface Meta {
	variables: string[];
	variablesMeta: VariableMeta;
	maxZoom: number;
	times: string[];
	boundaries?: AllBoundariesMeta;
}

export interface DataSource {
	serverURI: string; // server to fetch data from
	maskServerURI: string; // server to fetch MASK from
	ext: 'webp' | 'png'; // png / webp (default) - wxtilesplitter output format
	dataset: string; // dataset of the dataset
	variables: string[]; // variabls to be used for the layer rendering
	name: string; // attribute of the dataSource to be used externally
	styleName: string; // The name of the style (from styles.json) to apply for the layer
	requestInit?: RequestInit; // requestInit to be used for the layer's data loading
}

export interface WxLayerState {
	currentTime: string;
	baseURL: string;
	minmax: [number, number][];
	instance: string;
	originURI: string;
	units: string;
	meta: Meta;
	vector: boolean;
}

export interface WxTilesLayerSettings {
	// Lazy setup
	// 'true': perform setup and data loading on 'addTo(map)'.
	// 'false': start loading immediately, but loading is not finished when layer is created.
	// the setupCompletePromise is resolved when loading is finished.
	// useful when a big bunch of layers is used, so layers are not wasting memory and bandwidth.
	lazy?: boolean;
	dataSource: DataSource;
	options: L.GridLayerOptions; // leaflet's options for the layer
}

export class WxTilesLayer extends L.GridLayer {
	protected styles: ColorStylesStrict = WxGetColorStyles();
	protected redrawRequestID: number = 0;
	protected vectorAnimationRequestID: number = 0;
	protected oldMaxZoom: number = 0;

	setupCompletePromise: Promise<void>;
	dataSource: DataSource;

	style: ColorStyleStrict = Object.assign({}, this.styles['base']);
	clut: RawCLUT = new RawCLUT(this.style, '', [0, 2], false);

	loadDataIntegralFunc: AbortableCacheableURILoaderPromiseFunc<DataIntegral>;
	loadMaskFunc: AbortableCacheableURILoaderPromiseFunc<ImageData>;

	state: WxLayerState; // it will be filled after setupCompletePromise is resolved

	animation: boolean = true; // vector stream lines animation enabled by default

	constructor(settings: WxTilesLayerSettings) {
		super(settings.options);
		const { dataSource, lazy } = settings;

		WXLOG('Creating a WxTiles layer:', dataSource.name, '. Params:', JSON.stringify(settings));

		if (
			!dataSource ||
			!dataSource.ext ||
			!dataSource.dataset ||
			!dataSource.name ||
			!dataSource.serverURI ||
			!dataSource.styleName ||
			!Array.isArray(dataSource.variables)
		) {
			WXLOG('dataSource is wrong!');
			throw new Error('dataSource is wrong!');
		}

		this.dataSource = dataSource;
		this.state = {
			originURI: dataSource.serverURI + '/' + dataSource.dataset + '/',
			units: '',
			baseURL: '',
			meta: { maxZoom: 0, times: [], variables: [], variablesMeta: {} },
			instance: '',
			minmax: [[0, 1]],
			currentTime: '',
			vector: dataSource.variables.length > 1,
		};

		this.loadDataIntegralFunc = loadDataIntegralCachedAbortable(dataSource.requestInit);
		if (!loadMaskFunc) loadMaskFunc = loadImageDataCachedAbortable(dataSource.requestInit);
		this.loadMaskFunc = loadMaskFunc;

		const checkZoom = () => {
			// used in onAddLayer() & onRemoveLayer()
			// if zoom > maxZoom then the same tiles are used, so could be loaded from cache.
			if (this._map?.getZoom() < this.state.meta.maxZoom) {
				this._stopLoadingResetLoadDataFunc(); // Otherwise cache should be reset
			}
		};

		// onAdd is used in the leaflet library! so I renamed it.
		const onAddLayer = () => {
			WXLOG('onadd:', this.dataSource.name);
			if (!this._map) {
				throw new Error('_map is not set!');
			}
			this._map.on('zoomstart', checkZoom); // fired when tiles are about to start loading... when zoom or shift

			// by deafault (in the Base style), it starts animation even if the layer is not fully initialized yet.
			// and keep animating until:
			// 1. the layer is removed from the map
			// 2. the layer is not a vector layer
			// 3. current style stops animation
			this._checkAndStartVectorAnimation();
		};

		const onRemoveLayer = () => {
			WXLOG('onremove:', this.dataSource.name);
			if (!this._map) {
				throw new Error('_map is not set!');
			}
			this._map.off('zoomstart', checkZoom);
			this._stopLoadingResetLoadDataFunc(); // remove the data cache anyway
		};

		this.on('remove', onRemoveLayer);
		this.on('add', onAddLayer);

		this.setupCompletePromise = new Promise((resolve /*, reject*/): void => {
			const initialSetup = async () => {
				WXLOG('Setup:', dataSource.name);
				await this._setUpDataSet();
				WXLOG('Setup complete: ', this.dataSource.name);

				resolve(); // resolve setupCompletePromise
			}; // initialSetup function

			if (lazy) {
				this.once('add', initialSetup); // Lazy loading // sets it up only if user wants to visualise it
			} else {
				initialSetup();
			}
		}); // new setupCompletePromise
	} // constructor

	protected async _setUpDataSet(): Promise<void> {
		const { state, dataSource } = this;
		try {
			state.instance = ((await fetchJson(state.originURI + 'instances.json')) as string[]).pop() + '/';
		} catch (e) {
			const error = dataSource.name + ': load instances.json error: ' + e;
			WXLOG(error);
			throw new Error(error);
		}

		try {
			const URI = state.originURI + state.instance + 'meta.json';
			state.meta = (await fetchJson(URI)) as Meta;
		} catch (e) {
			const error = dataSource.name + ': load meta.json error: ' + e;
			WXLOG(error);
			throw new Error(error);
		}

		state.vector = dataSource.variables.length === 2;

		const { variablesMeta } = state.meta;
		state.units = variablesMeta[dataSource.variables[0]].units;
		state.minmax = dataSource.variables.map((v) => [variablesMeta[v].min, variablesMeta[v].max]);
		if (state.vector) {
			const [[udmin, udmax], [vdmin, vdmax]] = state.minmax;
			state.minmax.unshift([0, 1.42 * Math.max(-udmin, udmax, -vdmin, vdmax)]);
		}

		this._setStyleAndCLUT(dataSource.styleName); // calculate the CLUT
		this._setTimeUrl(new Date());
	} // _setUpDataSet

	protected async _requestReloadTilesAndRedraw(): Promise<boolean> {
		const ok = await this._requestReloadTiles();
		ok && this._redrawTiles(); // if not aborted, redraw
		return ok;
	}

	protected async _requestReloadTiles(): Promise<boolean> {
		WXLOG(`_requestReloadTiles: start - ${this.dataSource.name}`);
		const { controller } = this.loadDataIntegralFunc.controllerHolder; // save current controller ...
		await Promise.allSettled(this._ForEachWxTile((wxtile) => wxtile.load()));
		WXLOG(`_requestReloadTiles: end - ${this.dataSource.name}, aborted: ${controller.signal.aborted}`);
		return !controller.signal.aborted;
	} // _requestReloadTiles

	setStyle(styleName: string): void {
		WXLOG('setStyle(', styleName, ') for ', this.dataSource.name);
		if (styleName === 'custom' || styleName !== this.dataSource.styleName) {
			// if styleName is 'custom' or different from current styleName
			this._setStyleAndCLUT(styleName);
			this._checkAndStartVectorAnimation();
			this._requestReloadTilesAndRedraw(); // with redraw
		}

		WXLOG('setStyle(', styleName, '): "' + this.dataSource.styleName + '" for ' + this.dataSource.name + ' complete.');
	}

	protected _setStyleAndCLUT(styleName: string): void {
		const { dataSource, styles, state } = this;

		dataSource.styleName = styleName;

		if (styleName === 'custom') {
			if (!(styles.custom.parent && styles.custom.parent in styles)) {
				WXLOG(`cant find the parent style (${styles.custom.parent}), 'base' is used`);
				styles.custom.parent = 'base';
			}

			// perform inheritance
			styles.custom = Object.assign(Object.assign({}, styles[styles.custom.parent]), styles.custom);
		}

		if (!(styleName in styles)) {
			WXLOG(`cant find the style (${styleName}), 'base' is used`);
			styleName = dataSource.styleName = 'base';
		}

		try {
			this.style = Object.assign({}, styles[styleName]); // deep copy, so could be (and is) changed
			this.style.streamLineColor = refineColor(this.style.streamLineColor);
			this.clut = new RawCLUT(this.style, state.units, state.minmax[0], state.vector);
		} catch (e) {
			const str = 'setStyle: impossible error in RawCLUT: ' + e;
			WXLOG(str);
			throw new Error(str);
		}
	} // _setStyle

	/** Leaflet's calling this, don't use it directly! */
	protected createTile(coords: L.Coords, done: L.DoneCallback): HTMLElement {
		return newWxTile({ layer: this, coords, done });
	} // createTile

	/** NOTE: if lazy setup and layer was not added to a map - this is never fulfilled */
	getSetupCompletePromise(): Promise<void> {
		return this.setupCompletePromise;
	}

	/** get all the information about tile and point it represents */
	getLayerInfoAtLatLon(latlng: L.LatLngExpression): WxTileInfo | undefined {
		if (!this._map) return;
		const zoom = this._map.getZoom();
		const mapPixCoord = this._map.project(latlng, zoom); // map pixel coordinates
		const tileCoords = mapPixCoord.divideBy(256).floor(); // tile's coordinates
		const wxtile = this._getCachedTile(tileCoords, zoom);
		if (!wxtile) return; // tile is being created and not ready yet
		const tilePixel = mapPixCoord.subtract(tileCoords.multiplyBy(256)).floor(); // tile pixel coordinates
		const tileData = wxtile.getPixelInfo(tilePixel);
		if (!tileData) return; // oops! no data
		const { raw, data } = tileData;
		const rgba = raw.map((r) => this.clut.colorsI[r]);
		const hexColor = rgba.map(RGBtoHEX);
		const inStyleUnits = data.map((d) => this.clut.DataToStyle(d));

		return { wxtile, data, raw, rgba, hexColor, inStyleUnits, tilePoint: tilePixel, styleUnits: this.style.units, dataUnits: this.state.units };
	} // getTile

	/** Layer's current style.*/
	getStyle(): ColorStyleStrict {
		return this.style;
	}

	/** get first non-empty wxtile */
	protected _getFirstNonEmptyTile(): WxTile | undefined {
		for (const t in this._tiles) {
			const { wxtile } = <TileEl>this._tiles[t].el;
			if (wxtile?.data.length) {
				return wxtile;
			}
		}

		// no tiles
		return;
	}

	protected _setTimeUrl(time: Date | string | number): boolean {
		const { dataSource, state } = this;
		const closestTime = getClosestTimeString(state.meta.times, time);
		if (state.currentTime === closestTime) {
			WXLOG('_setTimeUrl: the same time - skipped');
			return false;
		}

		state.currentTime = closestTime;
		// update BaseURL
		state.baseURL = state.originURI + state.instance + `{var}/${state.currentTime}/{z}/{x}/{y}.${dataSource.ext}`; // webp
		WXLOG(`_setTimeUrl: ${closestTime} for ${dataSource.name} complete`);
		return true;
	}

	/** set time to the closest time in the list of times
	 * params:
	 * time - Date, String or number (unix time ms since 00:00:00 UTC on 1 January 1970)
	 * return:
	 * Promise resolved as true - if time was changed and tiles were redrawn
	 * NOTE:
	 * User should await for setTime promise to be fulfilled, otherwise the data might be loaded but not
	 * displayed. Some visual issues can come from vector animation.
	 * */
	setTime(time: Date | string | number): Promise<boolean> {
		WXLOG('setTime: ' + time + ' for ' + this.dataSource.name + ' start');
		if (!this._tiles) {
			WXLOG('setTime: no tiles - skipped');
			return Promise.resolve(false);
		}

		const { currentTime } = this.state;
		if (!this._setTimeUrl(time)) return Promise.resolve(false);

		this.loadDataIntegralFunc.abort();
		const reloadPromice = this._requestReloadTiles();

		reloadPromice.then((ok) => {
			if (!ok) {
				this.state.currentTime = currentTime; // restore old time
				return;
			}
			/* Ugly workaround for datasets like NZ_Radar where each timestep can have minmax */
			/* I check if minmax changed, then get\set a new minmax and re-setup the style */
			const wxtile = this._getFirstNonEmptyTile();
			if (wxtile?.data.length) {
				// the first non empty tile
				const [cmin, cmax] = this.state.minmax[0];
				const { dmin, dmax } = wxtile.data[0];
				if (Math.abs(dmin - cmin) > 0.01 || Math.abs(dmax - cmax) > 0.01) {
					// minmax changed (soft compare)
					this.state.minmax = wxtile.data.map((d) => [d.dmin, d.dmax]);
					this._setStyleAndCLUT(this.dataSource.styleName); // recalculate CLUT with new minmax
				}
			}
			/**/

			this._redrawTiles();
		});

		return reloadPromice;
	} // setTime

	/** string - current time as it is in meta */
	getTime(): string {
		return this.state.currentTime;
	}

	/**  Array of strings (times) */
	getTimes(): string[] {
		WXLOG('getTimes');
		return this.state.meta.times;
	}

	/** getLegendData - data to render a proper legend
	 * pixSize - width of a canvas to render this legend
	 * output:
	 * legend - object
	 *   legend.units - (string) units
	 *   legend.colors - Uint32Array(pixSize) - legend colors RGBA.
	 *   legend.ticks - ([tick])aray of ticks
	 *     tick.data - (float) data in legend units
	 *     tick.color - (string) representation of a color at this tick
	 *     tick.pos - (int) position in pixels of this tick on the legend. If style uses values out of data's range it clamps pos to (0, pixSize)
	 */
	getLegendData(legendSize: number): Legend {
		WXLOG('getLegendData');
		return createLegend(legendSize, this.style);
	}

	/** set coarse maximum zoom level to make tiles load faster during animation */
	setTimeAnimationMode(l: number = 2): void {
		WXLOG('setTimeAnimationMode');
		this.oldMaxZoom = this.state.meta.maxZoom;
		const mz = this._map.getZoom();
		const minMaxZoom = mz < this.oldMaxZoom ? mz : this.oldMaxZoom;
		const newMaxZoom = minMaxZoom - l;
		this.state.meta.maxZoom = newMaxZoom < 0 ? 0 : newMaxZoom;
	}

	/** restore maximum zoom level */
	unsetTimeAnimationMode(): void {
		WXLOG('unsetTimeAnimationMode');
		if (this.oldMaxZoom) {
			this.state.meta.maxZoom = this.oldMaxZoom;
		}

		this._requestReloadTilesAndRedraw();
	}

	/** min, max values of the loaded data */
	getMinMax(): { min: number; max: number } {
		const [min, max] = this.state.minmax[0];
		return { min, max };
	}

	/** true/false - if vector data and true, animation starts */
	setAnimation(a: boolean): boolean {
		WXLOG('setAnimation');
		this.animation = a;
		this._checkAndStartVectorAnimation();
		return this.animation;
	}

	protected _getCachedTile({ x, y }: { x: number; y: number }, zoom: number): WxTile | undefined {
		return <WxTile>(<any>this._tiles[`${x}:${y}:${zoom}`]?.el)?.wxtile;
	}

	protected _ForEachWxTile<T>(func: (wxtile: WxTile) => T): T[] {
		const res: T[] = [];
		for (const _tile in this._tiles) {
			const wxtile = (this._tiles[_tile].el as TileEl)?.wxtile;
			if (wxtile) res.push(func(wxtile));
		}

		return res;
	}

	protected _stopLoadingResetLoadDataFunc(): void {
		this.loadDataIntegralFunc.abort();
		this.loadDataIntegralFunc = loadDataIntegralCachedAbortable(); // and reset cache
	}

	protected _checkAndStartVectorAnimation(): void {
		if (this.vectorAnimationRequestID) return; // in case animation was queued

		const drawVectorAnimationLinesStep: FrameRequestCallback = (timeStemp: number) => {
			if (!this._map || !this.animation || !this.state.vector || this.style.streamLineStatic || this.style.streamLineColor === 'none') {
				this._ForEachWxTile((wxtile) => wxtile.clearVectorAnimationCanvas());
				this.vectorAnimationRequestID = 0;
				return;
			}

			this._ForEachWxTile((wxtile) => wxtile.drawVectorAnimationLinesStep(timeStemp));
			this.vectorAnimationRequestID = requestAnimationFrame(drawVectorAnimationLinesStep);
		};

		this.vectorAnimationRequestID = requestAnimationFrame(drawVectorAnimationLinesStep);
	}

	protected _redrawTiles(): void {
		if (this.redrawRequestID) return; // in case animation was queued
		WXLOG('_redrawTiles: start: ' + this.dataSource.name);

		this.redrawRequestID = requestAnimationFrame(() => {
			this._ForEachWxTile((wxtile) => wxtile.draw());
			this.redrawRequestID = 0;
			WXLOG('_redrawTiles: requestAnimationFrame: end: ' + this.dataSource.name);
		});
	} // _redrawTiles
} // WxTilesLayer
