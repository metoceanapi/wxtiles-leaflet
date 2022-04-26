import { blurData, RGBtoHEX, HEXtoRGBA, createEl, WXLOG } from './utils/wxtools';
import { DataPicture, DataIntegral } from './utils/wxtools';
import { coordToPixel, PixelsToLonLat } from './utils/mercator';
import { BoundaryMeta, WxTilesLayer } from './tilesLayer';
import { QTreeCheckCoord, TileType } from './utils/qtree';

export interface Coords {
	z: number;
	x: number;
	y: number;
}

function interpolatorDegreeLinear(start: number, end: number, amount: number): number {
	const shortestAngle = ((((end - start) % 360) + 540) % 360) - 180;
	return (start + shortestAngle * amount + 360) % 360;
}

type InterpolatorSquare = (a: number, b: number, c: number, d: number, dxt: number, dyt: number, dmin: number, dmul: number) => number;

function interpolatorSquareDegree(a: number, b: number, c: number, d: number, dxt: number, dyt: number, dmin: number, dmul: number): number {
	// a----b
	// |    |
	// |    |
	// c----d

	// 16 possible variants for a,b,c,d != 0 ( != NaN)
	const sq = (a ? 1 : 0) | (b ? 2 : 0) | (c ? 4 : 0) | (d ? 8 : 0);
	switch (sq) {
		case 0b0000:
			return 0; // NaN
		case 0b0001: // only a != NaN
			return a;
		case 0b0010: // only b != NaN
			return b;
		case 0b0011: // a, b != NaN
			c = a;
			d = b;
			break;
		case 0b0100: // ... etc
			return c;
		case 0b0101:
			b = a;
			d = c;
			break;
		case 0b0110:
			d = (b + c) >> 1;
			a = d;
			break;
		case 0b0111:
			d = (b + c) >> 1;
			break;
		case 0b1000:
			return d;
		case 0b1001:
			b = (a + d) >> 1;
			c = b;
			break;
		case 0b1010:
			a = b;
			c = d;
			break;
		case 0b1011:
			c = (a + d) >> 1;
			break;
		case 0b1100:
			a = c;
			b = d;
			break;
		case 0b1101:
			b = (a + d) >> 1;
			break;
		case 0b1110:
			a = (b + c) >> 1;
			break;
	}

	// decode Data
	a = dmin + dmul * a;
	b = dmin + dmul * b;
	c = dmin + dmul * c;
	d = dmin + dmul * d;

	// 2) bilinear
	const u = interpolatorDegreeLinear(a, b, dxt); // upper line
	const l = interpolatorDegreeLinear(c, d, dxt); // lower line
	// Encode Data back before returning
	return (interpolatorDegreeLinear(u, l, dyt) - dmin) / dmul || 1; // 0 is NaN, we don't need NaN here!
}

function interpolatorSquare(a: number, b: number, c: number, d: number, dxt: number, dyt: number, dmin: number, dmul: number): number {
	// 0       1
	//  a --- b   default version            a --- b    flipped version
	//  |   / |                              | \   |
	//  | / x | - pyt                        |   \ |
	//  c --- d                              c --- d
	// 2    |  3
	//     pxt
	//
	// x - point to interpolate
	// a, b, c, d - corners of the square
	// 16 possible variants for a,b,c,d != 0 ( != NaN)
	const sq = (a ? 1 : 0) | (b ? 2 : 0) | (c ? 4 : 0) | (d ? 8 : 0);
	switch (sq) {
		case 0b0111: // -cba   -default version
			return dxt + dyt < 1 ? dxt * (b - a) + dyt * (c - a) + a : 0;
		case 0b1110: // dcb-   -default version
			return dxt + dyt < 1 ? 0 : dxt * (d - c) + dyt * (d - b) + b + c - d;
		case 0b1011: // d-ba   - flipped version
			return dyt < dxt ? (1 - dxt) * (a - b) + dyt * (d - b) + b : 0;
		case 0b1101: // dc-a   - flipped version
			return dyt < dxt ? 0 : (1 - dxt) * (c - d) + dyt * (c - a) + a + d - c;
		case 0b1111: // dcba   -default version
			return dxt + dyt < 1 ? dxt * (b - a) + dyt * (c - a) + a : dxt * (d - c) + dyt * (d - b) + b + c - d;
		default:
			return 0;
	}
}

