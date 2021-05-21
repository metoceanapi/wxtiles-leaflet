# WxTilesJS lib

JS lib based on Leaflet https://leafletjs.com  
Data tiles are from https://tiles.metoceanapi.com

# demo and examples

To see a demo running:
```
npm install
npm run start
```
Demo code is found in 
``` 
public/index.html
public/index.js
```

# API. Functions

## WxTileLibSetup({ colorStyles, units, colorSchemes } = {})

Wxtile lib must be initialized before use.

## WxGetColorStyles()

Get all style objects. See 'styles'

## WxTileLayer(settings)

See Layer.initialize

## WxTileLogging(bool:on = false)

Print vast logs to consol.

## WxGetInternalLeafletCopy()

Get the Leaflet library bundled with Wxtiles.

## WxTileWatermark(params)

params - Leaflet control's parameters

# API. Layer Objects

## constructor: initialize({ dataSource, options = {}, lazy = true })

```js
dataSource = {
			serverURI: string, // server to fetch data from
			ext: string, // png / webp (default) - wxtilesplitter output format
			dataset: string, // dataset of the dataset
			variables: [string, string] // variable(s) to be used for the layer rendering
			name: string, // attribute of the dataSource to be used externally
			styleName: string, // The name of the style (from styles.json) to apply for the layer
		}
// Lazy setup
// 'true': perform setup and data loading on 'addTo(map)'.
// 'false': start loading immediately, but loading is not finished when layer is created.
// the signal 'setupcomplete' is fired when loading is finished.
// useful when a big bunch of layers is used, so layers are not wasting memory and bandwidth.
lazy: bool

options = { // Lealet's options for the layer
    opacity: 1,
}
```

## getSetupCompletePromise() : Promise<void>

As setup process is async, this function returns the promise which is resolved upon setup complete.

## once('setupcomplete', func(){})

It is a Leaflet's feature.
_func_ - a callback called upon setup complete.

## createTile(coords: obj, done: function)

Leaflet calls this function to create tiles.

## getTile(latlng) : obj

```js
latlng = { lat: num, lon: num };
obj = { tile: obj, data: num, raw: uint16, rgba: Uint32, hexColor: string, inStyleUnits: num, tilePoint: { x, y }, units: string };
```

**tile** - internal wxtile-js lib object.  
**raw** - raw representation of data at latlng  
**data** - data at latlng  
**inStyleUnits** - data at latlng converted into style units.  
**rgba** - uint32 representation of the color at latlng  
**hexColor** - web format of the color reprensentation at latlng  
**tilePoint** - {x, y} (0-256) projection of the latlng on the tile.  
**units** - style units

## setStyle(name: string)

**name** - a name of a style object in _styles.json_. (Warning! it is not an internal 'name' _in_ the style)

## getStyle() : string

Get the 'name' of the layer's style object used for rendering.

## getStyleName() : string

Get an internal 'name' of the layer's style.

## setTime(unixTime: number) : Promise<void>

_unixTime_ - milliseconds since Jan 1, 1970, 00:00:00.000 GMT
_Promise_ is resolved when new data is loaded and rendered. _Undefined_ if error ocured.

## getTime() : string

Get current layer's _time step_ used for rendering.

## getTimes()

Get all layer's _time steps_.

## checkDataChanged() : Promise<bool>

resolved as _true_ if there is a new instance of data.

## reloadData() : Promise<void>

Forces layer to reload data

## getLegendData(legendSize: number): obj

Returns style's metadata usefull for legend rendering
_legendSize_ - width of a legend.

```js
obj = { size: number, showBelowMin: bool, showAboveMax: bool, units: string, colors: Uint32Array(size), ticks: [tickobj] };
tickobj = { data: number, dataString: string, color: string, pos: number };
```

_size_ = legendSize
_showBelowMin_ - usefull to show somehow on a legend that data is shown (or not) below the legend's minimum
_showAboveMax_ - usefull to show somehow on a legend that data is shown (or not) above the legend's maximum
_units_ - style's units
_colors_ - array of RGBA.

