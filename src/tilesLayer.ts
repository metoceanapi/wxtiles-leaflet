// https://stackoverflow.com/questions/36471220/how-can-i-convert-a-uint8array-with-offset-into-an-int32array
// tile.style.pointerEvents = `auto`; tile.addEventListener(`click`, function(e) {console.log(`X=` + e.offsetX + ` Y=` + e.offsetY + ` ` + coords);});

import { RawCLUT, createLegend } from './RawCLUT';
import { TileCreate, TileEl, WxTile } from './tile';
import {
	loadDataPictureCachedAbortable,
	fetchJson,
	RGBtoHEX,
	WxGetColorStyles,
	createEl,
	ColorStylesStrict,
	WXLOG,
	ColorStyleStrict,
	AbortableCacheableFunc,
	getClosestTimeString,
} from './wxtools';

import L from 'leaflet';

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
	ext: 'webp' | 'png'; // png / webp (default) - wxtilesplitter output format
	dataset: string; // dataset of the dataset
	variables: string[]; // variabls to be used for the layer rendering
	name: string; // attribute of the dataSource to be used externally
	styleName: string; // The name of the style (from styles.json) to apply for the layer
}

export interface WxLayerState {
	time: string;
	minmax: [number, number][];
	instance: string;
	originURI: string;
	units: string;
	meta: Meta;
	baseURL: string;
}

export interface WxTilesLayerSettings {
	// Lazy setup
	// 'true': perform setup and data loading on 'addTo(map)'.
	// 'false': start loading immediately, but loading is not finished when layer is created.
	// the signal 'setupcomplete' is fired when loading is finished.
	// useful when a big bunch of layers is used, so layers are not wasting memory and bandwidth.
	lazy: boolean;
	dataSource: DataSource;
	options: L.GridLayerOptions; // leaflet's options for the layer
}

export class WxTilesLayer extends L.GridLayer {
	setupCompletePromise: Promise<boolean> | undefined;

	// tiles will be stored here. There is a protected 'Leaflet's GridLayer._tiles'
	// but at some point I decided to move to my own Map.
	wxtiles: Map<string, WxTile> = new Map();
	styles: ColorStylesStrict = WxGetColorStyles();
	dataSource: DataSource;
	style: ColorStyleStrict = Object.assign({}, this.styles['base']);
	loadData: AbortableCacheableFunc = loadDataPictureCachedAbortable();
	error: string | null = 'uninitialized';
	vector: boolean = false;
	clut: RawCLUT = new RawCLUT(this.style, '', [0, 2], false);

	state: WxLayerState;

	protected animationRedrawID: number = 0;
	protected animation: boolean = false;
	protected animFrame: number = 0;
	protected oldMaxZoom: number = 0;

	constructor({ dataSource, options = {}, lazy = true }: WxTilesLayerSettings) {
		super(options); // Object.assign(this.options, options); // equal to {leaflet}.GridLayer.prototype.initialize.call(this, options); // essential for Leaflet' options initializing from parameters
		WXLOG('Creating a WxTile layer:' + JSON.stringify({ dataSource, options }));

		// class constructor
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
			throw 'dataSource is wrong!';
		}

		this.dataSource = dataSource;
		this.state = {
			units: 'undefined',
			baseURL: 'undefined',
			meta: { maxZoom: 0, times: ['undefined'], variables: ['undefined'], variablesMeta: {} },
			instance: 'undefined',
			minmax: [[0, 1]],
			originURI: 'undefined',
			time: 'undefined',
		};

		const lazySetup = () => {
			// Lazy loading
			WXLOG('Setup:', dataSource.name);

			this.setupCompletePromise = this._setUpDataSet(dataSource);

			this.setupCompletePromise
				.then(() => {
					WXLOG('Setup complete:', this.dataSource.name);

					const onLoad: L.TileEventHandlerFn = (t: L.TileEvent): void => {
						this.wxtiles.set(`${t.coords.x}:${t.coords.y}:${t.coords.z}`, (t.tile as TileEl).wxtile!);
					};
					// to maintain tiles' Map
					this.on('tileload', onLoad);

					const onUnLoad: L.TileEventHandlerFn = (t: L.TileEvent): void => {
						this.wxtiles.delete(`${t.coords.x}:${t.coords.y}:${t.coords.z}`);
					};
					this.on('tileunload', onUnLoad);

					this.on('add', this._onAddL, this);
					// this.on('remove'...) // moved to 'initialize' to avoid appearance of zombie layers due to 'lazy loading' if a user clicks on layers too fast

					// By the time when setup is complete, layer could be removed from _map, so, dont call _onAddl
					// the same happens if lazy === false
					if (this._map) {
						this._onAddL(); // simulates addTo(map)
					}

					this.fire('setupcomplete', { layer: this });
				})
				.catch((err: any) => WXLOG(err));
		};