function subDataPicture(interpolator: InterpolatorSquare, inputData: DataPicture, subCoords?: Coords): DataPicture {
	if (!subCoords) return inputData;
	const s = 0.9999999 / Math.pow(2, subCoords.z); // a subsize of a tile // 0.99999 - a dirty trick to never cross the bottom and rigth edges of the original tile.
	const sx = subCoords.x * 256 * s; // upper left point of a subtile
	const sy = subCoords.y * 256 * s;
	const { raw: inRaw, dmin, dmax, dmul } = inputData;
	const subData: DataPicture = { raw: new Uint16Array(258 * 258), dmin, dmax, dmul };
	const { raw: outRaw } = subData;
	for (let y = -1, i = 0; y <= 256; y++) {
		const dy = sy + y * s; // `y` projection of the subtile onto the original tile
		const dyi = Math.floor(dy); // don't use `~~` because of negatives on left and upper borders
		const dyt = dy - dyi; // [0, 1] - `y` interpolation coeff
		for (let x = -1; x <= 256; x++, i++) {
			const dx = sx + x * s;
			const dxi = Math.floor(dx); // don't use ~~ because of negatives
			const dxt = dx - dxi;
			const di = dxi + 1 + (dyi + 1) * 258; // data index

			// interpolation inside a rectangular
			const a = inRaw[di]; // upper left corner
			const b = inRaw[di + 1]; // upper right
			const c = inRaw[di + 258]; // lower left
			const d = inRaw[di + 258 + 1]; // lower right
			outRaw[i] = interpolator(a, b, c, d, dxt, dyt, dmin, dmul);
		} // for x
	} // for y
	return subData;
}

function subData(inputData: DataPicture, subCoords?: Coords): DataPicture {
	return subDataPicture(interpolatorSquare, inputData, subCoords);
}

function subDataDegree(inputData: DataPicture, subCoords?: Coords): DataPicture {
	return subDataPicture(interpolatorSquareDegree, inputData, subCoords);
}

function applyMask(data: DataPicture, mask: ImageData, maskType: string): DataPicture {
	const t = maskType === 'land' ? 1 : 0;
	for (let maskIndex = 3, y = 0; y < 256; y++) {
		for (let x = 0; x < 256; x++, maskIndex += 4) {
			const m = mask.data[maskIndex] ? 1 : 0; // 0 - land
			if (t ^ m) {
				data.raw[(y + 1) * 258 + (x + 1)] = 0;
			}
		}
	}

	return data;
}

function makeBox(coords: Coords): BoundaryMeta {
	const [px, py] = coordToPixel(coords.x, coords.y);
	const [west, north] = PixelsToLonLat(px, py, coords.z);
	const [east, south] = PixelsToLonLat(px + 256, py + 256, coords.z);
	return { west, north, east, south };
}
export interface TileEl extends HTMLElement {
	wxtile: WxTile;
}

export interface TileCreateParams {
	layer: WxTilesLayer;
	coords: Coords;
	done: L.DoneCallback; //() => void;
}

export function newWxTile(params: TileCreateParams): TileEl {
	const tileEl = <TileEl>createEl('div', 'leaflet-tile s-tile'); // HTMLDivElement + wxtile
	tileEl.wxtile = new WxTile(params, tileEl);
	// load tile data and draw it
	(async () => {
		const { wxtile } = tileEl;
		try {
			await wxtile.load(); // wait for tile load
			wxtile.draw(); // draw tile
		} catch (e) {
			const { x, y, z } = wxtile.coords;
			WXLOG(`tile(${x},${y},${z}) loading error: ${e}`);
		}

		params.done(); // call done anyway
	})();

	return tileEl;
}

