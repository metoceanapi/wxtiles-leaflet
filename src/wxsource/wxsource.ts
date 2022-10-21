// https://stackoverflow.com/questions/36471220/how-can-i-convert-a-uint8array-with-offset-into-an-int32array
// tile.style.pointerEvents = `auto`; tile.addEventListener(`click`, function(e) {console.log(`X=` + e.offsetX + ` Y=` + e.offsetY + ` ` + coords);});

import L from 'leaflet';

import { type WxDataSetManager } from '../wxAPI/WxDataSetManager';
import { type WxColorStyleWeak, WxGetColorStyles, type XYZ, type WxColorStyleStrict, WXLOG, create2DContext } from '../utils/wxtools';
import { type WxRequestInit, type WxDate, WxLayer, type WxVars, type WxTileInfo, type WxLayerAPI, type WxLngLat } from '../wxlayer/wxlayer';
import { WxVariableMeta } from '../wxAPI/wxAPI';
import { type WxRasterData } from '../wxlayer/painter';

class WxTile {
	constructor(public coords: XYZ, public ctx: CanvasRenderingContext2D, public raster_data: WxRasterData) {
		this.draw(raster_data.ctxFill.canvas);
	}

	draw(canvas: HTMLCanvasElement) {
		this.ctx.clearRect(0, 0, 256, 256);
		this.ctx.drawImage(canvas, 0, 0);
	}
}

interface TileEl extends HTMLCanvasElement {
	wxtile: WxTile;
}

/**
 * @class WxTileSource
 * @description WxTileSource is a custom source for mapbox-gl-js.
 * It is used to load and display weather data from the WxTiles server.
 * @param {WxDate} time - Initial Time of the data to load.
 * @param {WxVars} vars - Initial variables to load.
 * @param {WxDataSetManager} datasetManager - WxDataSetManager instance.
 * @param {string} wxstyleName - Initial style of the source.
 * @param {'png' | undefined} ext - Tiles extension. png by default
 * @param {L.GridLayerOptions} options - Leaflet's options of the layer. *
 */
