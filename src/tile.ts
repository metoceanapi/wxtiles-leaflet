import { blurData, RGBtoHEX, HEXtoRGBA, createEl, WXLOG } from './wxtools';
import { DataPicture, DataIntegral } from './wxtools';
import { coordToPixel, PixelsToLonLat } from './mercator';
import { BoundaryMeta, WxTilesLayer } from './tilesLayer';
import { QTreeCheckCoord, TileType } from './qtree';

export interface Coords {
	z: number;
	x: number;
	y: number;
}

function subDataDegree(data: DataPicture, subCoords?: Coords): DataPicture {
	if (!subCoords) return data;
	const s = 0.9999999 / Math.pow(2, subCoords.z); // a subsize of a tile // 0.99999 - a dirty trick to never cross the bottom and rigth edges of the original tile.
	const sx = subCoords.x * 256 * s; // upper left point of a subtile
	const sy = subCoords.y * 256 * s;
	const subData: DataPicture = { raw: new Uint16Array(258 * 258), dmin: data.dmin, dmax: data.dmax, dmul: data.dmul };
	const { raw } = subData;
	for (let y = -1, i = 0; y <= 256; y++) {
		const dy = sy + y * s; // `y` projection of the subtile onto the original tile
		const dyi = Math.floor(dy); // don't use ~~ because of negatives on left and upper borders
		const dyt = dy - dyi; // [0, 1] - `y` interpolation coeff
		for (let x = -1; x <= 256; x++, i++) {
			const dx = sx + x * s;
			const dxi = Math.floor(dx); // don't use ~~ because of negatives
			const dxt = dx - dxi;
			const di = dxi + 1 + (dyi + 1) * 258; // data index
			// interpolation inside a rectangular
			// a----b
			// |    |
			// |    |
			// c----d
			// interpolation inside a rectangular
			let a = data.raw[di]; // upper left corner
			let b = data.raw[di + 1]; // upper right
			let c = data.raw[di + 258]; // lower left
			let d = data.raw[di + 258 + 1]; // lower right

			// 16 possible variants for a,b,c,d != 0 ( != NaN)
			const sq = (a ? 1 : 0) | (b ? 2 : 0) | (c ? 4 : 0) | (d ? 8 : 0);
			switch (sq) {
				case 0b0000:
					raw[i] = 0; // NaN
					continue;
				case 0b0001: // only a != NaN
					raw[i] = a;
					continue;
				case 0b0010: // only b != NaN
					raw[i] = b;
					continue;
				case 0b0011: // a, b != NaN
					c = a;
					d = b;
					break;
				case 0b0100: // ... etc
					raw[i] = c;
					continue;
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
					raw[i] = d;
					continue;
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

			a = data.dmin + data.dmul * a;
			b = data.dmin + data.dmul * b;
			c = data.dmin + data.dmul * c;
			d = data.dmin + data.dmul * d;

			// 2) bilinear
			const u = linearInterpDegree(a, b, dxt); // upper line
			const l = linearInterpDegree(c, d, dxt); // lower line
			raw[i] = (linearInterpDegree(u, l, dyt) - data.dmin) / data.dmul;
			if (raw[i] === 0) raw[i] = 1; // 0 is NaN, we don't need NaN here!
		} // for x
	} // for y
	return subData;
}

function linearInterpDegree(start: number, end: number, amount: number): number {
	const shortestAngle = ((((end - start) % 360) + 540) % 360) - 180;
	return (start + shortestAngle * amount + 360) % 360;
}

function subData(data: DataPicture, subCoords?: Coords): DataPicture {
	if (!subCoords) return data;
	const s = 0.9999999 / Math.pow(2, subCoords.z); // a subsize of a tile // 0.99999 - a dirty trick to never cross the bottom and rigth edges of the original tile.
	const sx = subCoords.x * 256 * s; // upper left point of a subtile
	const sy = subCoords.y * 256 * s;
	const subData: DataPicture = { raw: new Uint16Array(258 * 258), dmin: data.dmin, dmax: data.dmax, dmul: data.dmul };
	const { raw } = subData;
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
			const a = data.raw[di]; // upper left corner
			const b = data.raw[di + 1]; // upper right
			const c = data.raw[di + 258]; // lower left
			const d = data.raw[di + 258 + 1]; // lower right

			// 0       1
			//  a --- b   default version            a --- b    flipped version
			//  |   / |                              | \   |
			//  | / x | - pyt                        |   \ |
			//  c --- d                              c --- d
			// 2    |  3
			//     pxt
			//
			// x - point to interpolate

			// 16 possible variants for a,b,c,d != 0 ( != NaN)
			const sq = (a ? 1 : 0) | (b ? 2 : 0) | (c ? 4 : 0) | (d ? 8 : 0);
			switch (sq) {
				case 0b0111: // -cba   -default version
					raw[i] = dxt + dyt < 1 ? dxt * (b - a) + dyt * (c - a) + a : 0;
					continue;
				case 0b1110: // dcb-   -default version
					raw[i] = dxt + dyt < 1 ? 0 : dxt * (d - c) + dyt * (d - b) + b + c - d;
					continue;
				case 0b1011: // d-ba   - flipped version
					raw[i] = dyt < dxt ? (1 - dxt) * (a - b) + dyt * (d - b) + b : 0;
					continue;
				case 0b1101: // dc-a   - flipped version
					raw[i] = dyt < dxt ? 0 : (1 - dxt) * (c - d) + dyt * (c - a) + a + d - c;
					continue;
				case 0b1111: // dcba   -default version
					raw[i] = dxt + dyt < 1 ? dxt * (b - a) + dyt * (c - a) + a : dxt * (d - c) + dyt * (d - b) + b + c - d;
					continue;
				default:
					raw[i] = 0;
			}
		} // for x
	} // for y
	return subData;
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