interface SLinePoint {
	x: number;
	y: number;
}

type SLine = SLinePoint[];

export class WxTile {
	coords: Coords;
	data: DataPicture[] = [];

	protected layer: WxTilesLayer;
	protected canvasFill: HTMLCanvasElement;
	protected canvasSlines: HTMLCanvasElement;
	protected canvasVector: HTMLCanvasElement;
	protected canvasFillCtx: CanvasRenderingContext2D;
	protected canvasVectorAnimationCtx: CanvasRenderingContext2D;
	protected canvasVectorCtx: CanvasRenderingContext2D;
	protected streamLines: SLine[] = [];
	protected imageDataForFillCtx: ImageData;

	constructor({ layer, coords }: TileCreateParams, tileEl: TileEl) {
		this.coords = coords;
		this.layer = layer;

		// create <canvas> elements for drawing with tile's methods
		this.canvasFill = createEl('canvas', 's-tile canvas-fill', tileEl) as HTMLCanvasElement;
		this.canvasSlines = createEl('canvas', 's-tile canvas-slines', tileEl) as HTMLCanvasElement;
		this.canvasVector = this.canvasFill;

		this.canvasFill.width = this.canvasFill.height = this.canvasSlines.width = this.canvasSlines.height = 256;

		function getCtx(el: HTMLCanvasElement) {
			const ctx = el.getContext('2d');
			if (!ctx) throw new Error('getCtx error');
			return ctx;
		}

		this.canvasFillCtx = getCtx(this.canvasFill);
		this.imageDataForFillCtx = this.canvasFillCtx.createImageData(256, 256);
		this.canvasVectorAnimationCtx = getCtx(this.canvasSlines);
		this.canvasVectorCtx = this.canvasFillCtx;
	}

	async load(): Promise<WxTile> {
		const { coords, layer } = this;
		await layer.setupCompletePromise; // wait for layer setup

		// should the mask be applied according to the current style?
		const tileType: TileType | undefined = this._getTileType();
		if (!tileType) {
			this.data = [];
			this.streamLines = [];
			return this; // fully cut by mask
		}

		const { upCoords, subCoords } = this._splitCoords(coords);
		const URL = this.layer.state.baseURL.replace('{z}', String(upCoords.z)).replace('{x}', String(upCoords.x)).replace('{y}', String(upCoords.y));
		const URLs = this.layer.dataSource.variables.map((v) => URL.replace('{var}', v));
		let freshData: DataIntegral[];
		try {
			freshData = await Promise.all(URLs.map(layer.loadDataIntegralFunc));
		} catch (e) {
			// if not manually aborted then it is an empty tile
			if (e.code !== DOMException.ABORT_ERR) {
				this.data = [];
				this.streamLines = [];
			}

			return this;
		}

		const interpolator = layer.state.units === 'degree' ? subDataDegree : subData;
		const processor = (d: DataIntegral) => interpolator(blurData(d, layer.style.blurRadius), subCoords);
		this.data = freshData.map(processor); // preprocess all loaded data

		if (layer.state.vector) {
			this._vectorMagnitudesPrepare();
		}

		await this._applyMask(tileType, subCoords === undefined);

		if (layer.state.vector) {
			this._createStreamLines();
		}

		return this;
	} // _load

