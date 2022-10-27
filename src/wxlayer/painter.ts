import { type DataPicture, HEXtoRGBA, RGBtoHEX } from '../utils/wxtools';
import { type WxData } from './loader';
import { type WxLayer } from './wxlayer';

interface IsoInfo {
	x: number;
	y: number;
	d: number;
	dr: number;
	db: number;
	mli: number;
}

export interface WxRasterData {
	ctxFill: CanvasRenderingContext2D;
	ctxText: CanvasRenderingContext2D;
	ctxStreamLines: CanvasRenderingContext2D;
	data: WxData;
}

export class Painter {
	protected layer: WxLayer;

	constructor(layer: WxLayer) {
		this.layer = layer;
	}

	paint({ data, ctxFill, ctxText, ctxStreamLines }: WxRasterData): void {
		const { layer } = this;
		const { units } = layer.currentMeta;
		const imageData = new ImageData(256, 256); //new ImageData(256, 256);
		const imageBuffer = new Uint32Array(imageData.data.buffer); // a usefull representation of image's bytes (same memory)
		ctxFill.clearRect(0, 0, 256, 256);
		ctxText.clearRect(0, 0, 256, 256);
		ctxStreamLines.clearRect(0, 0, 256, 256);

		_fill(data.data[0], imageBuffer, layer);
		const isoInfo = _drawIsolines(imageBuffer, data.data[0], layer);
		ctxFill.putImageData(imageData, 0, 0);
		_printIsolineText(isoInfo, ctxText, layer);
		_printVectorsStatic(data.data, ctxText, layer);
		_printDegreesStatic(data.data[0], ctxText, units, layer);
		_drawStreamLinesStatic(data, ctxText, layer);
	} // paint

	imprintVectorAnimationLinesStep({ data, ctxFill, ctxStreamLines }: WxRasterData, seed: number): void {
		const { layer } = this;
		ctxStreamLines.clearRect(0, 0, 256, 256);
		ctxStreamLines.drawImage(ctxFill.canvas, 0, 0);
		if (data.slines.length === 0 || layer.style.streamLineStatic || layer.style.streamLineColor === 'none') return;
		_drawVectorAnimationLinesStep(data, ctxStreamLines, layer, seed);
	} // imprintVectorAnimationLinesStep
}

function _fill(data: DataPicture, imageBuffer: Uint32Array, { CLUT, style }: WxLayer) {
	const { raw } = data; // scalar data
	const { colorsI } = CLUT;
	// fill: none, gradient, solid
	if (style.fill !== 'none') {
		for (let y = 0, i = 0, di = 259; y < 256; ++y, di += 2) {
			for (let x = 0; x < 256; ++x, ++i, ++di) {
				imageBuffer[i] = colorsI[raw[di]];
			}
		}
	} else {
		imageBuffer.fill(0);
	}
} // _fill

function _drawIsolines(imageBuffer: Uint32Array, data: DataPicture, { CLUT, style }: WxLayer): IsoInfo[] {
	const { raw } = data; // scalar data
	const { levelIndex, colorsI } = CLUT;
	const info: IsoInfo[] = []; // numbers on isolines
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
							imageBuffer[ii] = ~colorsI[md] | 0xff000000; // invert color and make alfa = 255
							break;
						case 'fill':
							imageBuffer[ii] = colorsI[md] | 0xff000000; // make alfa = 255
							break;
						default:
							imageBuffer[ii] = flatColor;
							break;
					} // switch isoline_style

					if (style.isolineText && !(++t % 255) && x > 20 && x < 235 && y > 20 && y < 235) {
						info.push({ x, y, d, dr, db, mli });
					}
				} // if isoline
			} // for x
		} // for y
	} // if (style.isolineColor != 'none')

	return info;
} // _drawIsolines

function _printIsolineText(info: IsoInfo[], ctx: CanvasRenderingContext2D, { CLUT }: WxLayer): void {
	// drawing Info
	if (info.length) {
		ctx.font = '1.1em Sans-serif';
		ctx.lineWidth = 2;
		ctx.strokeStyle = 'white'; // RGBtoHEX(p.c); // alfa = 255
		ctx.fillStyle = 'black';
		ctx.textAlign = 'center';
		ctx.textBaseline = 'middle';
		for (const { x, y, d, dr, db, mli } of info) {
			const val = CLUT.ticks[mli].dataString; // select value from levels/colorMap
			const angle = Math.atan2(d - dr, db - d); // rotate angle: we can use RAW d, dd, and dr for atan2!
			ctx.save();
			ctx.translate(x, y);
			ctx.rotate(angle < -1.57 || angle > 1.57 ? angle + 3.14 : angle); // so text is always up side up
			ctx.strokeText(val, 0, 0);
			ctx.fillText(val, 0, 0);
			ctx.restore();
		}
	} // if info.length
} // _printIsolineText