		if (lazy) {
			this.once('add', lazySetup); // Lazy loading // sets it up only if user wants to visualise it
		} else {
			lazySetup();
		}

		this.on('remove', this._onRemoveL, this); // moved from '_initializeEvents' due to 'lazy loading'
	} // constructor

	// Leaflet's calling this, don't use it directly!
	createTile(coords: L.Coords, done: L.DoneCallback): HTMLElement {
		// const done = () => {};
		if (this.error) {
			setTimeout(done); // if 'done' is not used then visual issue happens sometimes!
			return Object.assign(createEl('div', 'error-tile'), { innerHTML: this.error });
		}

		return TileCreate({ layer: this, coords, done });
	} // createTile

	getSetupCompletePromise() {
		return this.setupCompletePromise;
	}

	// get all the information about tile and point it represents
	// zoom - current zoom level
	// latlng - pixel on the map
	getTile(latlng: L.LatLngExpression) {
		if (!this._map || this.error) return;
		const zoom = this._map.getZoom();
		const { x, y } = this._map.project(latlng, zoom);
		const coords = { x: ~~(x / 256), y: ~~(y / 256) };
		const wxtile = this.wxtiles.get(`${coords.x}:${coords.y}:${zoom}`);
		if (!wxtile) return; // tile is being created and not ready yet
		const tilePoint = { x: ~~(x - coords.x * 256), y: ~~(y - coords.y * 256) };

		const tileData = wxtile.getData(tilePoint);
		if (!tileData) return; // oops! no data
		const { raw, data } = tileData;
		const rgba = this.clut.colorsI[raw];
		const hexColor = RGBtoHEX(rgba);
		const inStyleUnits = this.clut.DataToStyle(data);
		return { tile: wxtile, data, raw, rgba, hexColor, inStyleUnits, tilePoint, units: this.style.units };
	} // getTile

	setStyle(name: string | undefined) {
		if (this.dataSource.styleName === name && name !== 'custom') return; // nothing to setup

		if (name) this.dataSource.styleName = name; // if name === undefined, use internal name for the first setup

		if (name === 'custom' && this.styles.custom) {
			// perform inheritance
			if (!this.styles.custom.parent || !(this.styles.custom.parent in this.styles)) {
				this.styles.custom.parent = 'base';
			}
			const parentStyle = this.styles[this.styles.custom.parent];
			this.styles.custom = Object.assign(Object.assign({}, parentStyle), this.styles.custom);
		}

		if (this.dataSource.styleName in this.styles) {
			if (Array.isArray(this.styles[this.dataSource.styleName])) {
				// if general styleName is used and it is an Array, then use the styleName[0] of unrolled styles
				this.dataSource.styleName += '[0]';
			}
		} else {
			WXLOG(`cant find the style (${this.dataSource.styleName})`);
			this.dataSource.styleName += '[0]';
			if (!(this.dataSource.styleName in this.styles)) {
				WXLOG(`cant find the style (${this.dataSource.styleName}), default is used`);
				this.dataSource.styleName = 'base';
			}
		}

		try {
			const ustyle = this.styles[this.dataSource.styleName];
			this.style = Object.assign({}, ustyle); // deep copy, so could be (and is) changed
			// rectify style.streamLineColor
			const c = this.style.streamLineColor;
			if (c !== 'none' && c.length < 7) {
				this.style.streamLineColor = '#' + c[1] + c[1] + c[2] + c[2] + c[3] + c[3];
			}

			const minmax = this.state.minmax[0];
			this.clut = new RawCLUT(this.style, this.state.units, minmax, this.vector);
		} catch (c) {
			const error = 'setStyle: impossible error in RawCLUT';
			WXLOG(error, c);
			throw error;
		}

		if (name) {
			this._checkAndStartSlinesAnimation();
			this._reloadTiles();
		}

		if (window.wxlogging) console.log('setStyle: "' + this.dataSource.styleName + '" for ' + this.dataSource.name + ' complete.');

		this.fire('setstyle', { layer: this });
	} // setStyle

	// string
	getStyle() {
		if (!this.dataSource) {
			if (window.wxlogging) {
				console.log('getStyle: failed. Lazy setup not finished yet.');
			}
			return;
		}
		return (this.dataSource && this.dataSource.styleName) || '';
	}

	// string
	getStyleName() {
		if (!this.dataSource) {
			if (window.wxlogging) {
				console.log('getStyleName: failed. Lazy setup not finished yet.');
			}
			return;
		}
		return (this.dataSource && this.style && this.style.name) || 'no style';
	}

	// unixTime - ms since 00:00:00 UTC on 1 January 1970
	setTime(unixTime: number): Promise<WxTile[]> {
		if (this.error) {
			WXLOG('setTime: failed. Lazy setup not finished yet.');
			return Promise.resolve([]);
		}
		// NOTE: when tiles are still loading data, and a user sets a new time-stamp... a new timestemp could be
		// loaded before old timestemp (hello network lags) then new data will be substituted with old data
		// and some visual issues can come. Have no idea how to prevent this.
		const layerTime = getClosestTimeString(this.state.meta.times, unixTime);
		if (this.state.time !== layerTime) {
			this.state.time = layerTime;
			// update BaseURL
			this.state.baseURL = this.state.originURI + this.state.instance + `{var}/${this.state.time}/{z}/{x}/{y}.${this.dataSource.ext}`; // webp

			this.fire('settime', { layer: this, layerTime });

			WXLOG('setTime: ' + layerTime + ' for ' + this.dataSource.name + ' complete.');

			const reloadPromice = this._reloadTiles();

			/* Ugly workaround for datasets like NZ_Radar where each timestep can have minmax */
			/* I check if minmax changed, then get\set a new minmax and re-setup the style */
			reloadPromice.then(() => {
				const wxtile = this.wxtiles.values().next().value;
				if (!wxtile?.data.length) return;
				const [cmin, cmax] = this.state.minmax[0];
				const { dmin, dmax } = wxtile.data[0];
				if (Math.abs(dmin - cmin) > 0.01 || Math.abs(dmax - cmax) > 0.01) {
					this.state.minmax = wxtile.data.map((d) => [d.dmin, d.dmax]);
					this._updateMinMax();
					this.setStyle(undefined);
				}
			});

			return reloadPromice;
		}

		return Promise.resolve([]);
	} // setTime

	// string
	getTime() {
		if (this.error) {
			WXLOG('getTime: failed. Lazy setup not finished yet.');
			return;
		}
		return this.state.time;
	}

	// Arra of strings (times)
	getTimes() {
		if (this.error) {
			WXLOG('getTimes: failed. Lazy setup not finished yet.');
			return;
		}
		return this.state.meta.times;
	}

	// check if data has been changed since last init
	async checkDataChanged(): Promise<boolean> {
		if (this.error) {
			WXLOG('getTimes: failed. Lazy setup not finished yet or other error: ', this.error);
			return false;
		}

		const instances = await fetchJson(this.state.originURI + 'instances.json');
		const instance = instances[instances.length - 1] + '/';
		if (this.state.instance !== instance) return true;
		// instance didn't change. Check meta.times
		const meta = await fetchJson(this.state.originURI + instance + 'meta.json');
		return this.state.meta.times.toString() !== meta.times.toString();
	}

	// usefull if data is changed on server (checkable with 'checkDataChanged')
	reloadData(): Promise<boolean> {
		return this._setUpDataSet(undefined); // forces to reload data within the same dataset, so no parameters needed
	}

	// getLegendData - data to render a proper legend
	// pixSize - width of a canvas to render this legend
	// output:
	// legend - object
	//   legend.units - (string) units
	//   legend.colors - Uint32Array(pixSize) - legend colors RGBA.
	//   legend.ticks - ([tick])aray of ticks
	//     tick.data - (float) data in legend units
	//     tick.color - (string) representation of a color at this tick
	//     tick.pos - (int) position in pixels of this tick on the legend. If style uses values out of data's range it clamps pos to (0, pixSize)
	getLegendData(legendSize: number) {
		if (this.error) return;
		if (!this.clut) {
			if (window.wxlogging) {
				console.log('getLegendData: failed. Lazy setup not finished yet:' + this.dataSource.name);
			}
			return;
		}

		return createLegend(legendSize, this.style);
	}

	setTimeAnimationMode(l: number = 2) {
		// TODO: no need to make it coarse on deep zooms
		this.oldMaxZoom = this.state.meta.maxZoom;
		const mz = this._map.getZoom();
		const minMaxZoom = mz < this.oldMaxZoom ? mz : this.oldMaxZoom;
		const newMaxZoom = minMaxZoom - l;
		this.state.meta.maxZoom = newMaxZoom < 0 ? 0 : newMaxZoom;
	}

	unsetTimeAnimationMode() {
		if (!this.oldMaxZoom || !this.state.meta.maxZoom) return;
		this.state.meta.maxZoom = this.oldMaxZoom;
		this._reloadTiles();
	}

	getMinMax() {
		const [min, max] = this.state.minmax[0];
		return { min, max };
	}

	protected async _setUpDataSet(dataSource: DataSource | undefined): Promise<boolean> {
		// if no parameters passed, then a new instance is being loaded.
		// Otherwise it's the first setup
		if (dataSource) this.dataSource = dataSource;

		this._stopLoadingResetLoadDataFunc(); // As Layer could be setup multiple times, use _stopLoadingResetLoadDataFunc

		this.state.originURI = this.dataSource.serverURI + '/' + this.dataSource.dataset + '/';

		try {
			const instances = await fetchJson(this.state.originURI + 'instances.json');
			this.state.instance = instances[instances.length - 1] + '/';
			// this.dataSource.instance = (await fetchJson(this.dataSource.originURI + 'instance.json')) + '/';
		} catch (e) {
			this.error = this.dataSource.name + ': load instances.json error: ' + e;
			WXLOG(this.error);
			return false;
		}

		try {
			const URI = this.state.originURI + this.state.instance + 'meta.json';
			this.state.meta = await fetchJson(URI);
		} catch (e) {
			this.error = this.dataSource.name + ': load meta.json error: ' + e;
			WXLOG(this.error);
			return false;
		}

		this.vector = this.dataSource.variables.length === 2;
		this.animation = this.vector;

		this.state.units = this.state.meta.variablesMeta[this.dataSource.variables[0]].units;
		this.state.minmax = this.dataSource.variables.map((v) => [this.state.meta.variablesMeta[v].min, this.state.meta.variablesMeta[v].max]);
		this._updateMinMax();

		this.error = null;

		if (dataSource) {
			this.setTime(Date.now());
			this.setStyle(undefined);
		}

		return true;
	} // _setUpDataSet

	protected _updateMinMax() {
		if (!this.vector) return;
		const [[udmin, udmax], [vdmin, vdmax]] = this.state.minmax;
		this.state.minmax.unshift([0, 1.42 * Math.max(-udmin, udmax, -vdmin, vdmax)]);
	}

	protected _checkZoom() {
		// used in _onAddL() & _onRemoveL()
		// if zoom > maxZoom then the same tiles are used, so could be loaded from cache.
		// Otherwise cache should be reset
		if (!(this._map?.getZoom() > this.state.meta.maxZoom)) {
			this._stopLoadingResetLoadDataFunc();
		}
	}

	// onAdd is used in the leaflet library! so I renamed it.
	protected _onAddL() {
		WXLOG('onadd:', this.dataSource.name);

		this._map?.on('zoomstart', this._checkZoom, this); // fired when tiles are about to start loading... when zoom or shift

		this.setupCompletePromise?.then(() => {
			this.redraw(); // need to force all tiles to be reloaded due to lazy setup
			this._checkAndStartSlinesAnimation();
		});
	}

	protected _onRemoveL() {
		WXLOG('onremove:', this.dataSource.name);

		this._map?.off('zoomstart', this._checkZoom, this);

		this.setupCompletePromise?.then(() => {
			// this promise is used to avoid appearance of zombie layers due to 'lazy loading' if a user adds->removes layers too fast
			this._stopLoadingResetLoadDataFunc(); // remove cache
			this._stopSlinesAnimation();
		});
	}

	protected _stopLoadingResetLoadDataFunc() {
		this.loadData?.abort();
		this.loadData = loadDataPictureCachedAbortable(); // and reset cache
	}

	protected _checkAndStartSlinesAnimation() {
		if (this.animFrame || !this.animation || !this.vector || !this.style.streamLineColor || this.style.streamLineColor === 'none') return;

		const drawSLines: FrameRequestCallback = (timeStemp: number) => {
			if (!this.animation || this.style.streamLineStatic) {
				// if during animation a user stops it
				this._stopSlinesAnimation();
				return;
			}
			this.wxtiles.forEach((wxtile: WxTile) => wxtile.drawSLines(timeStemp));
			this.animFrame = requestAnimationFrame(drawSLines);
		};

		drawSLines(0);
	}

	protected _stopSlinesAnimation() {
		cancelAnimationFrame(this.animFrame);
		this.wxtiles.forEach((wxtile) => wxtile.clearSLinesCanvas());
		this.animFrame = 0;
	}

	protected _redrawTiles() {
		if (!this.wxtiles || this.animationRedrawID !== 0) return; // in case animation was queued
		this.animationRedrawID = requestAnimationFrame(() => {
			this.wxtiles.forEach((wxtile) => wxtile.draw());
			this.animationRedrawID = 0;
		});
	} // _redrawTiles

	protected _reloadTiles(): Promise<WxTile[]> {
		// const promises: Promise<WxTile>[] = [];
		// this.wxtiles.forEach((wxtile: WxTile) => promises.push(wxtile.load()));

		const promises = Array.from(this.wxtiles.values()).map((wxtile: WxTile) => wxtile.load());

		const reloadedPromice = Promise.all(promises);
		reloadedPromice.then(() => this._redrawTiles());

		return reloadedPromice; // we shouldn't 'await' here! Give another promise instead
	} // _reloadTiles
} // WxGridLayerProto