	protected async _applyMask(tileType: TileType, needCopy: boolean): Promise<void> {
		const { coords, layer } = this;
		if ((layer.style.mask === 'land' || layer.style.mask === 'sea') && tileType === TileType.Mixed) {
			// 'http://server:port/' + coords.z + '/' + coords.x + '/' + coords.y;
			const url = layer.dataSource.maskServerURI.replace('{z}', String(coords.z)).replace('{x}', String(coords.x)).replace('{y}', String(coords.y));
			try {
				const maskImage = await layer.loadMaskFunc(url);
				if (!layer.state.vector && needCopy) {
					// !!make a copy before masking!! or original data will be spoiled
					// needCopy is false if this is a subTile (already copied from parent)
					const { raw: inRaw, dmin, dmax, dmul } = this.data[0];
					this.data[0] = { raw: new Uint16Array(inRaw), dmin, dmax, dmul };
				}

				applyMask(this.data[0], maskImage, layer.style.mask);
			} catch (e) {
				layer.style.mask = undefined;
				WXLOG("Can't load Mask. Masking is Turned OFF");
			}
		}
	}

	protected _splitCoords(coords: Coords): { upCoords: Coords; subCoords?: Coords } {
		const zDif = coords.z - this.layer.state.meta.maxZoom;
		if (zDif <= 0) {
			return { upCoords: coords };
		}
		const upCoords = { x: coords.x >>> zDif, y: coords.y >>> zDif, z: this.layer.state.meta.maxZoom };
		const subCoords = { x: coords.x & ((1 << zDif) - 1), y: coords.y & ((1 << zDif) - 1), z: zDif };
		return { upCoords, subCoords };
	} // _splitCoords

	protected _getTileType(): TileType | undefined {
		const { coords, layer } = this;
		const { mask } = layer.style;
		// Check by QTree
		var tileType: TileType | undefined = TileType.Mixed;
		if (mask === 'land' || mask === 'sea') {
			tileType = QTreeCheckCoord(coords); // check 'type' of a tile
			if (mask === tileType) {
				return undefined; // cut by QTree
			}
		}

		// Check by boundaries
		const { boundaries } = layer.state.meta;
		if (boundaries?.boundaries180) {
			const bbox = makeBox(coords);
			const rectIntersect = (b: BoundaryMeta) => !(bbox.west > b.east || b.west > bbox.east || bbox.south > b.north || b.south > bbox.north);
			if (!boundaries.boundaries180.some(rectIntersect)) {
				return undefined; // cut by boundaries
			}
		}

		// the tile masked partially or not at all
		return tileType;
	}

	draw(): void {
		this.canvasFillCtx.clearRect(0, 0, 256, 256); // In animation through time it can become empty
		this.canvasVectorAnimationCtx.clearRect(0, 0, 256, 256); // so it needs to be cleared (fucg bug231)
		if (!this.data.length) {
			return;
		}

		this._drawFillAndIsolines();
		this._drawVectorsStatic();
		this._drawDegreesStatic();
		this._drawStreamLinesStatic();
	} // draw

	clearVectorAnimationCanvas(): void {
		this.canvasVectorAnimationCtx.clearRect(0, 0, 256, 256);
	} // clearVectorAnimationCanvas

	drawVectorAnimationLinesStep(timeStemp: number): void {
		// 'timeStemp' is a time tick given by the browser's scheduller
		if (this.streamLines.length === 0) return;

		const ctx = this.canvasVectorAnimationCtx; // .getContext('2d');
		ctx.clearRect(0, 0, 256, 256); // transfered to this.draw
		const { clut, style } = this.layer;
		const [l, u, v] = this.data;

		if (style.streamLineColor === 'none') {
			this.streamLines = []; // this can happen if a new style was set up after the layer was loaded.
			return;
		}

		timeStemp = timeStemp >> 7;
		for (let i = 0; i < this.streamLines.length; ++i) {
			const sLine = this.streamLines[i];
			const sSize = sLine.length - 1;
			// TODO:
			// seed - is the most opaque piece
			let seed = (timeStemp + (1 + sLine[0].x) * (1 + sLine[0].y)) % 30;
			for (let k = 0; k < sSize; ++k) {
				const p0 = sLine[k];
				const p1 = sLine[k + 1];
				let t = 1 - (seed - k) / sSize; // TODO:
				if (t < 0 || t > 1) t = 0;
				const col = (~~(t * 255)).toString(16).padStart(2, '0');
				const w = 1 + ~~((1.2 - t) * 5);
				ctx.lineWidth = w;

				const di = p0.x + 1 + (p0.y + 1) * 258;
				let baseColor;
				switch (style.streamLineColor) {
					case 'inverted':
						baseColor = RGBtoHEX(~clut.colorsI[l.raw[di]]); // alfa = 255
						break;
					case 'fill':
						baseColor = RGBtoHEX(clut.colorsI[l.raw[di]]); // alfa = 255
						break;
					default: // put color directly from vectorColor
						baseColor = style.streamLineColor;
						break;
				} // switch isoline_style

				ctx.strokeStyle = baseColor + col; //(col.length < 2 ? '0' + col : col);

				ctx.beginPath();
				ctx.moveTo(p0.x, p0.y);
				ctx.lineTo(p1.x, p1.y);
				ctx.stroke();
			}
		}
	}

