// https://stackoverflow.com/questions/36471220/how-can-i-convert-a-uint8array-with-offset-into-an-int32array
// tile.style.pointerEvents = `auto`; tile.addEventListener(`click`, function(e) {console.log(`X=` + e.offsetX + ` Y=` + e.offsetY + ` ` + coords);});

import { RawCLUT, createLegend } from './RawCLUT';
import { TileCreate } from './tile';
import { loadDataPictureCachedAbortable, fetchJson, RGBtoHEX, WxGetColorStyles, createEl } from './wxtools';
// import { ColorStyles } from './wxtools';

// this is a proto object for a L.GridLayer extending, so can't be a 'class'
// interface WxGridLayerI {
// 	options: any;
// 	initializeLayer: any; // initialize

// 	// Leaflet's calling this, don't use it directly!
// 	createTile: any; // createTile

// 	getSetupCompletePromise: any;

// 	// get all the information about tile and point it represents
// 	// zoom - current zoom level
// 	// latlng - pixel on the map
// 	getTile: any; // getTile

// 	setStyle: any; // setStyle

// 	// string
// 	getStyle: any;

// 	// string
// 	getStyleName: any;

// 	// unixTime - ms since 00:00:00 UTC on 1 January 1970
// 	setTime: any; // setTime

// 	// string
// 	getTime: any;

// 	// Arra of strings (times)
// 	getTimes: any;

// 	// check if data has been changed since last init
// 	checkDataChanged: any;

// 	// usefull if data is changed on server (checkable with 'checkDataChanged')
// 	reloadData: any;

// 	getLegendData: any;

// 	setTimeAnimationMode: any;

// 	unsetTimeAnimationMode: any;

// 	getMinMax: any;

// 	_setUpDataSet: any; // _setUpDataSet

// 	_updateMinMax: any;

// 	_initializeEvents: any;

// 	_checkZoom: any;

// 	// onAdd is used in the leaflet library! so I renamed it.
// 	_onAddL: any;

// 	_onRemoveL: any;

// 	_stopLoadingResetLoadDataFunc: any;

// 	_checkAndStartSlinesAnimation: any;

// 	_stopSlinesAnimation: any;

// 	_getClosestTimeString: any; // _getClosestTimeString

// 	_redrawTiles: any; // _redrawTiles

// 	_reloadTiles: any; // _reloadTiles
// } // WxGridLayerProto