function _printVectorsStatic(data: DataPicture[], ctx: CanvasRenderingContext2D, { CLUT, style }: WxLayer): void {
	if (!CLUT.DataToKnots || style.vectorColor === 'none' || style.vectorType === 'none') return;
	if (data.length !== 3) throw new Error('data.length !== 3');
	const [l, u, v] = data;

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
	ctx.fillStyle = style.vectorColor;

	const addDegrees = style.addDegrees ? 0.017453292519943 * style.addDegrees : 0;

	const gridStep = 32; //Math.min(2 ** (zdif + 5), 128);
	for (let y = gridStep / 2; y < 256; y += gridStep) {
		for (let x = gridStep / 2; x < 256; x += gridStep) {
			const di = x + 1 + (y + 1) * 258;
			if (!l.raw[di]) continue; // NODATA

			const ang = Math.atan2(u.dmin + u.raw[di] * u.dmul, v.dmin + v.raw[di] * v.dmul);
			const vecLen = l.dmin + l.raw[di] * l.dmul;
			const sm = style.vectorType !== 'barbs' ? style.vectorFactor * 0.2 : 0.2; /*0.2 to fit font*/
			const vecCode = Math.min(CLUT.DataToKnots(vecLen) * sm, 25 /* to fit .ttf */) + 65; /* A */
			const vecChar = String.fromCharCode(vecCode);
			switch (style.vectorColor) {
				case 'inverted':
					ctx.fillStyle = RGBtoHEX(~CLUT.colorsI[l.raw[di]]); // alfa = 255
					break;
				case 'fill':
					ctx.fillStyle = RGBtoHEX(CLUT.colorsI[l.raw[di]]); // alfa = 255
					break;
			} // switch isoline_style

			ctx.save();
			ctx.translate(x, y);
			ctx.rotate(ang + addDegrees);
			ctx.fillText(vecChar, 0, 0);
			ctx.restore();
		} // for x
	} // for y
} // _printVectorsStatic

function _printDegreesStatic(data: DataPicture, ctx: CanvasRenderingContext2D, units: string, { CLUT, style }: WxLayer): void {
	if (units !== 'degree') return;
	const addDegrees = 0.017453292519943 * style.addDegrees;

	ctx.font = '50px arrows';
	ctx.textAlign = 'center';
	ctx.textBaseline = 'middle';
	ctx.fillStyle = style.vectorColor;
	const vecChar = 'L';

	const gridStep = 32; //Math.min(2 ** (zdif + 5), 128);
	for (let y = gridStep / 2; y < 256; y += gridStep) {
		for (let x = gridStep / 2; x < 256; x += gridStep) {
			const di = x + 1 + (y + 1) * 258;
			if (!data.raw[di]) continue; // NODATA
			const angDeg = data.dmin + data.raw[di] * data.dmul + 180;
			const ang = angDeg * 0.01745329251; // pi/180
			switch (style.vectorColor) {
				case 'inverted':
					ctx.fillStyle = RGBtoHEX(~CLUT.colorsI[data.raw[di]]); // alfa = 255
					break;
				case 'fill':
					ctx.fillStyle = RGBtoHEX(CLUT.colorsI[data.raw[di]]); // alfa = 255
					break;
			} // switch isoline_style

			ctx.save();
			ctx.translate(x, y);
			ctx.rotate(ang + addDegrees);
			ctx.fillText(vecChar, 0, 0);
			ctx.restore();
		} // for x
	} // for y
} // _printDegreesStatic

function _drawStreamLinesStatic(wxdata: WxData, ctx: CanvasRenderingContext2D, { CLUT, style }: WxLayer): void {
	const { data, slines } = wxdata;
	if (!slines.length || !style.streamLineStatic || style.streamLineColor === 'none') return;

	const l = data[0];
	ctx.lineWidth = 1;
	ctx.strokeStyle = style.streamLineColor;
	for (let i = slines.length; i--; ) {
		const sLine = slines[i];
		for (let k = 0; k < sLine.length - 1; ++k) {
			const p0 = sLine[k];
			const p1 = sLine[k + 1];
			const di = p0.x + 1 + (p0.y + 1) * 258;

			switch (style.streamLineColor) {
				case 'inverted':
					ctx.strokeStyle = RGBtoHEX(~CLUT.colorsI[l.raw[di]]); // alfa = 255
					break;
				case 'fill':
					ctx.strokeStyle = RGBtoHEX(CLUT.colorsI[l.raw[di]]); // alfa = 255
					break;
			} // switch isoline_style

			ctx.beginPath();
			ctx.moveTo(p0.x, p0.y);
			ctx.lineTo(p1.x, p1.y);
			ctx.stroke();
		}
	}
} // _drawStreamLinesStatic

function _drawVectorAnimationLinesStep(wxdata: WxData, ctx: CanvasRenderingContext2D, { CLUT, style }: WxLayer, seed: number): void {
	// 'seed' is a time tick given by the browser's scheduller
	const { data, slines } = wxdata;
	// if (!slines.length || !style.streamLineStatic || style.streamLineColor === 'none') return; // done by the caller!!!
	const l = data[0];

	let baseColor = style.streamLineColor.substring(0, 7);
	seed = seed >> 5;
	for (let i = 0; i < slines.length; ++i) {
		const sLine = slines[i];
		const sSize = sLine.length - 1;
		// pseed - is the most opaque piece // TODO:improve?
		let pseed = (seed + (1 + sLine[0].x) * (1 + sLine[0].y)) % 30;
		for (let k = 0; k < sSize; ++k) {
			const p0 = sLine[k];
			const p1 = sLine[k + 1];
			let t = 1 - (pseed - k) / sSize; // TODO: improve?
			if (t < 0 || t > 1) t = 0;
			const col = (~~(t * 255)).toString(16).padStart(2, '0');
			const w = 1 + ~~((1.2 - t) * 5);
			ctx.lineWidth = w;

			const di = p0.x + 1 + (p0.y + 1) * 258;
			switch (style.streamLineColor) {
				case 'inverted':
					baseColor = RGBtoHEX(~CLUT.colorsI[l.raw[di]]); // alfa = 255
					break;
				case 'fill':
					baseColor = RGBtoHEX(CLUT.colorsI[l.raw[di]]); // alfa = 255
					break;
			} // switch isoline_style

			ctx.strokeStyle = baseColor + col; //(col.length < 2 ? '0' + col : col);

			ctx.beginPath();
			ctx.moveTo(p0.x, p0.y);
			ctx.lineTo(p1.x, p1.y);
			ctx.stroke();
		} // for k
	} // for i
} // _drawVectorAnimationLinesStep