	// x, y - pixel on tile
	getPixelInfo({ x, y }: { x: number; y: number }): { raw: number[]; data: number[] } | undefined {
		const index = (y + 1) * 258 + (x + 1);
		if (!this.data[0]?.raw[index]) return; // check if data is loaded and the pixel is not empty
		return {
			raw: this.data.map((data) => data.raw[index]),
			data: this.data.map((data) => data.raw[index] * data.dmul + data.dmin),
		};
	} // getData

	protected _vectorMagnitudesPrepare(): void {
		if (this.data.length !== 2) throw new Error('this.data !== 2');
		// fill data[0] with precalculated vectors' lengths.
		this.data.unshift({ raw: new Uint16Array(258 * 258), dmin: 0, dmax: 0, dmul: 0 });
		const [l, u, v] = this.data; // length, u, v components
		l.dmax = 1.42 * Math.max(-u.dmin, u.dmax, -v.dmin, v.dmax);
		l.dmul = (l.dmax - l.dmin) / 65535;
		for (let i = 0; i < 258 * 258; ++i) {
			if (!u.raw[i] || !v.raw[i]) {
				l.raw[i] = 0;
				continue;
			} // NODATA
			const _u = u.dmin + u.dmul * u.raw[i]; // unpack U data
			const _v = v.dmin + v.dmul * v.raw[i]; // unpack V data
			l.raw[i] = Math.sqrt(_v * _v + _u * _u) / l.dmul; // pack data back to use the original rendering approach
		}
	} // _vectorPrepare

