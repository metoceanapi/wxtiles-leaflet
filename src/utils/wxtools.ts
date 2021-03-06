import { __units_default_preset } from '../defaults/uconv';
import { __colorSchemes_default_preset } from '../defaults/colorschemes';
import { __colorStyles_default_preset } from '../defaults/styles';

export type UnitTuple = [string, number, number?];

export interface Units {
	[unit: string]: UnitTuple;
}

export interface ColorSchemes {
	[name: string]: string[];
}

export type colorMapTuple = [number, string];

export interface ColorStyleWeak {
	parent?: string;
	name?: string;
	fill?: string;
	isolineColor?: string;
	isolineText?: boolean;
	vectorType?: string;
	vectorColor?: string;
	vectorFactor?: number;
	streamLineColor?: string;
	streamLineSpeedFactor?: number;
	streamLineGridStep?: number;
	streamLineSteps?: number;
	streamLineStatic?: boolean;
	showBelowMin?: boolean;
	showAboveMax?: boolean;
	colorScheme?: string;
	colors?: string[];
	colorMap?: colorMapTuple[];
	levels?: number[];
	blurRadius?: number;
	addDegrees?: number;
	units?: string;
	extraUnits?: Units; //{ [name: string]: [string, number, ?number] };
	mask?: string;
}

export interface ColorStylesWeakMixed {
	[name: string]: ColorStyleWeak | ColorStyleWeak[];
}

export interface ColorStylesIncomplete {
	[name: string]: ColorStyleWeak;
}

export interface ColorStyleStrict extends ColorStyleWeak {
	parent?: string;
	name: string;
	fill: string;
	isolineColor: string;
	isolineText: boolean;
	vectorType: string;
	vectorColor: string;
	vectorFactor: number;
	streamLineColor: string;
	streamLineSpeedFactor: number;
	streamLineGridStep?: number;
	streamLineSteps?: number;
	streamLineStatic: boolean;
	showBelowMin: boolean;
	showAboveMax: boolean;
	colorScheme: string;
	colors?: string[];
	colorMap?: [number, string][];
	levels?: number[];
	blurRadius: number;
	addDegrees: number;
	units: string;
	extraUnits?: Units; //{ [name: string]: [string, number, ?number] };
	mask?: string;
}

export interface ColorStylesStrict {
	[name: string]: ColorStyleStrict;
}

let _units: Units;
let _colorSchemes: ColorSchemes;
let _colorStylesUnrolled: ColorStylesStrict;

export interface LibSetupObject {
	colorStyles?: ColorStylesWeakMixed;
	units?: Units;
	colorSchemes?: ColorSchemes;
}

/// some random usefull stuff
export function WxTilesLibSetup({ colorStyles = {}, units = {}, colorSchemes = {} }: LibSetupObject = {}): void {
	WXLOG('WxTile lib setup: start');
	_units = Object.assign({}, __units_default_preset, units);
	_colorSchemes = Object.assign({}, colorSchemes, __colorSchemes_default_preset);
	const toUnroll = Object.assign({}, colorStyles, __colorStyles_default_preset);
	_colorStylesUnrolled = unrollStylesParent(toUnroll);
	WXLOG('WxTile lib setup: styles unrolled');

	// Make sure fonts are loaded & ready!
	document.fonts.load('32px barbs');
	document.fonts.load('32px arrows');

	WXLOG('WxTile lib setup is done.');
}

export function WxGetColorStyles(): ColorStylesStrict {
	return _colorStylesUnrolled;
}

export function WxGetColorSchemes(): ColorSchemes {
	return _colorSchemes;
}

export interface Converter {
	(x: number): number;
	trivial?: boolean;
}

