'use strict';

const { WxTilesLogging, WxTilesLibSetup, WxGetColorStyles } = window.wxtilesjs;
const { CreateWxTilesWatermark, CreateWxTilesLayer, CreateWxDebugCoordsLayer } = window.wxtilesjs;
const L = window.L;

let map;
let layerControl;
let config;
let styles; // all available styles. Not every style is sutable for every layer.
let layer; // current layer

// json loader helper
async function fetchJson(url) {
	return (await fetch(url)).json();
}

async function fillDataSets() {
	let datasetsNames;

	try {
		datasetsNames = await fetchJson(config.dataServer + '/datasets.json');
	} catch (e) {
		console.log(e);
		return;
	}

	datasetsNames.sort();
	for (const datasetName of datasetsNames) {
		const opt = document.createElement('option');
		opt.appendChild(document.createTextNode(datasetName));
		opt.value = datasetName;
		selectDataSetEl.appendChild(opt);
	}

	await fillVariables_selectDataSetEl_onchange();
}

async function fillVariables_selectDataSetEl_onchange() {
	const oldVariable = selectVariableEl.value;
	selectVariableEl.innerHTML = '';
	let meta;
	try {
		const instances = await fetchJson(config.dataServer + '/' + selectDataSetEl.value + '/instances.json');
		const instance = instances[instances.length - 1];
		meta = await fetchJson(config.dataServer + '/' + selectDataSetEl.value + '/' + instance + '/meta.json');
	} catch (e) {
		console.log(e);
		return;
	}

	meta.variables.sort();
	for (const variable of meta.variables) {
		if (variable.includes('northward')) {
			continue;
		}
		const opt = document.createElement('option');
		opt.appendChild(document.createTextNode(variable.replace('eastward', 'vector')));
		opt.value = variable;
		selectVariableEl.appendChild(opt);
	}

	if (meta.variables.includes(oldVariable)) {
		selectVariableEl.value = oldVariable;
	}

	loadVariable_selectVariableEl_onchange();
}

async function loadVariable_selectVariableEl_onchange() {
	stopPlay();

	const variable = selectVariableEl.value;
	const variables = [variable];
	if (variable.includes('eastward')) {
		variables.push(variable.replace('eastward', 'northward'));
	}
	const layerSettings = {
		dataSource: {
			serverURI: config.dataServer, // server to fetch data from
			ext: config.ext, // png / webp (default) - wxtilesplitter output format
			dataset: selectDataSetEl.value, // dataset of the dataset
			variables, // variable(s) to be used for the layer rendering
			name: selectDataSetEl.value + '/' + selectVariableEl.selectedOptions[0].label, // attribute of the dataSource to be used externally
			styleName: variable, // The name of the style (from styles.json) to apply for the layer
		},
		// Lazy setup
		// 'true': perform setup and data loading on 'addTo(map)'.
		// 'false': start loading immediately, but loading is not finished when layer is created.
		// the signal 'setupcomplete' is fired when loading is finished.
		// useful when a big bunch of layers is used, so layers are not wasting memory and bandwidth.
		lazy: false,
		options: {
			opacity: 1,
		},
	};

	// save in order to delete old layer
	const oldLayer = layer; // this is to store oldLayer in order a user change layers too fast.
	layer = CreateWxTilesLayer(layerSettings);
	await layer.getSetupCompletePromise(); // 'complete' doesn't mean 'loaded' !!!
	layer.addTo(map);
	layerControl.addOverlay(layer, layerSettings.dataSource.name);
	if (oldLayer)
		layer.once('load', () => {
			oldLayer.removeFrom(map);
			oldLayer.removeFrom(layerControl);
		}); // delete old layer
	layer.setTime(selectTimeEl.value !== '' ? new Date(selectTimeEl.value).getTime() : Date.now()); // try to preserve 'time' from current time of selectTimeEl
	fillTimes(layer);
	fillStyles(layer);
}

function fillTimes(layer) {
	// once layer setup finished, times are available.
	// let's fill up 'selectTimeEl'
	selectTimeEl.innerHTML = '';
	layer.getTimes().forEach((val) => {
		const opt = document.createElement('option');
		opt.appendChild(document.createTextNode(val));
		opt.value = val;
		selectTimeEl.appendChild(opt);
	});

	selectTimeEl.value = layer.getTime();
}

function setTime_selectTimeEl_onchange() {
	stopPlay();
	layer.setTime(new Date(selectTimeEl.value).getTime());
	selectTimeEl.value = layer.getTime();
}

