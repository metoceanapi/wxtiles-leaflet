import L from 'leaflet';

import { type XYZ, WXLOG, create2DContext } from '../utils/wxtools';
import { type WxRequestInit, type WxTileInfo, type WxLngLat, WxLayerOptions } from '../wxlayer/wxlayer';
import { type WxRasterData } from '../wxlayer/painter';
import { WxLayerBaseImplementation, type WxLayerAPI } from '../wxlayer/WxImplementation';
import { FrameworkOptions } from './wxsourcetypes';

class WxTile {
	constructor(public coords: XYZ, public ctx: CanvasRenderingContext2D, public raster_data: WxRasterData | null) {
		this.draw(raster_data?.ctxFill.canvas);
	}

	draw(canvas?: HTMLCanvasElement | null) {
		this.ctx.clearRect(0, 0, 256, 256);
		canvas && this.ctx.drawImage(canvas, 0, 0);
	}
}

interface TileEl extends HTMLCanvasElement {
	wxtile?: WxTile;
}

/**
 * A custom layer source implementation
 * It is used to load and display weather data from the WxTiles server.
 * @example
 * ```ts
	const wxapi = new WxAPI({ 'http://dataserver.com' });

	const datasetName = 'gfs.global';
	const variable = 'air.temperature.at-2m'; // Scalar example

	// Create a dataset manager (may be used for many layers from this dataset)
	const wxdatasetManager = await wxapi.createDatasetManager(datasetName);
	
	// get proper representation of the variable
	const variables = wxdatasetManager.checkCombineVariableIfVector(variable);

	// create a layer source
	const wxsource = new WxTileSource({ wxdatasetManager, variables }, { id: 'wxsource', attribution: 'WxTiles' });
 * ```
 */
export class WxTileSource extends WxLayerBaseImplementation implements WxLayerAPI {
	/**
	 *
	 * @param {WxLayerOptions} wxlayeroptions - The options for the {@link WxLayerBaseImplementation}.
	 * @param {FrameworkOptions} frameworkOptions - The options for the framework.
	 */
	constructor(wxlayeroptions: WxLayerOptions, frameworkOptions: FrameworkOptions) {
		super(wxlayeroptions, frameworkOptions);
		WXLOG('WxTileSource constructor: ', wxlayeroptions);
	} // constructor

	/**
	 * Get comprehensive information about the current point on map.
	 * @param {WxLngLat} lnglat - Coordinates of the point.
	 * @param map - map instance.
	 * @returns {WxTileInfo | undefined }
	 * */
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
	 * @ignore
	 * Reloads the tiles that are currently visible on the map. Used for time/particles animation.
	 **/
	async _reloadVisible(requestInit?: WxRequestInit): Promise<void> {
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

	/**
	 * @ignore
	 * Get the tiles that are currently visible on the map.
	 * <MBOX API> get assigned by map.addSource *
	 * */
	coveringTiles(): XYZ[] {
		WXLOG(`WxTileSource coveringTiles (${this.layer.wxdatasetManager.datasetName})`);
		const res: XYZ[] = [];
		for (const _tile in this._tiles) {
			const wxtile = (this._tiles[_tile].el as TileEl)?.wxtile;
			if (wxtile) res.push(wxtile.coords);
		}

		return res;
	}

	/**
	 * @ignore
	 * @description reload tiles that are currently visible on the map.
	 * 	<MBOX API> get assigned by map.addSource
	 */
	update() {
		this._ForEachWxTile((wxtile: WxTile): void => {
			// clear or draw the tile
			wxtile.draw(wxtile.raster_data && this.layer.painter.getPaintedCanvas(wxtile.raster_data, this.animation, this.animationSeed));
		}, '_redrawTiles');
	}

	/** @ignore */
	protected _ForEachWxTile<T>(func: (wxtile: WxTile) => T, name: string): T[] {
		WXLOG(`WxTileSource _ForEachWxTile (${this.layer.wxdatasetManager.datasetName}) func=${name}`);
		const res: T[] = [];
		for (const _tile in this._tiles) {
			const wxtile = (this._tiles[_tile].el as TileEl)?.wxtile;
			if (wxtile) res.push(func(wxtile));
		}

		return res;
	} // _ForEachWxTile

	/**
	 * @internal
	 * Used by framework. Creates a representation of a tile for the framework.
	 * @param tile - The tile coordinates to be loaded.
	 * @param requestInit - The request options.
	 * @returns {Promise<Picture>} - A picture of the tile.
	 */
	protected createTile(coords: L.Coords, done: L.DoneCallback): HTMLElement {
		const ctx = create2DContext(256, 256);
		const tileEl = ctx.canvas as TileEl;
		this.layer
			.loadTile(coords)
			.then((tile) => {
				tileEl.wxtile = new WxTile(coords, ctx, tile);
			})
			.catch(() => {
				tileEl.wxtile = new WxTile(coords, ctx, null);
			})
			.finally(done);

		return tileEl;
	} // createTile

	/**
	 * @internal
	 * @description Used by framework. Cleans up resources used by the source.
	 */
	onRemove(map: L.Map): this {
		super.onRemove(map);
		WXLOG(`WxTileSource onRemove (${this.layer.wxdatasetManager.datasetName})`);
		this.animation = false;
		return this;
	} // onRemove
} // WxTileSource