export function makeConverter(from: string, to: string, customUnits?: Units): Converter {
	WXLOG('makeConverter: From=', from, ' To=', to);
	const c = (x: number) => x;
	c.trivial = true;
	if (from === to) {
		WXLOG('Trivial converter');
		return c; // trivial
	}

	const localUnitsCopy = Object.assign({}, _units, customUnits);
	if (!localUnitsCopy[from] || !localUnitsCopy[to]) {
		WXLOG('Inconvertible units. Trivial converter');
		return c; // Inconvertible
	}

	const [fromUnit, fromFactor, fromOffset] = localUnitsCopy[from];
	const [toUnit, toFactor, toOffset] = localUnitsCopy[to];

	if (fromUnit !== toUnit || !fromFactor || !toFactor) {
		WXLOG('Inconvertible units. Trivial converter');
		return c; // trivial
	}

	const a = fromFactor / toFactor;
	const b = ((fromOffset || 0) - (toOffset || 0)) / toFactor;
	return b ? (x: number) => a * x + b : (x: number) => a * x;
}

function unrollStylesParent(stylesArrInc: ColorStylesWeakMixed): ColorStylesStrict {
	const stylesInc: ColorStylesIncomplete = Object.assign({}, __colorStyles_default_preset);
	for (const name in stylesArrInc) {
		const styleA = stylesArrInc[name];
		if (Array.isArray(styleA)) {
			for (let i = 0; i < styleA.length; ++i) {
				stylesInc[name + '[' + i + ']'] = Object.assign({}, styleA[i]); // deep copy
			}
		} else {
			stylesInc[name] = Object.assign({}, styleA); // deep copy
		}
	}

	// recursive function to apply inheritance
	const inherit = (stylesInc: ColorStylesIncomplete, name: string): ColorStyleStrict => {
		if (name === 'base') return __colorStyles_default_preset.base; // nothing to inherit
		const style = stylesInc[name]; // there are no arrays by this point
		if (!style.parent || !(style.parent in stylesInc)) style.parent = 'base';
		const parent = inherit(stylesInc, style.parent); // After inheritance it is FULL ColorStyle
		return Object.assign(style, Object.assign({}, parent, style, { parent: 'base' })); // this ugly construction changes style 'in place' so it is a soft-copy. huray!
	};

	const styles: ColorStylesStrict = {};
	for (const name in stylesInc) {
		styles[name] = inherit(stylesInc, name);
	}

	return styles;
}

type CacheableURILoaderPromiseFunc<T> = (url: string) => Promise<T>;
// type CacheableURILoaderPromiceFunc<T> = (url: string) => T;

// Caches
function cacheURIPromise<T>(fn: CacheableURILoaderPromiseFunc<T>): CacheableURILoaderPromiseFunc<T> {
	const cache = new Map<string, Promise<T>>();
	return (url: string): Promise<T> => {
		const cached = cache.get(url);
		if (cached) return cached;
		const promise = fn(url);
		// cache any result (even falures)
		cache.set(url, promise);
		// except aborted (images), so they could be reloaded
		promise.catch((e: DOMException) => {
			e.code === DOMException.ABORT_ERR && cache.delete(url);
		});
		return promise;
	};
}

// abortable 'loadImage'
async function loadImage(url: string, requestInit?: RequestInit): Promise<HTMLImageElement> {
	//// Method 0
	const img = new Image();
	img.src = URL.createObjectURL(await (await fetch(url, requestInit)).blob());
	await img.decode();
	URL.revokeObjectURL(img.src);
	return img;

	// const img = new Image();
	// img.crossOrigin = 'anonymous'; // essential
	// const abortFunc = () => (img.src = ''); // stop loading
	// signal.addEventListener('abort', abortFunc);

	// //// Method 1
	// img.src = url;
	// await img.decode();
	// signal.removeEventListener('abort', abortFunc);
	// return img;

	//// Method 2
	// return new Promise((resolve, reject) => {
	// 	img.onerror = (e) => {
	// 		signal.removeEventListener('abort', abortFunc);
	// 		reject(e);
	// 	};
	// 	img.onload = () => {
	// 		signal.removeEventListener('abort', abortFunc);
	// 		resolve(img);
	// 	};
	// 	img.src = url; // should be after .onload
	// });
}

interface IntegralPare {
	integral: Uint32Array;
	integralNZ: Uint32Array;
}

export interface DataPicture {
	raw: Uint16Array;
	dmin: number;
	dmax: number;
	dmul: number;
}

export interface DataIntegral extends DataPicture {
	integral: IntegralPare;
	radius: number;
}