function startStopPlay() {
	this.textContent === 'play' ? startPlay() : stopPlay();
}

function startPlay() {
	if (!layer || !layer.setTimeAnimationMode) return;
	// const nextTimeStep = async () => { };
	buttonPlayStopEl.textContent = 'stop';
	layer.setTimeAnimationMode(+inputCoarseLevelEl.value);
	setTimeout(async function nextTimeStep() {
		if (buttonPlayStopEl.textContent === 'stop') {
			const start = Date.now();
			await layer.setTime(new Date(selectTimeEl.value).getTime());
			selectTimeEl.selectedIndex++;
			selectTimeEl.selectedIndex %= selectTimeEl.length;
			const dt = +inputAnimDelayEl.value - (Date.now() - start);
			setTimeout(nextTimeStep, dt < 0 ? 0 : dt);
			updateInfoPanel();
		}
	});
}

function stopPlay() {
	buttonPlayStopEl.textContent = 'play';
	layer?.unsetTimeAnimationMode();
}

function addOption(baseStyle, value = baseStyle) {
	const opt = document.createElement('option');
	opt.appendChild(document.createTextNode(baseStyle));
	opt.value = value;
	selectStyleEl.appendChild(opt);
}

function fillStyles(layer) {
	selectStyleEl.innerHTML = '';
	for (const [regexp, styleName] of config.varToStyleMap) {
		const regExp = new RegExp(regexp, 'i');
		if (styleName in styles && regExp.test(layer.dataSource.variables[0])) {
			addOption(styles[styleName].name, styleName);
		}
	}

	addOption('base');
	addOption('custom');
	onStyleChange_selectStyleEl_onchange();
}

function JSONsort(o) {
	if (Array.isArray(o)) {
		return o.map(JSONsort);
	} else if (typeof o === 'object' && o !== null) {
		const keys = Object.keys(o)
			// .map((a) => a.toUpperCase())
			.sort((a, b) => {
				const aa = a.toUpperCase();
				const bb = b.toUpperCase();
				return aa == bb ? 0 : aa > bb ? 1 : -1;
			});
		return keys.reduce((a, k) => {
			a[k] = JSONsort(o[k]);
			return a;
		}, {});
	}
	return o;
}

// function relax(o) {
// 	for (const styleName in o) {
// 		if (styleName === 'base') continue;
// 		for (const field in o[styleName]) {
// 			if (o[styleName][field] === __colorStyles_default_preset.base[field]) {
// 				delete o[styleName][field];
// 			}
// 		}
// 	}
// 	return o;
// }

function onStyleChange_selectStyleEl_onchange() {
	if (selectStyleEl.value === 'custom') {
		try {
			styles.custom = JSON.parse(customStyleEl.value);
		} catch {
			console.log('Wrong custom style');
			const ctx = legendCanvasEl.getContext('2d');
			ctx.clearRect(0, 0, legendCanvasEl.width, legendCanvasEl.height);
			ctx.beginPath();
			ctx.font = legendCanvasEl.height / 2 + 'px sans-serif';
			ctx.fillText('Wrong custom style', 10, legendCanvasEl.height / 2);
			ctx.stroke();
			return;
		}
	}
	layer.setStyle(selectStyleEl.value);
	const curStyleName = layer.getStyle();
	const curStyle = styles[curStyleName];
	customStyleEl.value = JSON.stringify(JSONsort(curStyle), null, '    ');
	const legend = layer.getLegendData(legendCanvasEl.width - 50);
	drawLegend({ legend, canvas: legendCanvasEl });
}