	protected _drawFillAndIsolines(): void {
		const { imageDataForFillCtx } = this;

		const { canvasFillCtx } = this;
		// canvasFillCtx.clearRect(0, 0, 256, 256); // transfered to this.draw
		const imageFillBuffer = new Uint32Array(imageDataForFillCtx.data.buffer); // a usefull representation of image's bytes (same memory)
		const { raw } = this.data[0]; // scalar data
		const { clut, style } = this.layer;
		const { levelIndex, colorsI } = clut;

		// fill: none, gradient, solid
		if (style.fill !== 'none') {
			for (let y = 0, i = 0, di = 259; y < 256; ++y, di += 2) {
				for (let x = 0; x < 256; ++x, ++i, ++di) {
					imageFillBuffer[i] = colorsI[raw[di]];
				}
			}
		} else {
			imageFillBuffer.fill(0);
		}

		const info: {
			x: number;
			y: number;
			d: number;
			dr: number;
			db: number;
			mli: number;
		}[] = []; // numbers on isolines

		// isolineColor: none, #bbaa88ff - "solid color", fill, inverted
		if (style.isolineColor !== 'none') {
			const flatColor = style.isolineColor[0] === '#' ? HEXtoRGBA(style.isolineColor) : 0;
			for (let y = 0, t = 0; y < 256; y += 1) {
				for (let x = 0; x < 256; x += 1) {
					const i = (y + 1) * 258 + (x + 1);
					const d = raw[i]; // central data
					const dr = raw[i + 1]; // right
					const db = raw[i + 258]; // bottom
					if (!d || !dr || !db) continue; // do not check isoline for NaN pixels (0)

					const lic = levelIndex[d]; // check level index aroud the current pixel
					const lir = levelIndex[dr]; // check level index aroud the current pixel
					const lib = levelIndex[db]; // check level index aroud the current pixel
					if (lic !== lir || lic !== lib) {
						const mli = Math.max(lic, lir, lib); // max level index out of three possible
						const md = Math.max(d, dr, db); // max data index out of three possible
						const ii = y * 256 + x;
						switch (style.isolineColor) {
							case 'inverted':
								imageFillBuffer[ii] = ~colorsI[md] | 0xff000000; // invert color and make alfa = 255
								break;
							case 'fill':
								imageFillBuffer[ii] = colorsI[md] | 0xff000000; // make alfa = 255
								break;
							default:
								imageFillBuffer[ii] = flatColor;
								break;
						} // switch isoline_style

						if (style.isolineText && !(++t % 255) && x > 20 && x < 235 && y > 20 && y < 235) {
							info.push({ x, y, d, dr, db, mli });
						}
					} // if isoline
				} // for x
			} // for y
		} // if (style.isolineColor != 'none')

		canvasFillCtx.putImageData(imageDataForFillCtx, 0, 0);

		// drawing Info
		if (info.length) {
			canvasFillCtx.font = '1.1em Sans-serif';
			canvasFillCtx.lineWidth = 2;
			canvasFillCtx.strokeStyle = 'white'; // RGBtoHEX(p.c); // alfa = 255
			canvasFillCtx.fillStyle = 'black';
			canvasFillCtx.textAlign = 'center';
			canvasFillCtx.textBaseline = 'middle';
			for (const { x, y, d, dr, db, mli } of info) {
				const val = this.layer.clut.ticks[mli].dataString; // select value from levels/colorMap
				const angle = Math.atan2(d - dr, db - d); // rotate angle: we can use RAW d, dd, and dr for atan2!
				canvasFillCtx.save();
				canvasFillCtx.translate(x, y);
				canvasFillCtx.rotate(angle < -1.57 || angle > 1.57 ? angle + 3.14 : angle); // so text is always up side up
				canvasFillCtx.strokeText(val, 0, 0);
				canvasFillCtx.fillText(val, 0, 0);
				canvasFillCtx.restore();
			}
		} // if info.length
	} // drawIsolines

	protected _drawStreamLinesStatic(): void {
		if (!this.streamLines.length || !this.layer.style.streamLineStatic) return;
		const { canvasVectorAnimationCtx: ctx } = this;
		const { clut, style } = this.layer;
		if (style.streamLineColor === 'none') {
			this.streamLines = []; // this can happen if a new style was set up after the layer was loaded.
			return;
		}
		const [l] = this.data;

		ctx.lineWidth = 2;
		for (let i = this.streamLines.length; i--; ) {
			const sLine = this.streamLines[i];
			for (let k = 0; k < sLine.length - 1; ++k) {
				const p0 = sLine[k];
				const p1 = sLine[k + 1];
				const di = p0.x + 1 + (p0.y + 1) * 258;

				switch (style.streamLineColor) {
					case 'inverted':
						ctx.strokeStyle = RGBtoHEX(~clut.colorsI[l.raw[di]]); // alfa = 255
						break;
					case 'fill':
						ctx.strokeStyle = RGBtoHEX(clut.colorsI[l.raw[di]]); // alfa = 255
						break;
					default: // put color directly from vectorColor
						ctx.strokeStyle = style.streamLineColor;
						break;
				} // switch isoline_style

				ctx.beginPath();
				ctx.moveTo(p0.x, p0.y);
				ctx.lineTo(p1.x, p1.y);
				ctx.stroke();
			}
		}
	}