function imageToData(image: HTMLImageElement): ImageData {
	const { width, height } = image;
	const context = Object.assign(document.createElement('canvas'), { width, height, imageSmoothingEnabled: false }).getContext('2d');
	if (!context) throw new Error('Error: can not create context. Catastrophe');
	context.drawImage(image, 0, 0);
	return context.getImageData(0, 0, width, height);
}

export async function loadImageData(url: string, requestInit?: RequestInit): Promise<ImageData> {
	return imageToData(await loadImage(url, requestInit));
}

function dataToIntegral(imData: ImageData): DataIntegral {
	if (imData.data[34] < 1) {
		WXLOG('Warning: image is in too old format. Check the version of the Splitter.');
	}

	// picTile contains bytes RGBARGBARGBA ...
	// we need RG and don't need BA, so output is a 16 byte array picData with every second value dropped.
	const imbuf = new Uint16Array(imData.data.buffer);
	const raw = new Uint16Array(imbuf.length / 2);
	for (let i = 0; i < raw.length; i++) {
		raw[i] = imbuf[i * 2];
	}

	// Min and Max values of the data are encoded as two floats saved in the first 8 pixels in Blue channel
	const minmaxbuf = new Uint8Array(8);
	for (let i = 0; i < 8; ++i) {
		minmaxbuf[i] = imData.data[i * 4 + 2];
	}

	const view = new DataView(minmaxbuf.buffer);
	const dmin = view.getFloat32(0, true);
	const dmax = view.getFloat32(4, true);
	const dmul = (dmax - dmin) / 65535;
	const integral = integralImage(raw);
	return { raw, dmin, dmax, dmul, integral, radius: 0 };
}

// http://webpjs.appspot.com/ = webp lossless decoder
// https://chromium.googlesource.com/webm/libwebp/+/refs/tags/v0.6.1/README.webp_js
async function loadDataIntegral(url: string, requestInit?: RequestInit): Promise<DataIntegral> {
	// const image = await loadImage(url, signal); ///*Old approach to solve 'crossorigin' and 'abort'*/ const img = await loadImage(URL.createObjectURL(await (await fetch(url, { signal, cache: 'force-cache' })).blob()));
	// const context = Object.assign(document.createElement('canvas'), { width: 258, height: 258, imageSmoothingEnabled: false }).getContext('2d');
	// if (!context) return Promise.reject();
	// context.drawImage(image, 0, 0);
	// return pixelsToData(context.getImageData(0, 0, 258, 258));
	return dataToIntegral(await loadImageData(url, requestInit));
	// return dataToIntegral(await loadImageData(url, signal));
}

interface AbortControllerHolder {
	controller: AbortController;
	debug: string;
}

export interface AbortableCacheableURILoaderPromiseFunc<T> extends CacheableURILoaderPromiseFunc<T> {
	controllerHolder: AbortControllerHolder;
	abort: () => void;
}

// imprints requestInit into F
// creates a new AbortControllerHolder, so controller abortable and resettable,
// and returns a new function F that has 'reset' property to abort the request and reset the controller
export function loadingFunctionCachedAbortable<T>(
	F: (url: string, requestInit?: RequestInit) => Promise<T>,
	requestInit?: RequestInit
): AbortableCacheableURILoaderPromiseFunc<T> {
	const controllerHolder: AbortControllerHolder = {
		controller: new AbortController(),
		debug: Date.now().toString(),
	};

	const localRequestInit = Object.assign({}, requestInit, { signal: controllerHolder.controller.signal });

	const func = <AbortableCacheableURILoaderPromiseFunc<T>>cacheURIPromise((url: string) => F(url, localRequestInit));
	func.controllerHolder = controllerHolder;
	func.abort = () => {
		controllerHolder.controller.abort();
		controllerHolder.controller = new AbortController();
		controllerHolder.debug = Date.now().toString();
		localRequestInit.signal = controllerHolder.controller.signal;
	};

	return func;
}

export function loadDataIntegralCachedAbortable(requestInit?: RequestInit): AbortableCacheableURILoaderPromiseFunc<DataIntegral> {
	return loadingFunctionCachedAbortable(loadDataIntegral, requestInit);
}