function drawLegend({ legend, canvas }) {
	if (!canvas || !legend) return;

	const { width, height } = canvas;
	const halfHeight = (16 + height) >> 2;

	// draw legend
	const ctx = canvas.getContext('2d');
	const imData = ctx.createImageData(width, height);
	const im = new Uint32Array(imData.data.buffer);
	im.fill(-1);

	const startX = 2;
	const startY = 2;
	const startXY = startX + width * startY;

	const trSize = halfHeight >> 1;
	// left triangle
	if (legend.showBelowMin) {
		const c = legend.colors[0];
		if (c) {
			for (let x = 0; x < trSize; ++x) {
				for (let y = trSize; y < trSize + x; ++y) {
					im[startXY + x + y * width] = c;
					im[startXY + x + (trSize * 2 - y) * width] = c;
				}
			}
		}
	}

	for (let x = 0; x < legend.size; ++x) {
		for (let y = 0; y < halfHeight; ++y) {
			if (legend.colors[0]) {
				im[startX + x + trSize + (y + startY + 1) * width] = legend.colors[x];
			}
		}
	}

	// right triangle
	if (legend.showAboveMax) {
		const c = legend.colors[legend.colors.length - 1];
		if (c) {
			for (let x = 0; x <= trSize; ++x) {
				for (let y = trSize; y < trSize + x; ++y) {
					im[startXY + trSize * 2 + legend.size - x + y * width] = c;
					im[startXY + trSize * 2 + legend.size - x + (trSize * 2 - y) * width] = c;
				}
			}
		}
	}

	ctx.putImageData(imData, 0, 0);

	// draw ticks
	ctx.font = '8px sans-serif';
	ctx.beginPath();
	for (const tick of legend.ticks) {
		ctx.strokeStyle = '#000';
		ctx.moveTo(tick.pos + trSize + startX + 1, startY + 3);
		ctx.lineTo(tick.pos + trSize + startX + 1, halfHeight);
		ctx.fillText(tick.dataString, tick.pos + trSize + startX + 1, halfHeight + 11);
	}
	ctx.font = '12px sans-serif';
	const txt = layer.getStyleName() + ' (' + legend.units + ')';
	ctx.fillText(txt, 13, height - 5);
	ctx.stroke();

	ctx.strokeStyle = '#888';
	ctx.strokeRect(1, 1, width - 3, height - 2); //for white background
}

let oldE;
function updateInfoPanel(e) {
	oldE = e = e ?? oldE; // save or restore 'e'
	if (!e) return;
	let content = '' + `${e.latlng}<br>`;
	map.eachLayer((layer) => {
		if (layer.getTile) {
			// check if layer is a wxLayer
			const tile = layer.getTile(e.latlng);
			const { min, max } = layer.getMinMax();

			content += tile
				? `<div>
				<div style="width:1em;height:1em;float:left;margin-right:2px;background:${tile.hexColor}"></div>
				${tile.tile.layer.dataSource.name}=${tile.inStyleUnits.toFixed(2)} ${tile.units} (${min.toFixed(2)}, ${max.toFixed(2)})
				</div>`
				: '';
		}
	});

	infoPanelEl.innerHTML = content;
}

function popupInfo(e) {
	let content = '';
	map.eachLayer((layer) => {
		if (layer.getTile) {
			// check if layer is a wxLayer
			const tile = layer.getTile(e.latlng);
			const time = layer.getTime();
			content += tile
				? `<div>
					<div style="width:1em;height:1em;float:left;margin-right:2px;background:${tile.hexColor}"></div>
					${layer.dataSource.name}<br>
					(in style Units = ${tile.inStyleUnits} ${tile.units})<br>
					(in data Units = ${tile.data} ${layer.state.units})<br>
					(time:${time})<br>
					(instance:${layer.state.instance})<br>
					(tileCoords:${tile.tile.coords.x},${tile.tile.coords.y},zoom:${tile.tile.coords.z})<br>
					(tilePoint:${tile.tilePoint.x},${tile.tilePoint.y})<br>
				</div>`
				: '';
		}
	});

	L.popup()
		.setLatLng(e.latlng)
		.setContent(content + `${e.latlng}`)
		.openOn(map);
}

function createControl(opt) {
	return new (L.Control.extend({
		onAdd() {
			return document.getElementById(opt.htmlID);
		},
	}))(opt);
}