	protected _drawVectorsStatic(): void {
		const { clut, style } = this.layer;
		if (!this.layer.state.vector || !clut.DataToKnots || style.vectorColor === 'none' || style.vectorType === 'none') return;
		if (this.data.length !== 3) throw new Error('this.data.length !== 3');
		const [l, u, v] = this.data;

		const { canvasVectorCtx: ctx } = this;

		switch (style.vectorType) {
			case 'barbs':
				ctx.font = '40px barbs';
				break;
			case 'arrows':
				ctx.font = '50px arrows';
				break;
			default:
				ctx.font = style.vectorType;
		}

		ctx.textAlign = 'center';
		ctx.textBaseline = 'middle';

		const addDegrees = style.addDegrees ? 0.017453292519943 * style.addDegrees : 0;

		const gridStep = 32; //Math.min(2 ** (zdif + 5), 128);
		for (let y = gridStep / 2; y < 256; y += gridStep) {
			for (let x = gridStep / 2; x < 256; x += gridStep) {
				const di = x + 1 + (y + 1) * 258;
				if (!l.raw[di]) continue; // NODATA

				const ang = Math.atan2(u.dmin + u.raw[di] * u.dmul, v.dmin + v.raw[di] * v.dmul);
				const vecLen = l.dmin + l.raw[di] * l.dmul;
				const sm = style.vectorType !== 'barbs' ? style.vectorFactor * 0.2 : 0.2; /*0.2 to fit font*/
				const vecCode = Math.min(clut.DataToKnots(vecLen) * sm, 25 /* to fit .ttf */) + 65; /* A */
				const vecChar = String.fromCharCode(vecCode);
				switch (style.vectorColor) {
					case 'inverted':
						ctx.fillStyle = RGBtoHEX(~clut.colorsI[l.raw[di]]); // alfa = 255
						break;
					case 'fill':
						ctx.fillStyle = RGBtoHEX(clut.colorsI[l.raw[di]]); // alfa = 255
						break;
					default: // put color directly from vectorColor
						ctx.fillStyle = style.vectorColor;
						break;
				} // switch isoline_style

				ctx.save();
				ctx.translate(x, y);
				ctx.rotate(ang + addDegrees);
				ctx.fillText(vecChar, 0, 0);
				ctx.restore();
			} // for x
		} // for y
	} // _drawVector

	protected _drawDegreesStatic(): void {
		if (this.layer.state.units !== 'degree') return;
		const { canvasVectorCtx: ctx } = this;
		const addDegrees = 0.017453292519943 * this.layer.style.addDegrees;

		ctx.font = '50px arrows';
		ctx.textAlign = 'center';
		ctx.textBaseline = 'middle';
		// ctx.clearRect(0, 0, 256, 256);
		const l = this.data[0];
		const vecChar = 'L';

		// const zdif = Math.max(this.coords.z - this.layer.dataSource.meta.maxZoom, 0);
		const gridStep = 32; //Math.min(2 ** (zdif + 5), 128);
		for (let y = gridStep / 2; y < 256; y += gridStep) {
			for (let x = gridStep / 2; x < 256; x += gridStep) {
				const di = x + 1 + (y + 1) * 258;
				if (!l.raw[di]) continue; // NODATA
				const angDeg = l.dmin + l.raw[di] * l.dmul + 180;
				const ang = angDeg * 0.01745329251; // pi/180
				switch (this.layer.style.vectorColor) {
					case 'inverted':
						ctx.fillStyle = RGBtoHEX(~this.layer.clut.colorsI[l.raw[di]]); // alfa = 255
						break;
					case 'fill':
						ctx.fillStyle = RGBtoHEX(this.layer.clut.colorsI[l.raw[di]]); // alfa = 255
						break;
					default: // put color directly from vectorColor
						ctx.fillStyle = this.layer.style.vectorColor;
						break;
				} // switch isoline_style

				ctx.save();
				ctx.translate(x, y);
				ctx.rotate(ang + addDegrees);
				ctx.fillText(vecChar, 0, 0);
				ctx.restore();
			} // for x
		} // for y
	} // _drawDegree