export function loadImageDataCachedAbortable(requestInit?: RequestInit): AbortableCacheableURILoaderPromiseFunc<ImageData> {
	return loadingFunctionCachedAbortable(loadImageData, requestInit);
}

export function loadDataIntegralCachedAbortable_old(requestInit?: RequestInit): AbortableCacheableURILoaderPromiseFunc<DataIntegral> {
	const controllerHolder: AbortControllerHolder = { controller: new AbortController(), debug: Date.now().toString() };
	if (!requestInit) requestInit = { signal: controllerHolder.controller.signal };
	const func = <AbortableCacheableURILoaderPromiseFunc<DataIntegral>>cacheURIPromise((url: string) => loadDataIntegral(url, requestInit));
	func.controllerHolder = controllerHolder;
	return func;
}

export function loadImageDataCachedAbortable_old(requestInit?: RequestInit): AbortableCacheableURILoaderPromiseFunc<ImageData> {
	const controllerHolder: AbortControllerHolder = { controller: new AbortController(), debug: Date.now().toString() };
	if (!requestInit) requestInit = { signal: controllerHolder.controller.signal };
	const func = <AbortableCacheableURILoaderPromiseFunc<ImageData>>cacheURIPromise((url: string) => loadImageData(url, requestInit));
	func.controllerHolder = controllerHolder;
	return func;
}

// Integarl image: https://en.wikipedia.org/wiki/Summed-area_table
// used for fast box-blur algo
function integralImage(raw: Uint16Array): IntegralPare {
	const integral = new Uint32Array(258 * 258);
	// The main Idea of integralNZ is to calculate the amount of non zero values,
	// so in the Blur algorithm it can be used for 'averaging' instead of actual area of BoxBlur frame
	const integralNZ = new Uint32Array(258 * 258);

	integral[0] = raw[0]; // upper left value
	integralNZ[0] = raw[0] === 0 ? 0 : 1; // upper left value

	for (let i = 1; i < 258; ++i) {
		// boundaries
		integral[i] = raw[i] + integral[i - 1]; // uper boundary
		integral[258 * i] = raw[258 * i] + integral[258 * i - 258]; // left boundary
		integralNZ[i] = (raw[i] === 0 ? 0 : 1) + integralNZ[i - 1]; // uper boundary
		integralNZ[258 * i] = (raw[258 * i] === 0 ? 0 : 1) + integralNZ[258 * i - 258]; // left boundary
	}

	for (let y = 1, i = 259; y < 258; ++y, ++i) {
		// the rest picture
		for (let x = 1; x < 258; ++x, ++i) {
			integral[i] = raw[i] + integral[i - 258] + integral[i - 1] - integral[i - 258 - 1];
			integralNZ[i] = (raw[i] === 0 ? 0 : 1) + integralNZ[i - 258] + integralNZ[i - 1] - integralNZ[i - 258 - 1];
		}
	}

	return { integral, integralNZ };
}

// BoxBlur based on integral images, whoop whoop
export function blurData(im: DataIntegral, radius: number): DataIntegral {
	if (radius < 0 || radius === im.radius) return im;
	im.radius = radius;
	const s = 258;
	const { integral, integralNZ } = im.integral;
	for (let y = 1; y < s; y++) {
		for (let x = 1; x < s; x++) {
			if (!im.raw[s * y + x]) {
				continue;
			}

			const rx = Math.min(radius, x - 1, s - 1 - x);
			const ry = Math.min(radius, y - 1, s - 1 - y);
			const i1 = s * (y - ry - 1) + x;
			const i2 = s * (y + ry) + x;

			const ANZ = integralNZ[i1 - rx - 1];
			const BNZ = integralNZ[i1 + rx];
			const CNZ = integralNZ[i2 - rx - 1];
			const DNZ = integralNZ[i2 + rx];
			const sumNZ = ANZ + DNZ - BNZ - CNZ; // amount of non Zero values

			const A = integral[i1 - rx - 1];
			const B = integral[i1 + rx];
			const C = integral[i2 - rx - 1];
			const D = integral[i2 + rx];
			const sum = A + D - B - C;

			// const rr = (2 * rx + 1) * (2 * ry + 1)
			im.raw[y * s + x] = sum / sumNZ;
		}
	}
	return im;
}