async function start() {
	// read config
	try {
		config = await fetchJson('props/config.json'); // set the correct URI
	} catch (e) {
		console.log(e);
	}

	// Leaflet basic setup // set the main Leaflet's map object, compose and add base layers
	map = L.map('map', config.map);

	// Setup WxTiles lib
	WxTilesLogging(true); // use wxtiles logging -> console.log
	CreateWxTilesWatermark({ URI: 'res/wxtiles-logo.png', position: 'topright' }).addTo(map);
	layerControl = L.control.layers(null, null, { position: 'topright', autoZIndex: false, collapsed: false }).addTo(map);
	config.baseLayers.map((baseLayer) => {
		const layer = L.tileLayer(baseLayer.URL, baseLayer.options);
		baseLayer.options.zIndex === 0 ? layerControl.addBaseLayer(layer, baseLayer.name) : layerControl.addOverlay(layer, baseLayer.name);
	});
	layerControl.addOverlay(CreateWxDebugCoordsLayer(), 'tile boundaries');
	layerControl.addBaseLayer(L.tileLayer('').addTo(map), 'base-empty');

	createControl({ position: 'topleft', htmlID: 'legend' }).addTo(map);
	createControl({ position: 'topleft', htmlID: 'layerPanel' }).addTo(map);
	createControl({ position: 'topleft', htmlID: 'styleEditor' }).addTo(map);
	createControl({ position: 'bottomleft', htmlID: 'infoPanel' }).addTo(map);

	const wxlibCustomSettings = {};
	try {
		// these URIs are for the demo purpose. set the correct URI
		wxlibCustomSettings.colorStyles = await fetchJson('props/styles.json'); // set the correct URI
	} catch (e) {
		console.log(e);
	}
	try {
		wxlibCustomSettings.units = await fetchJson('props/uconv.json'); // set the correct URI
	} catch (e) {
		console.log(e);
	}
	try {
		wxlibCustomSettings.colorSchemes = await fetchJson('props/colorschemes.json'); // set the correct URI
	} catch (e) {
		console.log(e);
	}

	// ESSENTIAL step to get lib ready.
	WxTilesLibSetup(wxlibCustomSettings); // load fonts and styles, units, colorschemas - empty => defaults
	await document.fonts.ready; // !!! IMPORTANT: make sure fonts (barbs, arrows, etc) are loaded

	// WxDebugCoordsLayer().addTo(map);

	styles = WxGetColorStyles(); // all available styles. Not every style is sutable for this layer.

	// {
	// 	const sorted = JSONsort(styles);
	// 	const str = JSON.stringify(sorted);
	// 	console.dir(str);
	// }

	fillDataSets();

	map.on('zoom', stopPlay); // stop time animation on zoom
	map.on('mousemove', updateInfoPanel);
	map.on('click', popupInfo);
}

const selectDataSetEl = document.getElementById('selectDataSet');
selectDataSetEl.onchange = () => {
	fillVariables_selectDataSetEl_onchange();
};

const selectVariableEl = document.getElementById('selectVariable');
selectVariableEl.onchange = loadVariable_selectVariableEl_onchange;

const selectStyleEl = document.getElementById('selectStyle');
selectStyleEl.onchange = onStyleChange_selectStyleEl_onchange;

const legendCanvasEl = document.getElementById('legend');

const customStyleEl = document.getElementById('customStyle');
customStyleEl.toggled = true;
customStyleEl.onchange = function () {
	selectStyleEl.value = 'custom';
	onStyleChange_selectStyleEl_onchange();
};

const customStyleButtonEl = document.getElementById('customStyleButton');
customStyleButtonEl.innerHTML = 'show Custom Style Editor';
customStyleButtonEl.onclick = () => {
	if (customStyleEl.toggled) {
		customStyleEl.style.display = 'none';
		customStyleButtonEl.innerHTML = 'show Custom Style Editor';
	} else {
		customStyleEl.style.display = 'block';
		customStyleButtonEl.innerHTML = 'update Custom Style & Hide';
		selectStyleEl.value = 'custom';
	}
	customStyleEl.toggled = !customStyleEl.toggled;
};
customStyleButtonEl.click();

const selectTimeEl = document.getElementById('selectTime');
selectTimeEl.onchange = setTime_selectTimeEl_onchange;

const infoPanelEl = document.getElementById('infoPanel');

const buttonHoldEl = document.getElementById('buttonHold');
buttonHoldEl.onclick = () => {
	L.popup()
		.setLatLng(map.getCenter())
		.setContent(
			`
			This layer was "held". 
			You can hold as many layers as you want, but you can't control them after holding.
			New layers will appear OVER the held layers.
			Use the "clear" button to clear the ALL VISIBLE layers.
			`
		)
		.openOn(map);
	stopPlay();
	layer = undefined;
};

const clearEl = document.getElementById('buttonClear');
clearEl.onclick = () => {
	map.eachLayer((l) => {
		if (l.getTile) {
			l.removeFrom(map);
			l.removeFrom(layerControl);
		}
	});
	loadVariable_selectVariableEl_onchange();
};

const buttonPlayStopEl = document.getElementById('buttonPlayStop');
buttonPlayStopEl.onclick = startStopPlay;

const inputAnimDelayEl = document.getElementById('animDelay');
const inputCoarseLevelEl = document.getElementById('coarseLevel');

start();