export interface TileEl extends HTMLElement {
	wxtile?: WxTile;
}

export interface TileCreateParams {
	layer: WxTilesLayer;
	coords: Coords;
	done: () => void;
}

function makeBox(coords: Coords): BoundaryMeta {
	const [px, py] = coordToPixel(coords.x, coords.y);
	const [west, north] = PixelsToLonLat(px, py, coords.z);
	const [east, south] = PixelsToLonLat(px + 256, py + 256, coords.z);
	return { west, north, east, south };
}

export function TileCreate({ layer, coords, done }: TileCreateParams): TileEl {
	const tileEl: TileEl = createEl('div', 'leaflet-tile s-tile');

	if (!layer.error) {
		tileEl.wxtile = new WxTile({ layer, coords, tileEl });
		tileEl.wxtile.load().then((wxtile) => {
			wxtile.draw(); // (**) call draw at first loading time only. Otherwise it is drawn manually after all tiles are loaded
			done(); // done is used after create (to appear on map), not after reload (it is on the map already).
		});
	} else {
		// the layer hasn't been initilized yet, nothing to do.
		// this happens due to lazy setup. layer.reload() is fired when ready and recreates all tiles.
		setTimeout(done);
	}

	return tileEl;
}

interface SLinePoint {
	x: number;
	y: number;
}

type SLine = SLinePoint[];

export class WxTile {
	coords: Coords;

	protected layer: WxTilesLayer;
	protected canvasFill: HTMLCanvasElement;
	protected canvasSlines: HTMLCanvasElement;
	protected canvasVector: HTMLCanvasElement;
	protected canvasFillCtx: CanvasRenderingContext2D;
	protected canvasSlinesCtx: CanvasRenderingContext2D;
	protected canvasVectorCtx: CanvasRenderingContext2D;
	protected data: DataPicture[] = [];
	protected sLines: SLine[] = [];
	protected imData: ImageData | null = null;