export function RGBtoHEX(rgb: number): string {
	const r = (rgb >> 0) & 255;
	const g = (rgb >> 8) & 255;
	const b = (rgb >> 16) & 255;
	let rs = r.toString(16);
	let gs = g.toString(16);
	let bs = b.toString(16);
	rs = rs.length === 2 ? rs : '0' + rs;
	gs = gs.length === 2 ? gs : '0' + gs;
	bs = bs.length === 2 ? bs : '0' + bs;
	return '#' + rs + gs + bs;
}

export function RGBAtoHEX(rgba: number): string {
	const r = (rgba >> 0) & 255;
	const g = (rgba >> 8) & 255;
	const b = (rgba >> 16) & 255;
	const a = (rgba >> 24) & 255;
	let rs = r.toString(16);
	let gs = g.toString(16);
	let bs = b.toString(16);
	let as = a.toString(16);
	rs = rs.length === 2 ? rs : '0' + rs;
	gs = gs.length === 2 ? gs : '0' + gs;
	bs = bs.length === 2 ? bs : '0' + bs;
	as = as.length === 2 ? as : '0' + as;
	return '#' + rs + gs + bs + as;
}

export function HEXtoRGBA(c: string): number {
	if (c[0] === '#') {
		if (c.length === 4) return +('0xff' + c[3] + c[3] + c[2] + c[2] + c[1] + c[1]);
		if (c.length === 7) return +('0xff' + c[5] + c[6] + c[3] + c[4] + c[1] + c[2]);
		if (c.length === 9) return +('0x' + c[7] + c[8] + c[5] + c[6] + c[3] + c[4] + c[1] + c[2]);
	}

	WXLOG('wrong color format', c);

	return 0;
}

// json loader helper
export async function fetchJson(url: RequestInfo, requestInit?: RequestInit) {
	return (await fetch(url, requestInit)).json();
}

export function createEl(tagName: string, className = '', container?: HTMLElement): HTMLElement {
	const el = document.createElement(tagName); // Object.assign(document.createElement(tagName), { className });
	el.className = className;
	container && container.appendChild?.(el);
	return el;
}

export function mixColor(c1: number, c2: number, t: number): number {
	const r1 = (c1 >> 0) & 255;
	const g1 = (c1 >> 8) & 255;
	const b1 = (c1 >> 16) & 255;
	const a1 = c1 >>> 24;

	const r2 = (c2 >> 0) & 255;
	const g2 = (c2 >> 8) & 255;
	const b2 = (c2 >> 16) & 255;
	const a2 = c2 >>> 24;

	const r = r1 + t * (r2 - r1);
	const g = g1 + t * (g2 - g1);
	const b = b1 + t * (b2 - b1);
	const a = a1 + t * (a2 - a1);
	return r | (g << 8) | (b << 16) | (a << 24);
}

export function createLevels(min: number, max: number, n: number): number[] {
	// create 10 levels from min to max
	const levels: number[] = [];
	for (let i = 0; i < n; ++i) {
		levels.push((i * (max - min)) / (n - 1) + min);
	}
	return levels;
}

export function getClosestTimeString(times: string[], time: Date | string | number) {
	let unixTime: number = typeof time === 'number' ? time : typeof time === 'string' ? new Date(time).getTime() : time.getTime();
	// Take the next times[]'s after unixTime OR the last
	return times.find((stime) => new Date(stime).getTime() >= unixTime) || times[times.length - 1];
}

var wxlogging: boolean = false;

export function WxTilesLogging(on: boolean) {
	if (on) {
		console.log('Logging on');
	} else {
		console.log('Logging off');
	}

	wxlogging = on;
}

export function WXLOG(...str: any) {
	if (wxlogging) {
		console.trace(...str);
	}
}

export function refineColor(c: string): string {
	// convert short form of color into long  #25f => #2255ff
	return c[0] === '#' && c.length === 4 ? '#' + c[1] + c[1] + c[2] + c[2] + c[3] + c[3] : c;
}