_tick_ - metadata for ticks on the legend
_data_ - data in style's units
_dataString_ - string representation of a data (formated).
_color_ - web color at the tick
_pos_ - legend's X coord for the tick (0, legendSize)

## setTimeAnimationMode(l = 2)

Prepares layer to be time-animated. Reduces level of detalization, so dramaticaly reduces downloaded data during animation.

## unsetTimeAnimationMode()

Restores level of detalization to the level's maximum.

# WxTile Data structure

See https://github.com/metocean/wxtile-splitter

## Styles, unrolling and inheritance

'styles.json' contains a set of styles. It is processsed in order to aplly 'unrolling' and 'inheritance'

'unrolling' and 'inheritance' example:

```js
{
	"variableName": [ // style can be arrays of styles. Usefull when many styles are set for one variable.
		{
			"name": "super 0",
			"....": "..."
		},
		{
			"name": "super 1",
			"....": "..."
		},
		{
			"name": "super 2",
			"parent": "variablName[1]",
			"....": "..."
		}
	]
}
```

unrolled to

```json
{
	// NOTE: order number in array is added to the arrayed-style, so each style becomes independent
	"variableName[0]": {
		"name": "super 0",
		"....": "..."
	},
	// So, as an example of inheritance, 'variableName[1]' could be used as a parent for variableName[2]
	"variableName[1]": {
		"name": "super 1",
		"....": "..."
	},
	// So, as an example of inheritance, 'variableName[1]' could be used as a parent for variableName[2]
	"variableName[2]": {
		"name": "super 2",
		"parent": "variableName[1]",
		"....": "..."
	}
}
```

## fields of a style

```js
{
    "parent": "base", /* parent the style. Usefull within the inharitance system.
                            If presented in 'styles.json', to fullfill this style the parentstyle is ammended with fields of this style.
                            multi-inheritance is acceptable, so parent style can have its own parent etc
                            if no parent specified parent="base" is used. "base" style must be in 'styles.json'
                            NOTE: useless for hot 'custom' style - dirty hack acccepted by wxtile-js lib.*/
	"name": "Style name to be showed on legend",
	"fill": "gradient(default)/solid/none",
	"isolineColor": "inverted(default)/fill/none",
	"isolineText": true,  // make text on isolines visible (default: true)
	"showBelowMin": true, // make invisible(if false) data below minimud level data.
	"showAboveMax": true, // make invisible(if false) data above minimud level data.
	"blurRadius": 0, // apply BoxBlur to fetched data
	"addDegrees": 0, // rotation of arrows. Usefull for currents and winds in some cases with data units 'degree' to coorect rotation of original data if needed.
	"vectorColor": "inverted/fill/none(default)/#xxxxxxxx", /* color of vectors:
                                    "none" - (default) don't render vectors,
                                    "inverted" - inverted color for current data,
                                    "fill" - color for current data,
                                    "#ffffffff" - const color (web format) for all vectors.*/
	"vectorType": "arrows(default)/barbs", /*the name of the font used for vector rendering.
                                    "none" - (default) don't render vectors,
                                    "vector" - arrows
                                    "barbs" - barbs*/
	"streamLineColor": "none/#888", // in web color scheme "#rgb" or "#rrggbb" "#rrggbbaa". "none" - no particle animation
	"streamLineSpeedFactor": 3, // factor to make stream lines longer (particles faster).
    "streamLineStatic": false, // don't animate streamlines, draw a 'curve' instead.
	"levels": [0, 0.25, 0.75, 1, 1.5, 2], /* levels of data for legend and isolines.
                                    if "levels" is null, then 10 levels in [min, max] are autocreated.
                                    Ignored if 'colorMap' is not null*/
	"colorScheme": "rainbow", /*predefined colorsceme in 'colorschemes.json' (ignored if 'colors' or 'colorMap' is not null):
                                    "rainbow" (default), used if there is no colorscheme in a style)
                                    "rainbow2"
                                    "bluebird"
                                    "bw"
                                    "wb"
                                    "redish"
                                    "greenish"
                                    "blueish"*/
	"colors": ["#5E6472FF", "#AED9E0FF", "#B3E6E3FF", "#B8F2E6FF", "#FAF3DDFF", "#FFA69EFF"], // legend's linear colorscheme. Ignored if 'colorMap' is not null)
	"colorMap": [ // array of levels and corresponding colors. Non-linear representation of a colorscheme
		[0, "#323200ff"], // level value (in style's units), color
		[16, "#ffff00ff"],[20, "#ffff00ff"],[20, "#0032a0ff"],[30, "#0050ffff"],[30, "#006496ff"],[40, "#00ffffff"],...
	],
	"units": "speedOfLight", // representation of the layer's data (data is converted if necessary)
	"extraUnits": {"speedOfLight": ["m/s", 299792458, 0]} // append default unit converter system with new units: "speedOfLight" = "m/s" * 299792458 + 0;
}
```

