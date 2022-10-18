// https://stackoverflow.com/questions/36471220/how-can-i-convert-a-uint8array-with-offset-into-an-int32array
// tile.style.pointerEvents = `auto`; tile.addEventListener(`click`, function(e) {console.log(`X=` + e.offsetX + ` Y=` + e.offsetY + ` ` + coords);});

import L from 'leaflet';
import { WXLOG, loadDataIntegralCachedAbortable, WxColorStyleStrict, WxColorStyleWeak, WxGetColorStyles, XYZ } from './utils/wxtools';
import { WxVariableMeta } from './wxAPI/wxAPI';
import { WxDataSetManager } from './wxAPI/WxDataSetManager';
import { WxLayerAPI, WxLayer, WxDate, WxVars, WxLngLat, WxRequestInit, WxTileInfo } from './wxlayer/wxlayer';
import { newWxTile, WxTile } from './_legacy/tile';

export interface TileEl extends HTMLDivElement {
	wxtile: WxTile;
}
export class WxTilesLayer extends L.GridLayer implements WxLayerAPI {
	protected animation = false;
	protected animationSeed = 0;
	protected readonly layer: WxLayer;

	protected oldMaxZoom?: number; /* to restore coarse maximum zoom level to make tiles load faster during animation */

	constructor({
		time,
		variables,
		wxdatasetManager,
		ext = 'png',
		wxstyleName = 'base',

		options,
	}: {
		time?: WxDate;
		variables: WxVars;
		wxdatasetManager: WxDataSetManager;
		ext?: 'png';
		wxstyleName?: string;

		options?: L.GridLayerOptions;
	}) {
		super(options);
		this.layer = new WxLayer({ time, variables, wxdatasetManager, ext, wxstyleName });
	} // constructor

	/**
	 * @description Get the metadata of the current variable.
	 * @memberof WxTileSource
	 * @returns {WxVariableMeta} - The metadata of the current variable.
	 */
	getMetadata(): WxVariableMeta {
		return { ...this.layer.currentMeta };
	}

	/**
	 * @description Get current variables of the source.
	 * @memberof WxTileSource
	 * @returns {WxVars} variables of the source.
	 */
	getVariables(): WxVars {
		return [...this.layer.variables];
	}

	/**
	 * @description Clears the cache of the source.
	 * @memberof WxTileSource
	 */
	clearCache(): void {
		WXLOG('WxTileSource clearCache');
		this.layer.clearCache();
	}

	/**
	 * @description Get a copy of the current style of the source.
	 * @memberof WxTileSource
	 * @returns {WxColorStyleStrict} A copy of the current style of the source.
	 */
	getCurrentStyleObjectCopy(): WxColorStyleStrict {
		return this.layer.getCurrentStyleObjectCopy();
	}

	/**
	 * @description Get the current time of the source.
	 * @memberof WxTileSource
	 * @returns {string} The current time of the source.
	 */
	getTime(): string {
		return this.layer.getTime();
	}

	/**
	 * @description Set time and render the source. If the time is not available, the closest time will be used.
	 * @memberof WxTileSource
	 * @param  {WxDate} time_ - Time to set.
	 * @param {WxRequestInit | undefined} requestInit - Request options.
	 * @returns {Promise<void>} A promise that resolves when the time is set.
	 */
	async setTime(time_?: WxDate, requestInit?: WxRequestInit): Promise<string> {
		WXLOG(`WxTileSource ${this.layer.wxdatasetManager.datasetName} setTime`, { time: time_ });
		const oldtime = this.layer.getTime();
		this.layer.setURLsAndTime(time_);
		await this._reloadVisible(requestInit);
		if (requestInit?.signal?.aborted) this.layer.setURLsAndTime(oldtime); // restore old time and URLs
		return this.layer.getTime();
	}

	protected async _reloadVisible(requestInit?: WxRequestInit): Promise<void> {
		await this.layer.reloadTiles(this.coveringTiles(), requestInit);
		if (!requestInit?.signal?.aborted) this.update();
	}

	/**
	 * @description Cache tiles for faster rendering for {setTime}. If the time is not available, the closest time will be used.
	 * @memberof WxTileSource
	 * @param  {WxDate} time_ - Time to preload.
	 * @param {WxRequestInit | undefined} requestInit - Request options.
	 * @returns {Promise<void>} A promise that resolves when finished preload.
	 */
	async preloadTime(time_: WxDate, requestInit?: WxRequestInit): Promise<void> {
		return this.layer.preloadTime(time_, this.coveringTiles(), requestInit);
	}