	protected _createStreamLines(): void {
		if (this.data.length !== 3) throw new Error('this.data.length !== 3');
		const { style } = this.layer;
		if (style.streamLineColor === 'none') return;

		// idea is taken from the LIC (linear integral convolution) algorithm and the 'multipartical vector field visualisation'
		this.streamLines = []; // an array of stremllines. Each section of streamline represents a position and size of a particle.
		// Having the stream lines as precalculated trajectories makes an animation more predictable and (IMHO) representative.
		// Algorithm: use U and V as an increment to build a trajectory. To make trajectory more or less correct the algo
		// does 20 moc steps and stores the point into streamline (sLine).
		// Algo does two passes: forward and backward, to cope boundaries and improve visual effect.
		const [l, u, v] = this.data;
		const factor = (style.streamLineSpeedFactor || 1) / l.dmax;
		const addDegrees = style.addDegrees ? 0.017453292519943 * style.addDegrees : 0;
		const gridStep = style.streamLineGridStep || 64;
		const steps = style.streamLineSteps || 300;
		for (let y = 0; y <= 256; y += gridStep) {
			for (let x = 0; x <= 256; x += gridStep) {
				if (!l.raw[1 + x + (1 + y) * 258]) continue; // NODATA
				const sLine: SLine = []; // streamline
				let xforw = x;
				let yforw = y;
				let oldDi = -1; // previous di. The first di will never be -1
				let dx = 0;
				let dy = 0;
				for (let i = 0; i <= steps && xforw >= 0 && xforw <= 256 && yforw >= 0 && yforw <= 256; i++) {
					// forward
					if (!(i % (steps / 10))) sLine.push({ x: ~~xforw, y: ~~yforw }); // push each (steps/10)-th point // 7 points max
					const di = ~~xforw + 1 + (~~yforw + 1) * 258;
					if (di !== oldDi) {
						// calc dx, dy only if di changed
						if (!l.raw[di]) break; // NODATA - stop streamline creation
						oldDi = di; // save old di
						const dl = l.dmin + l.raw[di] * l.dmul;
						const du = u.dmin + u.raw[di] * u.dmul;
						const dv = v.dmin + v.raw[di] * v.dmul;
						const ang = Math.atan2(du, dv) + addDegrees;
						dx = factor * dl * Math.sin(ang);
						dy = factor * dl * Math.cos(ang);
					}
					xforw += dx;
					yforw -= dy; // negative - due to Lat goes up but screen's coordinates go down
				} // for i forward
				let xback = x;
				let yback = y;
				oldDi = -1; // previous di. The first di will never be -1
				for (let i = 1; i <= steps && xback >= 0 && xback <= 256 && yback >= 0 && yback <= 256; i++) {
					// backward // i = 1 becouse otherwise it produces the same first point hence visual artefact! 2 hours debugging!
					if (!(i % (steps / 10))) sLine.unshift({ x: ~~xback, y: ~~yback }); // push each (steps/10)-th point // 6 points max
					const di = ~~xback + 1 + (~~yback + 1) * 258;
					if (di !== oldDi) {
						// calc dx, dy only if di changed
						if (!l.raw[di]) break; // NODATA - stop streamline creation
						oldDi = di; // save old di
						const dl = l.dmin + l.raw[di] * l.dmul;
						const du = u.dmin + u.raw[di] * u.dmul;
						const dv = v.dmin + v.raw[di] * v.dmul;
						const ang = Math.atan2(du, dv) + addDegrees;
						dx = factor * dl * Math.sin(ang);
						dy = factor * dl * Math.cos(ang);
					}
					xback -= dx;
					yback += dy; // positive - due to Lat goes up but screen's coordinates go down
				} // for i backward
				sLine.length > 2 && this.streamLines.push(sLine);
			} // for x
		} // for y
	} // _createSLines
} // tileFunctions