## Colors defined as a string (web format)

The basic information could be found here: https://en.wikipedia.org/wiki/Web_colors#Hex_triplet
In addition to 'standard' triplets, in 'wxtile-js' lib four bytes could be used to represent RGBA (transparancy).
Color defenition is "case insensitive".

#ffd700 = #FFD700 = #FFD700FF (opaque, "case insensitive")
#FFD7007F (semi transparent)

#f6e = #ff66EE = #ff66eeff (opaque)
#0aF = #00AAff = #00AAFFFF (opaque)

# Color schemes

colorschemes.json

```js
{
    "rainbow": [     // Name of a colorscheme
        "#ff0000ff", // string representation of RGBA color,
        "#ffff00ff",
        "#00ff00ff",
        "#00ffffff",
        "#0000ffff",
        "#ff00ffff"
    ],
    ...
}
```

# Units convertion

Units converter works ONLY with units from this file.
It considers "m/s" and "m s\*\*-1" as different units.
NOTE!!! Units in the first column are taken from dataset data files.
NOTE!!! Units int the `uconv.json` are case-sensitive.

## Example:

Base units for "knot" is "m/s",
Base units for "km/h" is "m/s", so "knot" and "km/h" are convertible.
Convertion is always two-staged, forward - units-1 to its base units, backward - from base units to units-2.
to convert 5 "knot" to "km/h":

```
    "knot":             ["m/s", 0.514444],
    "km/h":             ["m/s", 0.27777777777],

```

1. 5 knot = 5 \* 0.514444 = 2,57222 m/s -- forward
2. 2,57222 / 0.277777777 = 9.26 km/h -- backward

## 'uconv.json' example

```json
{
	"K": ["K", 1],
	"F": ["K", 0.5555555555, 255.372222222],
	"C": ["K", 1, 273.15],
	"degC": ["K", 1, 273.15],
	"kg/m^2/s": ["kg/m^2/s", 1],
	"Kg m**-2 s**-1": ["kg/m^2/s", 1],
	"W/m^2": ["W/m^2", 1],
	"W m**2": ["W/m^2", 1],
	"m/s": ["m/s", 1],
	"m s**-1": ["m/s", 1],
	"knot": ["m/s", 0.514444],
	"km/h": ["m/s", 0.27777777777],
	"s": ["s", 1],
	"sec": ["s", 1],
	"h": ["s", 3600],
	"min": ["s", 60],
	"m": ["m", 1],
	"cm": ["m", 0.01],
	"inch": ["m", 0.0254]
}
```

# ToDos:

1. animated `degrees` like wave direction (minor)

# browsers compatibility

See https://leafletjs.com/ section 'Browser Support'
In addition, if 'webp' as compression format is used see compatibility: https://caniuse.com/webp