	protected coveringTiles(): XYZ[] {
		const res: XYZ[] = [];
		for (const _tile in this._tiles) {
			const wxtile = (this._tiles[_tile].el as TileEl)?.wxtile;
			if (wxtile) res.push(wxtile.coords);
		}

		return res;
	}

	/**
	 * @description Get cpmprehencive information about the current point on map.
	 * @memberof WxTileSource
	 * @param {mapboxgl.LngLat} lnglat - Coordinates of the point.
	 * @param {any} anymap - MAPBOX map instance.
	 * @returns {WxTileInfo | undefined } Information about the current point on map. Undefined if NODATA
	 */
	getLayerInfoAtLatLon(lnglat: WxLngLat, anymap: any): WxTileInfo | undefined {
		return this.layer.getTileData({ x: 0, y: 0, z: 0 }, { x: 0, y: 0 });
	}

	/**
	 * @description Stops the animation.
	 * @memberof WxTileSource
	 */
	stopAnimation(): void {
		this.animation = false;
		this.update();
	}

	/**
	 * @description Starts the animation of the source (wind, currents).
	 * @memberof WxTileSource
	 */
	startAnimation(): void {
		if (this.animation) return;
		this.animation = true;
		const animationStep = (seed: number) => {
			if (!this.animation || this.layer.nonanimatable) {
				this.animation = false;
				return;
			}

			this.animationSeed = seed;
			this.update();
			requestAnimationFrame(animationStep);
		};

		requestAnimationFrame(animationStep);
	}

	/**
	 * @description Set the style of the source by its name from default styles.
	 * @memberof WxTileSource
	 * @param {string} wxstyleName - Name of the new style to set.
	 * @param {boolean} reload - If true, the source will be reloaded and rerendered.
	 * @returns {Promise<void>} A promise that resolves when the style is set.
	 */
	async setStyleByName(wxstyleName: string, reload = true): Promise<void> {
		return this.updateCurrentStyleObject(WxGetColorStyles()[wxstyleName], reload);
	}

	/**
	 * @description
	 * @memberof WxTileSource
	 * @param {WxColorStyleWeak | undefined} style - Style's fields to set.
	 * @param {boolean} reload - If true, the source will be reloaded and rerendered.
	 * @param {WxRequestInit | undefined} requestInit - Request options.
	 * @returns {Promise<void>} A promise that resolves when the style is set.
	 */
	async updateCurrentStyleObject(style?: WxColorStyleWeak, reload = true, requestInit?: WxRequestInit): Promise<void> {
		this.layer.updateCurrentStyleObject(style);
		if (reload) return this._reloadVisible(requestInit);
	}

	/** Leaflet's calling this, don't use it directly! */
	protected createTile(coords: L.Coords, done: L.DoneCallback): HTMLElement {
		const tileEl = document.createElement('div'); // HTMLDivElement + wxtile

		(async () => {
			const raster_data = await this.layer.loadTile(coords, this.layer.wxdatasetManager.wxapi.requestInit);
			tileEl.appendChild(raster_data.ctxFill.canvas);
			tileEl.appendChild(raster_data.ctxText.canvas);
			tileEl.appendChild(raster_data.ctxStreamLines.canvas);
		})();

		return tileEl;
		// if (!this.animation) return raster_data.ctxFill.canvas;

		// this.layer.painter.imprintVectorAnimationLinesStep(raster_data, this.animationSeed);
		// return raster_data.ctxStreamLines.canvas; // to shut up TS errors

		// return newWxTile({ layer: this, coords, done });
	} // createTile

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
		return createLegend(legendSize, this.layer.style);
	}

	/** set coarse maximum zoom level to make tiles load faster during animation */
	setTimeAnimationMode(l: number = 2): void {
		WXLOG('setTimeAnimationMode');
		this.oldMaxZoom = this.layer.wxdataset.meta.maxZoom;
		const mz = this._map.getZoom();
		const minMaxZoom = mz < this.oldMaxZoom ? mz : this.oldMaxZoom;
		const newMaxZoom = minMaxZoom - l;
		this.layer.wxdataset.meta.maxZoom = newMaxZoom < 0 ? 0 : newMaxZoom;
	}

	/** restore maximum zoom level */
	async unsetTimeAnimationMode(): Promise<boolean> {
		WXLOG('unsetTimeAnimationMode');
		if (this.oldMaxZoom) {
			this.layer.wxdataset.meta.maxZoom = this.oldMaxZoom;
		}

		return this._requestReloadTilesAndRedraw();
	}

	/** min, max values of the loaded data */
	getMinMax(): { min: number; max: number } {
		const [min, max] = this.state.minmax[0];
		return { min, max };
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