	constructor({ layer, coords, tileEl }: { layer: WxTilesLayer; coords: Coords; tileEl: TileEl }) {
		this.coords = coords;
		this.layer = layer;

		// create <canvas> elements for drawing with tile's methods
		this.canvasFill = createEl('canvas', 's-tile canvas-fill', tileEl) as HTMLCanvasElement;
		this.canvasSlines = createEl('canvas', 's-tile canvas-slines', tileEl) as HTMLCanvasElement;
		this.canvasVector = this.canvasFill;

		this.canvasFill.width = this.canvasFill.height = this.canvasSlines.width = this.canvasSlines.height = 256;

		function getCtx(el: HTMLCanvasElement) {
			const ctx = el.getContext('2d');
			if (!ctx) throw 'error';
			return ctx;
		}
		this.canvasFillCtx = getCtx(this.canvasFill);
		this.canvasSlinesCtx = getCtx(this.canvasSlines);
		this.canvasVectorCtx = this.canvasFillCtx;
	}

	draw(): void {
		this.canvasFillCtx.clearRect(0, 0, 256, 256); // In animation through time it can become empty
		this.canvasSlinesCtx.clearRect(0, 0, 256, 256); // so it needs to be cleared (fucg bug231)
		if (!this.data.length) {
			return;
		}

		this._drawFillAndIsolines();
		this._drawVector();
		this._drawDegree();
		this._drawStaticSlines();
	} // draw

	clearSLinesCanvas(): void {
		this.canvasSlinesCtx.clearRect(0, 0, 256, 256);
	} // clearSLinesCanvas

	drawSLines(timeStemp: number): void {
		// 'timeStemp' is a time tick given by the browser's scheduller
		if (this.sLines.length === 0) return;

		const ctx = this.canvasSlinesCtx; // .getContext('2d');
		ctx.clearRect(0, 0, 256, 256); // transfered to this.draw
		if (this.layer.style.streamLineColor === 'none') {
			this.sLines = []; // this can happen if a new style was set up after the layer was loaded.
			return;
		}
		const baseColor = this.layer.style.streamLineColor.substr(0, 7);
		timeStemp = timeStemp >> 7;
		for (let i = 0; i < this.sLines.length; ++i) {
			const sLine = this.sLines[i];
			const sSize = sLine.length - 1;
			// TODO:
			// seed - is the most opaque piece
			// let seed = (timeStemp + sLine[0].x + sLine[0].y) % (sSize * 2); // to make more chaos // regular visual patterns make animation less smooth
			let seed = (timeStemp + (1 + sLine[0].x) * (1 + sLine[0].y)) % 30;
			for (let k = 0; k < sSize; ++k) {
				const p0 = sLine[k];
				const p1 = sLine[k + 1];
				// if (pt < k) pt += sSize;
				let t = 1 - (seed - k) / sSize;
				if (t < 0 || t > 1) t = 0;
				const col = (~~(t * 255)).toString(16);
				ctx.strokeStyle = baseColor + (col.length < 2 ? '0' + col : col);
				const w = 1 + ~~((1.2 - t) * 5);
				ctx.lineWidth = w;
				ctx.beginPath();
				ctx.moveTo(p0.x, p0.y);
				ctx.lineTo(p1.x, p1.y);
				ctx.stroke();
			}
		}
	}

	// x, y - pixel on tile
	getData({ x, y }: { x: number; y: number }): { raw: number; data: number } | undefined {
		if (!this.data.length) return;
		const raw = this.data[0].raw[(y + 1) * 258 + (x + 1)];
		return { raw, data: this.data[0].dmin + this.data[0].dmul * raw };
	} // getData

