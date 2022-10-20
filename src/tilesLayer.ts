// https://stackoverflow.com/questions/36471220/how-can-i-convert-a-uint8array-with-offset-into-an-int32array
// tile.style.pointerEvents = `auto`; tile.addEventListener(`click`, function(e) {console.log(`X=` + e.offsetX + ` Y=` + e.offsetY + ` ` + coords);});

import L from 'leaflet';
import { WXLOG, WxColorStyleStrict, WxColorStyleWeak, WxGetColorStyles, XYZ, create2DContext } from './utils/wxtools';
import { WxVariableMeta } from './wxAPI/wxAPI';
import { WxDataSetManager } from './wxAPI/WxDataSetManager';
import type { WxLayerAPI, WxDate, WxVars, WxLngLat, WxRequestInit, WxTileInfo } from './wxlayer/wxlayer';
import { WxLayer } from './wxlayer/wxlayer';
import { WxRasterData } from './wxlayer/painter';

class WxTile {
	constructor(public coords: XYZ, public ctx: CanvasRenderingContext2D, public raster_data: WxRasterData) {
		this.draw(raster_data.ctxFill.canvas);
	}

	draw(canvas: HTMLCanvasElement) {
		this.ctx.drawImage(canvas, 0, 0);
	}
}

interface TileEl extends HTMLCanvasElement {
	wxtile: WxTile;
}
export class WxTilesLayer extends L.GridLayer implements WxLayerAPI {
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
		WXLOG(`WxTilesLayer constructor (${wxdatasetManager.datasetName})`, { time, variables });
		super(options);
		this.layer = new WxLayer({ time, variables, wxdatasetManager, ext, wxstyleName });
	} // constructor

	/**
	 * @description Get the metadata of the current variable.
	 * @memberof WxTileSource
	 * @returns {WxVariableMeta} - The metadata of the current variable.
	 */
	getMetadata(): WxVariableMeta {
		WXLOG(`WxTilesLayer getMetadata (${this.layer.wxdatasetManager.datasetName})`);
		return { ...this.layer.currentMeta };
	}

	/**
	 * @description Get current variables of the source.
	 * @memberof WxTileSource
	 * @returns {WxVars} variables of the source.
	 */
	getVariables(): WxVars {
		WXLOG(`WxTilesLayer getVariables (${this.layer.wxdatasetManager.datasetName})`);
		return [...this.layer.variables];
	}

	/**
	 * @description Clears the cache of the source.
	 * @memberof WxTileSource
	 */
	clearCache(): void {
		WXLOG(`WxTilesLayer clearCache (${this.layer.wxdatasetManager.datasetName})`);
		this.layer.clearCache();
	}

	/**
	 * @description Get a copy of the current style of the source.
	 * @memberof WxTileSource
	 * @returns {WxColorStyleStrict} A copy of the current style of the source.
	 */
	getCurrentStyleObjectCopy(): WxColorStyleStrict {
		WXLOG(`WxTilesLayer getCurrentStyleObjectCopy (${this.layer.wxdatasetManager.datasetName})`);
		return this.layer.getCurrentStyleObjectCopy();
	}

	/**
	 * @description Get the current time of the source.
	 * @memberof WxTileSource
	 * @returns {string} The current time of the source.
	 */
	getTime(): string {
		WXLOG(`WxTilesLayer getTime (${this.layer.wxdatasetManager.datasetName})`);
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
		WXLOG(`WxTilesLayer setTime (${this.layer.wxdatasetManager.datasetName}) `, { time });
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
		WXLOG(`WxTilesLayer preloadTime (${this.layer.wxdatasetManager.datasetName}) `, { time });
		return this.layer.preloadTime(time, this.coveringTiles(), requestInit);
	}

	/**
	 * @description Get cpmprehencive information about the current point on map.
	 * @memberof WxTileSource
	 * @param {mapboxgl.LngLat} lnglat - Coordinates of the point.
	 * @param {any} anymap - MAPBOX map instance.
	 * @returns {WxTileInfo | undefined } Information about the current point on map. Undefined if NODATA
	 */
	getLayerInfoAtLatLon(lnglat: WxLngLat, anymap: any): WxTileInfo | undefined {
		WXLOG(`WxTilesLayer getLayerInfoAtLatLon (${this.layer.wxdatasetManager.datasetName})`, lnglat);
		// TODO
		return this.layer.getTileData({ x: 0, y: 0, z: 0 }, { x: 0, y: 0 });
	}

	/**
	 * @description Stops the animation.
	 * @memberof WxTileSource
	 */
	async stopAnimation(): Promise<void> {
		WXLOG(`WxTilesLayer stopAnimation (${this.layer.wxdatasetManager.datasetName})`);
		this.animation = false;
		return this._redrawTiles();
	}

	/**
	 * @description Starts the animation of the source (wind, currents).
	 * @memberof WxTileSource
	 */
	startAnimation(): void {
		if (this.animation) return;
		WXLOG(`WxTilesLayer startAnimation (${this.layer.wxdatasetManager.datasetName})`);
		this.animation = true;
		const animationStep = async (seed: number) => {
			WXLOG(`WxTilesLayer animationStep (${this.layer.wxdatasetManager.datasetName})`);
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
	 * @description Set the style of the source by its name from default styles.
	 * @memberof WxTileSource
	 * @param {string} wxstyleName - Name of the new style to set.
	 * @param {boolean} reload - If true, the source will be reloaded and rerendered.
	 * @returns {Promise<void>} A promise that resolves when the style is set.
	 */
	async setStyleByName(wxstyleName: string, reload: boolean = true): Promise<void> {
		WXLOG(`WxTilesLayer setStyleByName (${this.layer.wxdatasetManager.datasetName})`);
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
		WXLOG(`WxTilesLayer createStyle (${this.layer.wxdatasetManager.datasetName})`, { style, reload });
		this.layer.updateCurrentStyleObject(style);
		if (reload) return this._reloadVisible(requestInit);
	}

	/** set coarse maximum zoom level to make tiles load faster during animation */
	async setCoarseLevel(level: number = 2): Promise<void> {
		WXLOG(`WxTilesLayer setCoarseLevel (${this.layer.wxdatasetManager.datasetName})`, { level });
		this.oldMaxZoom = this.layer.wxdatasetManager.meta.maxZoom;
		this.layer.wxdatasetManager.meta.maxZoom = Math.max(this.oldMaxZoom - level, 1);
		return this._reloadVisible();
	}

	/** restore maximum zoom level */
	async unsetCoarseLevel(): Promise<void> {
		WXLOG(`WxTilesLayer unsetCoarseLevel (${this.layer.wxdatasetManager.datasetName})`);
		if (this.oldMaxZoom) {
			this.layer.wxdatasetManager.meta.maxZoom = this.oldMaxZoom;
			return this._reloadVisible();
		}
	}

	/** Leaflet's calling this, don't use it directly! */
	protected createTile(coords: L.Coords, done: L.DoneCallback): HTMLElement {
		const ctx = create2DContext(256, 256);
		const tileEl = ctx.canvas as TileEl;
		this.layer.loadTile(coords).then((data) => {
			tileEl.wxtile = new WxTile({ x: coords.x, y: coords.y, z: coords.z }, ctx, data);
			done();
		});

		return tileEl;
	} // createTile

	protected async _reloadVisible(requestInit?: WxRequestInit): Promise<void> {
		WXLOG(`WxTilesLayer _reloadVisible (${this.layer.wxdatasetManager.datasetName})`);
		await this.layer.reloadTiles(this.coveringTiles(), requestInit); // reload tiles with new time
		const reload = async (wxTile: WxTile): Promise<void> => {
			wxTile.raster_data = await this.layer.loadTile(wxTile.coords); // fill raster_data from cache
		};

		await Promise.allSettled(this._ForEachWxTile(reload));

		if (!requestInit?.signal?.aborted) return this._redrawTiles();
	}

	protected coveringTiles(): XYZ[] {
		WXLOG(`WxTilesLayer coveringTiles (${this.layer.wxdatasetManager.datasetName})`);
		const res: XYZ[] = [];
		for (const _tile in this._tiles) {
			const wxtile = (this._tiles[_tile].el as TileEl)?.wxtile;
			if (wxtile) res.push(wxtile.coords);
		}

		return res;
	}

	// protected _getCachedTile({ x, y }: { x: number; y: number }, zoom: number): WxTile | undefined {
	// 	return <WxTile>(<any>this._tiles[`${x}:${y}:${zoom}`]?.el)?.wxtile;
	// }

	protected _ForEachWxTile<T>(func: (wxtile: WxTile) => T): T[] {
		WXLOG(`WxTilesLayer _ForEachWxTile (${this.layer.wxdatasetManager.datasetName}) func=${func.name}`);
		const res: T[] = [];
		for (const _tile in this._tiles) {
			const wxtile = (this._tiles[_tile].el as TileEl)?.wxtile;
			if (wxtile) res.push(func(wxtile));
		}

		return res;
	}

	protected _redrawTiles(): Promise<void> {
		if (this.redrawRequested) return this.redrawRequested;
		this.redrawRequested = new Promise((resolve) => {
			requestAnimationFrame(() => {
				WXLOG(`WxTilesLayer _redrawTiles (${this.layer.wxdatasetManager.datasetName})`);
				const draw = (wxtile: WxTile): void => {
					if (this.animation) {
						this.layer.painter.imprintVectorAnimationLinesStep(wxtile.raster_data, this.animationSeed);
						wxtile.draw(wxtile.raster_data.ctxStreamLines.canvas);
					} else {
						wxtile.draw(wxtile.raster_data.ctxFill.canvas);
					}
				};

				this._ForEachWxTile(draw);

				resolve();
				this.redrawRequested = undefined;
			});
		});

		return this.redrawRequested;
	} // _redrawTiles
} // WxTilesLayer