export const WxGridLayerProto = {
	initializeLayer({ dataSource, options = {}, lazy = true }) {
		if (window.wxlogging) {
			console.log('Creating a WxTile layer:' + JSON.stringify({ dataSource, options }));
		}

		// class constructor
		if (!dataSource) {
			if (window.wxlogging) {
				console.log('dataSource is empty!');
			}
			return;
		}

		Object.assign(this.options, options); // equal to {leaflet}.GridLayer.prototype.initialize.call(this, options); // essential for Leaflet' options initializing from parameters

		this.styles = WxGetColorStyles();
		if (!dataSource.ext) dataSource.ext = 'webp';

		// tiles will be stored here. There is a protected 'Leaflet's GridLayer._tiles'
		// but at some point I decided to move to my own Map.
		this.wxtiles = new Map();

		const lazySetup = () => {
			// Lazy loading
			if (window.wxlogging) {
				console.log('Setup:', dataSource.name);
			}

			this.setupCompletePromise = this._setUpDataSet(dataSource);
			// '.then' since I don't want lazySetup to be 'async'
			this.setupCompletePromise.then(() => {
				if (window.wxlogging) {
					console.log('Setup complete:', this.dataSource.name, (this.error && '. error:' + this.error) || '');
				}

				// should be here! 'this.wxtiles' should only be formed and processed if setup complete
				this._initializeEvents();

				// By the time when setup complete, layer could be removed from _map, so, dont call _onAddl
				// the same happens if lazy === false
				if (this._map) {
					this._onAddL(); // simulates addTo(map)
				}

				this.fire('setupcomplete', { layer: this });
			});
		};

		if (lazy) {
			this.once('add', lazySetup); // Lazy loading // sets it up only if user wants to visualise it
		} else {
			lazySetup();
		}
		this.on('remove', this._onRemoveL, this); // moved from '_initializeEvents' due to 'lazy loading'
	}, // initialize

	// Leaflet's calling this, don't use it directly!
	createTile(coords, done) {
		// const done = () => {};
		if (this.error) {
			setTimeout(done); // if 'done' is not used then visual issue happens sometimes!
			return Object.assign(createEl('div', 'error-tile'), { innerHTML: this.error });
		}

		return TileCreate({ layer: this, coords, done });
	}, // createTile

	getSetupCompletePromise() {
		return this.setupCompletePromise;
	},

	// get all the information about tile and point it represents
	// zoom - current zoom level
	// latlng - pixel on the map
	getTile(latlng) {
		if (!this._map || this.error) return;
		const zoom = this._map.getZoom();
		const { x, y } = this._map.project(latlng, zoom);
		const coords = { x: ~~(x / 256), y: ~~(y / 256) };
		const wxtile = this.wxtiles.get(`${coords.x}:${coords.y}:${zoom}`);
		if (!wxtile || !wxtile.data) return; // tile is being created and not ready yet
		const tilePoint = { x: ~~(x - coords.x * 256), y: ~~(y - coords.y * 256) };

		const tileData = wxtile.getData(tilePoint);
		if (!tileData) return; // oops! no data
		const { raw, data } = tileData;
		const rgba = this.clut.colorsI[raw];
		const hexColor = RGBtoHEX(rgba);
		const inStyleUnits = this.clut.DataToStyle(data);
		return { tile: wxtile, data, raw, rgba, hexColor, inStyleUnits, tilePoint, units: this.style.units };
	}, // getTile

	setStyle(name) {
		if (!this.dataSource) {
			if (window.wxlogging) {
				console.log('setStyle: failed. Lazy setup not finished yet.');
			}
			return;
		}

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
			this.dataSource.styleName = this.dataSource.name + '[0]';
			if (!(this.dataSource.styleName in this.styles)) {
				this.dataSource.styleName = 'base';
				if (window.wxlogging) console.log(`cant find the style (${name}), default is used`);
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

			const minmax = this.dataSource.minmax[0];
			this.clut = new RawCLUT(this.style, this.dataSource.units, minmax, this.vector);
		} catch (c) {
			this.error = 'setStyle: impossible error in RawCLUT';
			if (window.wxlogging) console.log(this.error, c);
			return;
		}
		if (name) {
			this._checkAndStartSlinesAnimation();
			this._reloadTiles();
		}

		if (window.wxlogging) console.log('setStyle: "' + this.dataSource.styleName + '" for ' + this.dataSource.name + ' complete.');

		this.fire('setstyle', { layer: this });
	}, // setStyle

	// string
	getStyle() {
		if (!this.dataSource) {
			if (window.wxlogging) {
				console.log('getStyle: failed. Lazy setup not finished yet.');
			}
			return;
		}
		return (this.dataSource && this.dataSource.styleName) || '';
	},

	// string
	getStyleName() {
		if (!this.dataSource) {
			if (window.wxlogging) {
				console.log('getStyleName: failed. Lazy setup not finished yet.');
			}
			return;
		}
		return (this.dataSource && this.style && this.style.name) || 'no style';
	},

	// unixTime - ms since 00:00:00 UTC on 1 January 1970
	setTime(unixTime) {
		if (!this.dataSource) {
			if (window.wxlogging) {
				console.log('setTime: failed. Lazy setup not finished yet.');
			}
			return;
		}
		// NOTE: when tiles are still loading data, and a user sets a new time-stamp... a new timestemp could be
		// loaded before old timestemp (hello network lags) then new data will be substituted with old data
		// and some visual issues can come. Have no idea how to prevent this.
		const layerTime = this._getClosestTimeString(unixTime);
		if (this.dataSource.time !== layerTime) {
			this.dataSource.time = layerTime;
			// update BaseURL
			this.dataSource.baseURL = this.dataSource.originURI + this.dataSource.instance + `{var}/${this.dataSource.time}/{z}/{x}/{y}.${this.dataSource.ext}`; // webp

			this.fire('settime', { layer: this, layerTime });

			if (window.wxlogging) console.log('setTime: ' + layerTime + ' for ' + this.dataSource.name + ' complete.');

			const reloadPromice = this._reloadTiles();

			/* Ugly workaround for datasets like NZ_Radar where each timestep can have minmax */
			/* I check if minmax changed, then get\set a new minmax and re-setup the style */
			reloadPromice.then(() => {
				const wxtile = this.wxtiles.entries().next().value?.[1];
				if (!wxtile) return;
				const [cmin, cmax] = this.dataSource.minmax[0];
				const { dmin, dmax } = wxtile.data[0];
				if (Math.abs(dmin - cmin) > 0.01 || Math.abs(dmax - cmax) > 0.01) {
					this.dataSource.minmax = wxtile.data.map((d) => [d.dmin, d.dmax]);
					this._updateMinMax();
					this.setStyle();
				}
			});

			return reloadPromice; // TODO: check min max after setTime!!!!
		}
		return Promise.resolve();
	}, // setTime

	// string
	getTime() {
		if (!this.dataSource) {
			if (window.wxlogging) {
				console.log('getTime: failed. Lazy setup not finished yet.');
			}
			return;
		}
		return this.dataSource.time;
	},

	// Arra of strings (times)
	getTimes() {
		if (!this.dataSource) {
			if (window.wxlogging) {
				console.log('getTimes: failed. Lazy setup not finished yet.');
			}
			return;
		}
		return this.dataSource.meta.times;
	},

	// check if data has been changed since last init
	async checkDataChanged() {
		if (!this.dataSource) {
			if (window.wxlogging) console.log('getTimes: failed. Lazy setup not finished yet.');
			return Promise.resolve(false);
		}
		const instances = await fetchJson(this.dataSource.originURI + 'instances.json');
		const instance = instances[instances.length - 1] + '/';
		if (this.dataSource.instance !== instance) return true;
		// instance didn't change. Check meta.times
		const meta = await fetchJson(this.dataSource.originURI + instance + 'meta.json');
		return this.dataSource.meta.times.toString() !== meta.times.toString();
	},

	// usefull if data is changed on server (checkable with 'checkDataChanged')
	reloadData() {
		return this._setUpDataSet(); // forces to reload data within the same dataset, so no parameters needed
	},

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
	getLegendData(legendSize) {
		if (this.error) return;
		if (!this.clut) {
			if (window.wxlogging) {
				console.log('getLegendData: failed. Lazy setup not finished yet:' + this.dataSource.name);
			}
			return;
		}

		return createLegend(legendSize, this.style);
	},

	setTimeAnimationMode(l = 2) {
		// TODO: no need to make it coarse on deep zooms
		this.oldMaxZoom = this.dataSource.meta.maxZoom;
		const mz = this._map.getZoom();
		const minMaxZoom = mz < this.oldMaxZoom ? mz : this.oldMaxZoom;
		const newMaxZoom = minMaxZoom - l;
		this.dataSource.meta.maxZoom = newMaxZoom < 0 ? 0 : newMaxZoom;
	},

	unsetTimeAnimationMode() {
		if (!this.oldMaxZoom || !this.dataSource?.meta?.maxZoom) return;
		this.dataSource.meta.maxZoom = this.oldMaxZoom;
		this._reloadTiles();
	},

	getMinMax() {
		const [min, max] = this.dataSource.minmax[0];
		return { min, max };
	},

	async _setUpDataSet(dataSource) {
		if (
			dataSource &&
			!(dataSource.dataset && dataSource.variables && Array.isArray(dataSource.variables) && dataSource.variables.length > 0 && dataSource.variables.length < 3)
		) {
			this.error = dataSource.name + ': dataSource error';
			if (window.wxlogging) console.log(this.error);
			return;
		}

		// if no parameters passed, then a new instance is being loaded.
		// Otherwise it's the first setup
		if (dataSource) this.dataSource = dataSource;

		this._stopLoadingResetLoadDataFunc(); // As Layer could be setup multiple times, use _stopLoadingResetLoadDataFunc

		this.dataSource.originURI = this.dataSource.serverURI + '/' + this.dataSource.dataset + '/';

		try {
			const instances = await fetchJson(this.dataSource.originURI + 'instances.json');
			this.dataSource.instance = instances[instances.length - 1] + '/';
			// this.dataSource.instance = (await fetchJson(this.dataSource.originURI + 'instance.json')) + '/';
		} catch {
			this.error = this.dataSource.name + ': load instances.json error';
			if (window.wxlogging) console.log(this.error);
			return;
		}

		try {
			const URI = this.dataSource.originURI + this.dataSource.instance + 'meta.json';
			this.dataSource.meta = await fetchJson(URI);
		} catch {
			this.error = this.dataSource.name + ': load meta.json error';
			if (window.wxlogging) console.log(this.error);
			return;
		}

		this.vector = this.dataSource.variables.length === 2;
		this.animation = this.vector;

		this.dataSource.units = this.dataSource.meta.variablesMeta[this.dataSource.variables[0]].units;
		this.dataSource.minmax = this.dataSource.variables.map((v) => [this.dataSource.meta.variablesMeta[v].min, this.dataSource.meta.variablesMeta[v].max]);
		this._updateMinMax();

		if (dataSource) {
			this.setTime(Date.now());
			this.setStyle();
		}
	}, // _setUpDataSet

	_updateMinMax() {
		if (!this.vector) return;
		const [[udmin, udmax], [vdmin, vdmax]] = this.dataSource.minmax;
		this.dataSource.minmax.unshift([0, 1.42 * Math.max(-udmin, udmax, -vdmin, vdmax)]);
	},

	_initializeEvents() {
		// class constructor 2 stage
		if (this.error) {
			return;
		}

		// to maintain tiles' Map
		this.on('tileload', (t) => {
			this.wxtiles.set(`${t.coords.x}:${t.coords.y}:${t.coords.z}`, t.tile.wxtile);
		});
		this.on('tileunload', (t) => {
			this.wxtiles.delete(`${t.coords.x}:${t.coords.y}:${t.coords.z}`);
		});

		this.on('add', this._onAddL, this);
		// this.on('remove'...) // moved to 'initialize' to avoid appearance of zombie layers due to 'lazy loading' if a user clicks on layers too fast
	},

	_checkZoom() {
		// used in _onAddL() & _onRemoveL()
		// id zoom > maxZoom then the same tiles are used, so could be loaded from cache.
		// Otherwise cache should be reset
		if (!this._map || this._map.getZoom() < this.dataSource.meta.maxZoom) {
			this._stopLoadingResetLoadDataFunc();
		}
	},

	// onAdd is used in the leaflet library! so I renamed it.
	_onAddL() {
		if (window.wxlogging) {
			console.log('onadd:', this.dataSource.name);
		}

		if (!this.error) this._map.on('zoomstart', this._checkZoom, this); // fired when tiles are about to start loading... when zoom or shift

		this.setupCompletePromise.then(() => {
			this.redraw(); // need to force all tiles to be reloaded due to lazy setup
			this._checkAndStartSlinesAnimation();
		});
	},

	_onRemoveL() {
		if (window.wxlogging) {
			console.log('onremove:', this.dataSource.name);
		}

		this._map.off('zoomstart', this._checkZoom, this);

		this.setupCompletePromise.then(() => {
			// this promise is used to avoid appearance of zombie layers due to 'lazy loading' if a user adds->removes layers too fast
			this._stopLoadingResetLoadDataFunc(); // remove cache
			this._stopSlinesAnimation();
		});
	},

	_stopLoadingResetLoadDataFunc() {
		this.loadData?.abort();
		this.loadData = loadDataPictureCachedAbortable(); // and reset cache
	},

	_checkAndStartSlinesAnimation() {
		if (this.animFrame || !this.animation || !this.vector || !this.style.streamLineColor || this.style.streamLineColor === 'none') return;

		const drawSLines = (timeStemp) => {
			if (!this.animation || this.style.streamLineStatic) {
				// if during animation a user stops it
				this._stopSlinesAnimation();
				return;
			}
			this.wxtiles.forEach((wxtile) => wxtile.drawSLines(timeStemp));
			this.animFrame = requestAnimationFrame(drawSLines);
		};
		drawSLines();
	},

	_stopSlinesAnimation() {
		cancelAnimationFrame(this.animFrame);
		this.wxtiles.forEach((wxtile) => wxtile.clearSLinesCanvas());
		this.animFrame = 0;
	},

	_getClosestTimeString(unixTime) {
		// Take the next this.dataSource.meta.times[]'s after unixTime OR the last

		return (
			this.dataSource.meta.times.find((stime) => new Date(stime).getTime() >= unixTime) || this.dataSource.meta.times[this.dataSource.meta.times.length - 1]
		);

		// for (const stime of this.dataSource.meta.times) {
		// 	const t = new Date(stime).getTime(); // this.dataSource.meta.times are strings
		// 	if (t >= unixTime) {
		// 		return stime;
		// 	}
		// }
		// return this.dataSource.meta.times[this.dataSource.meta.times.length - 1]; // last
	}, // _getClosestTimeString

	_redrawTiles() {
		if (!this.wxtiles || this.animationRedrawID) return; // in case animation was queued
		this.animationRedrawID = requestAnimationFrame(() => {
			this.wxtiles.forEach((wxtile) => wxtile.draw());
			this.animationRedrawID = null;
		});
	}, // _redrawTiles

	_reloadTiles() {
		const promises = [];
		this.wxtiles.forEach((wxtile) => promises.push(wxtile._load()));
		const reloadedPromice = Promise.all(promises);
		reloadedPromice.then(() => this._redrawTiles());
		return reloadedPromice; // we shouldn't 'await' here! Give another promise instead
	}, // _reloadTiles
}; // WxGridLayerProto