	async load(): Promise<WxTile> {
		// clean data up on load start
		this.data = [];
		this.imData = null;
		this.sLines = [];

		const { coords, layer } = this;
		const { boundaries } = layer.state.meta;

		// const type = QTreeCheckCoord({ x: 0, y: 0, z: 3 });
		// const type = QTreeCheckCoord({ x: 973, y: 766, z: 10 });

		const maskType = this.layer.style.mask;
		// should the mask be applied according to the current style?
		var tileType: TileType | undefined;
		if (maskType === 'land' || maskType === 'sea') {
			tileType = QTreeCheckCoord(coords); // check 'type' of a tile
			if (maskType === tileType) {
				// whole this tile is cut by the mask -> nothing to load and process
				return this;
			}
		}

		if (boundaries?.boundaries180) {
			const bbox = makeBox(coords);
			const rectIntersect = (b: BoundaryMeta) => !(bbox.west > b.east || b.west > bbox.east || bbox.south > b.north || b.south > bbox.north);
			if (!boundaries.boundaries180.some(rectIntersect)) {
				return this; // empty tile
			}
		}

		const { upCoords, subCoords } = this._splitCoords(coords);
		const URLs = this._coordsToURLs(upCoords);
		let data: DataIntegral[];
		try {
			data = await Promise.all(URLs.map(layer.loadData));
		} catch (e) {
			return this; // empty tile
		}

		const interpolator = layer.state?.units === 'degree' ? subDataDegree : subData;
		this.data = data.map((d) => interpolator(blurData(d, this.layer.style.blurRadius), subCoords)); // preprocess all loaded data
		this.imData = this.canvasFillCtx.createImageData(256, 256);

		if (this.layer.vector) {
			this._vectorPrepare();
		}

		if (maskType && tileType === TileType.Mixed) {
			// const url = 'http://localhost:8080/' + coords.z + '/' + coords.x + '/' + coords.y;
			const url = layer.state.maskServerURI.replace('{z}', String(coords.z)).replace('{x}', String(coords.x)).replace('{y}', String(coords.y));
			try {
				const mask = await layer.loadMask(url);
				// const mask = await loadImageData(url, layer.loadData.controller.signal);
				applyMask(this.data[0], mask, maskType);
			} catch (e) {
				this.layer.style.mask = undefined;
				WXLOG("Can't load Mask. Turned off");
			}
		}

		if (this.layer.vector) {
			this._createSLines();
		}

		return this;
	} // _load

	protected _splitCoords(coords: Coords): { upCoords: Coords; subCoords?: Coords } {
		const zDif = coords.z - this.layer.state.meta.maxZoom;
		if (zDif <= 0) {
			return { upCoords: coords };
		}
		const upCoords = { x: coords.x >>> zDif, y: coords.y >>> zDif, z: this.layer.state.meta.maxZoom };
		const subCoords = { x: coords.x & ((1 << zDif) - 1), y: coords.y & ((1 << zDif) - 1), z: zDif };
		return { upCoords, subCoords };
	} // _splitCoords

	protected _coordsToURLs(upCoords: Coords): string[] {
		const u = this.layer.state.baseURL.replace('{z}', String(upCoords.z)).replace('{x}', String(upCoords.x)).replace('{y}', String(upCoords.y));
		return this.layer.dataSource.variables.map((v: string) => u.replace('{var}', v));
	} // _coordsToURLs

