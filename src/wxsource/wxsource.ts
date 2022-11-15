// https://stackoverflow.com/questions/36471220/how-can-i-convert-a-uint8array-with-offset-into-an-int32array
// tile.style.pointerEvents = `auto`; tile.addEventListener(`click`, function(e) {console.log(`X=` + e.offsetX + ` Y=` + e.offsetY + ` ` + coords);});

import L from 'leaflet';

import { type XYZ, WXLOG, create2DContext } from '../utils/wxtools';
import { type WxRequestInit, type WxTileInfo, type WxLngLat, WxLayerOptions } from '../wxlayer/wxlayer';
import { type WxRasterData } from '../wxlayer/painter';
import { WxImplementation, type WxLayerAPI } from '../wxlayer/WxImplementation';
import { FrameworkOptions } from './wxsourcetypes';

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
export class WxTileSource extends WxImplementation implements WxLayerAPI {
	// Wx implementation

	constructor(wxlayeroptions: WxLayerOptions, options?: FrameworkOptions) {
		super(wxlayeroptions, options);
		WXLOG('WxTileSource constructor: ', wxlayeroptions);
	} // constructor

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

	// revisualize tiles
	update() {
		this._ForEachWxTile((wxtile: WxTile): void => {
			if (this.animation) {
				this.layer.painter.imprintVectorAnimationLinesStep(wxtile.raster_data, this.animationSeed);
				wxtile.draw(wxtile.raster_data.ctxStreamLines.canvas);
			} else {
				wxtile.draw(wxtile.raster_data.ctxFill.canvas);
			}
		}, '_redrawTiles');
	}

	coveringTiles(): XYZ[] {
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
		}).catch((err) => {
			done(err);
		});

		return tileEl;
	} // createTile
} // WxTileSource