export class WxTileSource extends L.GridLayer implements WxLayerAPI {
	// Wx implementation
	protected animation = false;
	protected animationSeed = 0;
	protected readonly layer: WxLayer;
	protected oldMaxZoom?: number; /* to restore coarse maximum zoom level to make tiles load faster during animation */
	protected redrawRequested?: Promise<void>;

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
		WXLOG(`WxTileSource constructor (${wxdatasetManager.datasetName})`, { time, variables });
		super(options);
		this.layer = new WxLayer({ time, variables, wxdatasetManager, ext, wxstyleName });
	} // constructor

	/**
	 * @description Get the metadata of the current variable.
	 * @memberof WxTileSource
	 * @returns {WxVariableMeta} - The metadata of the current variable.
	 */
	getMetadata(): WxVariableMeta {
		WXLOG(`WxTileSource getMetadata (${this.layer.wxdatasetManager.datasetName})`);
		return { ...this.layer.currentMeta };
	}

	/**
	 * @description Get current variables of the source.
	 * @memberof WxTileSource
	 * @returns {WxVars} variables of the source.
	 */
	getVariables(): WxVars {
		WXLOG(`WxTileSource getVariables (${this.layer.wxdatasetManager.datasetName})`);
		return [...this.layer.variables];
	}

	/**
	 * @description Clears the cache of the source.
	 * @memberof WxTileSource
	 */
	clearCache(): void {
		WXLOG(`WxTileSource clearCache (${this.layer.wxdatasetManager.datasetName})`);
		this.layer.clearCache();
	}

	/**
	 * @description Get a copy of the current style of the source.
	 * @memberof WxTileSource
	 * @returns {WxColorStyleStrict} A copy of the current style of the source.
	 */
	getCurrentStyleObjectCopy(): WxColorStyleStrict {
		WXLOG(`WxTileSource getCurrentStyleObjectCopy (${this.layer.wxdatasetManager.datasetName})`);
		return this.layer.getCurrentStyleObjectCopy();
	}

	/**
	 * @description Get the current time of the source.
	 * @memberof WxTileSource
	 * @returns {string} The current time of the source.
	 */
	getTime(): string {
		WXLOG(`WxTileSource getTime (${this.layer.wxdatasetManager.datasetName})`);
		return this.layer.getTime();
	}

	/**
	 * @description Set time and render the source. If the time is not available, the closest time will be used.
	 * @memberof WxTileSource
	 * @param  {WxDate} time - Time to set.
	 * @param {WxRequestInit | undefined} requestInit - Request options.
	 * @returns {Promise<void>} A promise that resolves when the time is set.
	 */
	async setTime(time?: WxDate, requestInit?: WxRequestInit): Promise<string> {
		WXLOG(`WxTileSource setTime (${this.layer.wxdatasetManager.datasetName}) `, { time });
		const oldtime = this.getTime();
		this.layer.setURLsAndTime(time);
		await this._reloadVisible(requestInit);
		if (requestInit?.signal?.aborted) this.layer.setURLsAndTime(oldtime); // restore old time and URLs
		return this.getTime();
	}

	/**
	 * @description Cache tiles for faster rendering for {setTime}. If the time is not available, the closest time will be used.
	 * @memberof WxTileSource
	 * @param  {WxDate} time - Time to preload.
	 * @param {WxRequestInit | undefined} requestInit - Request options.
	 * @returns {Promise<void>} A promise that resolves when finished preload.
	 */
	async preloadTime(time: WxDate, requestInit?: WxRequestInit): Promise<void> {
		WXLOG(`WxTileSource preloadTime (${this.layer.wxdatasetManager.datasetName}) `, { time });
		return this.layer.preloadTime(time, this.coveringTiles(), requestInit);
	}

	/**
	 * @description Get comprehencive information about the current point on map.
	 * @memberof WxTileSource
	 * @param {WxLngLat} lnglat - Coordinates of the point.
	 * @param {any} anymap - map instance.
	 * @returns {WxTileInfo | undefined } Information about the current point on map. Undefined if NODATA
	 */
	getLayerInfoAtLatLon(lnglat: WxLngLat, anymap: any): WxTileInfo | undefined {
		WXLOG(`WxTileSource getLayerInfoAtLatLon (${this.layer.wxdatasetManager.datasetName})`, lnglat);
		if (!this._map) return;
		const zoom = this._map.getZoom();
		const mapPixCoord = this._map.project(lnglat, zoom); // map pixel coordinates
		const tileCoord = mapPixCoord.divideBy(256).floor(); // tile's coordinates
		const tilePixel = mapPixCoord.subtract(tileCoord.multiplyBy(256)).floor(); // tile pixel coordinates
		return this.layer.getTileData({ x: tileCoord.x, y: tileCoord.y, z: zoom }, tilePixel);
	}

	/**
	 * @description Starts the animation of the source (wind, currents).
	 * @memberof WxTileSource
	 */
	startAnimation(): void {
		if (this.animation) {
			WXLOG(`WxTileSource startAnimation (${this.layer.wxdatasetManager.datasetName}) already started`);
			return;
		}

		if (this.layer.nonanimatable) {
			WXLOG(`WxTileSource startAnimation (${this.layer.wxdatasetManager.datasetName}) nonanimatable`);
			return;
		}

		WXLOG(`WxTileSource startAnimation (${this.layer.wxdatasetManager.datasetName})`);
		this.animation = true;
		const animationStep = async (seed: number) => {
			WXLOG(`WxTileSource animationStep (${this.layer.wxdatasetManager.datasetName})`);
			if (!this.animation || this.layer.nonanimatable) {
				this.animation = false;
				return;
			}

			this.animationSeed = seed;
			await this._redrawTiles();
			requestAnimationFrame(animationStep);
		};

		requestAnimationFrame(animationStep);
	}

	/**
	 * @description Stops the animation.
	 * @memberof WxTileSource
	 */
	async stopAnimation(): Promise<void> {
		WXLOG(`WxTileSource stopAnimation (${this.layer.wxdatasetManager.datasetName})`);
		this.animation = false;
		return this._redrawTiles();
	}

	/** set coarse maximum zoom level to make tiles load faster during animation */
	async setCoarseLevel(level: number = 2): Promise<void> {
		WXLOG(`WxTileSource setCoarseLevel (${this.layer.wxdatasetManager.datasetName})`, { level });
		this.oldMaxZoom = this.layer.wxdatasetManager.meta.maxZoom;
		this.layer.wxdatasetManager.meta.maxZoom = Math.max(this.oldMaxZoom - level, 1);
		return this._reloadVisible();
	}

	/** restore maximum zoom level */
	async unsetCoarseLevel(): Promise<void> {
		WXLOG(`WxTileSource unsetCoarseLevel (${this.layer.wxdatasetManager.datasetName})`);
		if (this.oldMaxZoom) {
			this.layer.wxdatasetManager.meta.maxZoom = this.oldMaxZoom;
			return this._reloadVisible();
		}
	}

	/**
	 * @description Set the style of the source by its name from default styles.
	 * @memberof WxTileSource
	 * @param {string} wxstyleName - Name of the new style to set.
	 * @param {boolean} reload - If true, the source will be reloaded and rerendered.
	 * @returns {Promise<void>} A promise that resolves when the style is set.
	 */
	async setStyleByName(wxstyleName: string, reload: boolean = true): Promise<void> {
		WXLOG(`WxTileSource setStyleByName (${this.layer.wxdatasetManager.datasetName})`);
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
	async updateCurrentStyleObject(style?: WxColorStyleWeak, reload: boolean = true, requestInit?: WxRequestInit): Promise<void> {
		WXLOG(`WxTileSource updateCurrentStyleObject (${this.layer.wxdatasetManager.datasetName})`, { style });
		this.layer.updateCurrentStyleObject(style);
		if (reload) return this._reloadVisible(requestInit);
	}

	protected async _reloadVisible(requestInit?: WxRequestInit): Promise<void> {
		WXLOG(`WxTileSource _reloadVisible (${this.layer.wxdatasetManager.datasetName})`);
		await this.layer.reloadTiles(this.coveringTiles(), requestInit); // reload tiles with new time
		if (requestInit?.signal?.aborted) {
			WXLOG(`WxTileSource _reloadVisible (${this.layer.wxdatasetManager.datasetName}) aborted`);
			return;
		}

		await Promise.allSettled(
			this._ForEachWxTile(async (wxTile: WxTile): Promise<void> => {
				wxTile.raster_data = await this.layer.loadTile(wxTile.coords); // fill raster_data from cache
			}, '_reloadVisible')
		);
		
		return this._redrawTiles();
	}

	protected _redrawTiles(): Promise<void> {
		if (this.redrawRequested) return this.redrawRequested;
		this.redrawRequested = new Promise((resolve) => {
			requestAnimationFrame(() => {
				WXLOG(`WxTileSource _redrawTiles (${this.layer.wxdatasetManager.datasetName})`);

				this._ForEachWxTile((wxtile: WxTile): void => {
					if (this.animation) {
						this.layer.painter.imprintVectorAnimationLinesStep(wxtile.raster_data, this.animationSeed);
						wxtile.draw(wxtile.raster_data.ctxStreamLines.canvas);
					} else {
						wxtile.draw(wxtile.raster_data.ctxFill.canvas);
					}
				}, '_redrawTiles');

				resolve();
				this.redrawRequested = undefined;
			});
		});

		return this.redrawRequested;
	} // _redrawTiles

	protected coveringTiles(): XYZ[] {
		WXLOG(`WxTileSource coveringTiles (${this.layer.wxdatasetManager.datasetName})`);
		const res: XYZ[] = [];
		for (const _tile in this._tiles) {
			const wxtile = (this._tiles[_tile].el as TileEl)?.wxtile;
			if (wxtile) res.push(wxtile.coords);
		}

		return res;
	}

	protected _ForEachWxTile<T>(func: (wxtile: WxTile) => T, name: string): T[] {
		WXLOG(`WxTileSource _ForEachWxTile (${this.layer.wxdatasetManager.datasetName}) func=${name}`);
		const res: T[] = [];
		for (const _tile in this._tiles) {
			const wxtile = (this._tiles[_tile].el as TileEl)?.wxtile;
			if (wxtile) res.push(func(wxtile));
		}

		return res;
	} // _ForEachWxTile

	/* Leaflet's API calling this, don't use it directly! */
	protected createTile(coords: L.Coords, done: L.DoneCallback): HTMLElement {
		const ctx = create2DContext(256, 256);
		const tileEl = ctx.canvas as TileEl;
		this.layer.loadTile(coords).then((data) => {
			tileEl.wxtile = new WxTile({ x: coords.x, y: coords.y, z: coords.z }, ctx, data);
			done();
		});

		return tileEl;
	} // createTile
} // WxTileSource