	protected _vectorPrepare(): void {
		if (this.data.length !== 2) throw 'this.data !== 2';
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
		const { imData } = this;
		if (!imData) throw '_drawFillAndIsolines: !imData';

		const { canvasFillCtx } = this;
		// canvasFillCtx.clearRect(0, 0, 256, 256); // transfered to this.draw
		const im = new Uint32Array(imData.data.buffer); // a usefull representation of image's bytes (same memory)
		const { raw } = this.data[0]; // scalar data
		const { clut, style } = this.layer;
		const { levelIndex, colorsI } = clut;

		// fill: none, gradient, solid
		if (style.fill !== 'none') {
			const fillC = colorsI;
			for (let y = 0, i = 0, di = 259; y < 256; ++y, di += 2) {
				for (let x = 0; x < 256; ++x, ++i, ++di) {
					im[i] = fillC[raw[di]];
				}
			}
		} else {
			im.fill(0);
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
								im[ii] = ~colorsI[md] | 0xff000000; // invert color and make alfa = 255
								break;
							case 'fill':
								im[ii] = colorsI[md] | 0xff000000; // make alfa = 255
								break;
							default:
								im[ii] = flatColor;
								break;
						} // switch isoline_style
						if (style.isolineText && !(++t % 255) && x > 20 && x < 235 && y > 20 && y < 235) {
							info.push({ x, y, d, dr, db, mli });
						}
					} // if isoline
				} // for x
			} // for y
		} // if (style.isolineColor != 'none')

		canvasFillCtx.putImageData(imData, 0, 0);

		// drawing Info
		if (!info.length) {
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

	protected _drawStaticSlines(): void {
		if (!this.sLines.length || !this.layer.style.streamLineStatic) return;
		const { canvasSlinesCtx } = this;
		// canvasSlinesCtx.clearRect(0, 0, 256, 256);  // transfered to this.draw
		if (this.layer.style.streamLineColor === 'none') {
			this.sLines = []; // this can happen if a new style was set up after the layer was loaded.
			return;
		}
		canvasSlinesCtx.lineWidth = 2;
		canvasSlinesCtx.strokeStyle = this.layer.style.streamLineColor; // color
		canvasSlinesCtx.beginPath();
		for (let i = this.sLines.length; i--; ) {
			const sLine = this.sLines[i];
			for (let k = 0; k < sLine.length - 1; ++k) {
				const p0 = sLine[k];
				const p1 = sLine[k + 1];
				canvasSlinesCtx.moveTo(p0.x, p0.y);
				canvasSlinesCtx.lineTo(p1.x, p1.y);
			}
		}
		canvasSlinesCtx.stroke();
	}

	protected _drawVector(): void {
		if (!this.layer.vector || !this.layer.clut.DataToKnots) return;
		if (!this.layer.style.vectorColor || this.layer.style.vectorColor === 'none') return;
		if (!this.layer.style.vectorType || this.layer.style.vectorType === 'none') return;
		if (this.data.length !== 3) throw 'this.data.length !== 3';
		const [l, u, v] = this.data;

		const { canvasVectorCtx } = this;

		switch (this.layer.style.vectorType) {
			case 'barbs':
				canvasVectorCtx.font = '40px barbs';
				break;
			case 'arrows':
				canvasVectorCtx.font = '50px arrows';
				break;
			default:
				canvasVectorCtx.font = this.layer.style.vectorType;
		}

		canvasVectorCtx.textAlign = 'center';
		canvasVectorCtx.textBaseline = 'middle';

		const addDegrees = this.layer.style.addDegrees ? 0.017453292519943 * this.layer.style.addDegrees : 0;

		// const zdif = Math.max(this.coords.z - this.layer.dataSource.meta.maxZoom, 0);
		const gridStep = 32; //Math.min(2 ** (zdif + 5), 128);
		for (let y = gridStep / 2; y < 256; y += gridStep) {
			for (let x = gridStep / 2; x < 256; x += gridStep) {
				const di = x + 1 + (y + 1) * 258;
				if (!l.raw[di]) continue; // NODATA

				const ang = Math.atan2(u.dmin + u.raw[di] * u.dmul, v.dmin + v.raw[di] * v.dmul);
				const vecLen = l.dmin + l.raw[di] * l.dmul;

				const sm = this.layer.dataSource.variables[0].includes('current') ? 5 : 0.2; // arrows are longer for currents than wind
				const vecCode = Math.min(this.layer.clut.DataToKnots(vecLen) * sm, 25 /* to fit .ttf */) + 65; /* A */
				const vecChar = String.fromCharCode(vecCode);
				switch (this.layer.style.vectorColor) {
					case 'inverted':
						canvasVectorCtx.fillStyle = RGBtoHEX(~this.layer.clut.colorsI[l.raw[di]]); // alfa = 255
						break;
					case 'fill':
						canvasVectorCtx.fillStyle = RGBtoHEX(this.layer.clut.colorsI[l.raw[di]]); // alfa = 255
						break;
					default:
						canvasVectorCtx.fillStyle = this.layer.style.vectorColor; // put color directly from vectorColor
						break;
				} // switch isoline_style

				canvasVectorCtx.save();
				canvasVectorCtx.translate(x, y);
				canvasVectorCtx.rotate(ang + addDegrees);
				canvasVectorCtx.fillText(vecChar, 0, 0);
				canvasVectorCtx.restore();
			} // for x
		} // for y
	} // _drawVector

	protected _drawDegree(): void {
		if (this.layer.state.units !== 'degree') return;

		const { canvasVectorCtx } = this;

		const addDegrees = this.layer.style.addDegrees ? 0.017453292519943 * this.layer.style.addDegrees : 0;

		canvasVectorCtx.font = '50px arrows';
		canvasVectorCtx.textAlign = 'start';
		canvasVectorCtx.textBaseline = 'alphabetic';
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
						canvasVectorCtx.fillStyle = RGBtoHEX(~this.layer.clut.colorsI[l.raw[di]]); // alfa = 255
						break;
					case 'fill':
						canvasVectorCtx.fillStyle = RGBtoHEX(this.layer.clut.colorsI[l.raw[di]]); // alfa = 255
						break;
					default:
						canvasVectorCtx.fillStyle = this.layer.style.vectorColor; // put color directly from vectorColor
						break;
				} // switch isoline_style

				canvasVectorCtx.save();
				canvasVectorCtx.translate(x, y);
				canvasVectorCtx.rotate(ang + addDegrees);
				canvasVectorCtx.fillText(vecChar, 0, 0);
				canvasVectorCtx.restore();
			} // for x
		} // for y
	} // _drawDegree

	protected _createSLines(): void {
		if (this.data.length !== 3) throw 'this.data.length !== 3';
		if (!this.layer.style.streamLineColor || this.layer.style.streamLineColor === 'none') return;
		const factor = this.layer.style.streamLineSpeedFactor || 1;

		// idea is taken from the LIC (linear integral convolution) algorithm and the 'multipartical vector field visualisation'
		this.sLines = []; // an array of stremllines. Each section of streamline represents a position and size of a particle.
		// Having the stream lines as precalculated trajectories makes an animation more predictable and (IMHO) representative.
		// Algorithm: use U and V as an increment to build a trajectory. To make trajectory more or less correct the algo
		// does 20 moc steps and stores the point into streamline (sLine).
		// Algo does two passes: forward and backward, to cope boundaries and improve visual effect.
		const [l, u, v] = this.data;
		const zdif = Math.max(this.coords.z - this.layer.state.meta.maxZoom, 0);
		const gridStep = Math.min(2 ** (zdif + 5), 128);
		const steps = ~~(120 + zdif * 60);
		for (let y = 0; y <= 256; y += gridStep) {
			for (let x = 0; x <= 256; x += gridStep) {
				if (!l.raw[1 + x + (1 + y) * 258]) continue; // NODATA
				const sLine: SLine = []; // streamline
				let xf = x;
				let yf = y;
				for (let i = 0; i <= steps && xf >= 0 && xf <= 256 && yf >= 0 && yf <= 256; i++) {
					// forward
					!(i % (steps / 6)) && sLine.push({ x: ~~xf, y: ~~yf }); // push each 20-th point // 7 points max
					const di = ~~xf + 1 + (~~yf + 1) * 258;
					if (!l.raw[di]) break; // NODATA
					xf += (factor * (u.dmin + u.raw[di] * u.dmul)) / l.dmax;
					yf -= (factor * (v.dmin + v.raw[di] * v.dmul)) / l.dmax; // negative - due to Lat goes up but screen's coordinates go down
				} // for i forward
				xf = x;
				yf = y;
				for (let i = 1; i <= steps && xf >= 0 && xf <= 256 && yf >= 0 && yf <= 256; i++) {
					// backward // i = 1 becouse otherwise it produces the same first point hence visual artefact! 2 hours debugging!
					!(i % (steps / 6)) && sLine.unshift({ x: ~~xf, y: ~~yf }); // push each 20-th point // 6 points max
					const di = ~~xf + 1 + (~~yf + 1) * 258;
					if (!l.raw[di]) break; // NODATA
					xf -= (factor * (u.dmin + u.raw[di] * u.dmul)) / l.dmax;
					yf += (factor * (v.dmin + v.raw[di] * v.dmul)) / l.dmax; // negative - due to Lat goes up but screen's coordinates go down
				} // for i backward
				sLine.length > 2 && this.sLines.push(sLine);
			} // for x
		} // for y
	} // _createSLines
} // tileFunctions
