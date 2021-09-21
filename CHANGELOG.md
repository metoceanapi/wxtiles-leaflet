# Changelog

All notable changes to this project will be documented in this file. This should be updated in each individual branch as checked as part of the PR to ensure that it is kept up to date.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

Write your changes below this section. `npm version [major|minor|patch]` will automatically update changelog

## [Unreleased]

### fixed

- npm publish cleanup
- esbuild with external leaflet

## [1.0.6] - 2021-09-17

### added

- updated dependencies and npn to 7.24.0
- updated fonts
- extended meta and boundaries check

## [1.0.5] - 2021-05-26

### added

- scss -> css
- woff->src: url(data:font/woff;base64
- moved to @metoceanapi/wxtiles-leaflet, so it's public now
- 'vectorType' can contain font size, either 'vectorType':'barbs' or 'vectorType':'45px barbs'
- coarse level in demo
- refurbishe vector field animation
- type LibSetupObject export

### fixed

- uconv.json - proper type for 'comments'

## [1.0.4] - 2021-05-26

### added

- types export

## [1.0.3] - 2021-05-26

### added

- bundling fonts rewived
- ColorStyles separated into ColorStylesStrict and ColorStylesWeakMixed

## [1.0.2] - 2021-05-24

### added

- bundling fonts rewived

## [1.0.1] - 2021-05-24

### added

- bundling fonts

## [1.0.0] - 2021-05-24

### Fixed

- variablesMeta[v].minmax -> [variablesMeta[v].min, variablesMeta[v].max]
- JS camelCase in json-files provided by Wxtile-splitter
- fixed: minmax for Nz Radar data etc.
- code cleanup
- some internal renamings
- streamLineColor 'none'
- colors.length === 1 is ok now

### added

- style.isolineText: bool

## [0.8.1] - 2021-03-26

### Fixed

- fixed typo: promice -> promise

## [0.7.5] - 2021-03-26

### Changed

- move away from webpack in favor of es-build
- rename global library name from `wxtile-js` to `wxtilejs`. (esbuild does not support dash in library name, also it's standard that library global name consists of characters only)
- remove WxGetInternalLeafletCopy, because leaflet is not external dependency

## [0.7.5] - 2021-03-24

### added

- instance.json -> instances.json
- +meta.VariablesMeta

## [0.7.4] - 2021-03-23

### added

- getSetupCompletePromise

## [0.7.3] - 2021-03-22

### added

- streamLineStatic

## [0.7.2] - 2021-03-19

## Added

- new demo
- set\unsetTimeAnimationMode - in order to load less detailed data during animation

## [0.7.1] - 2021-03-03

## Fixed

- checkStreamlines in setStyle

## [0.7.0] - 2021-02-24

## Added

- clut.ticks

## [0.6.6] - 2021-02-24

## Fixed

- numToString
- styles

## [0.6.5] - 2021-02-23

## [0.6.4] - 2021-02-23

## Fixed

- createImageBitmap polyfill

## [0.6.3] - 2021-02-23

## Fixed

- more digits in inStyleUnits

## [0.6.2] - 2021-02-22

### Fixed

- beter loading layer error handling

## [0.6.1] - 2021-02-19

### Added

- integarated fonts: woff

### Fixed

- sorce code review

## [0.6.0] - 2021-02-15

### Fixed

- blur changing from 0 is now treated beter (oldRadius !== undefined)

### Added

- vera.ttf is removed and changed to the default font.
- units converter's trivial check
- units, styles, colorschemes are internal objects now
- WxTileLibSetup is NOT async (fonts' readiness should be checked manually)

## [0.5.6] - 2021-02-12

### Fixed

- No data - transparent!

## [0.5.5] - 2021-02-12

### Fixed

- streamLineColor = 'none'

## [0.5.4] - 2021-02-11

### Fixed

- streamLineSpeedFactor
- minmax setup for vector fields

## [0.5.3] - 2021-02-05

### Fixed

- styles+

## [0.5.2] - 2021-02-05

### Fixed

- WxGetInternalLeafletCopy

## [0.5.1] - 2021-02-04

### Fixed

- 'dataSet' renamed to 'dataSource'
- Defaults for ClassTileLayer.initialize({ dataSource, options = {}, lazy = true })
- bugfix: last isoline

## [0.5.0] - 2021-02-03

### Added

- WxTileGroupLayer
- setStyle and setTime logging

### Fixed

- drawVector colorisation bugfix

## [0.4.1] - 2021-02-03

### Fixed

- style levels sorting bugfix
- legend last color bugfix

## [0.4.0] - 2021-02-02

### Added

- Clut creation rebuilded
- Legend

### Fixed

- some defaults

## [0.3.2] - 2021-01-28

### Fixed

- custom style inheritance and missed fields recovery

## [0.3.1] - 2021-01-27

### Fixed

- custom style force setup

## [0.3.0] - 2021-01-26

## [0.2.0] - 2021-01-26

### Fixed

- css cleanup

### Added

- setters/getters
- layer.getLegendData()
- WxGetColorStyles - exported

## [0.1.2] - 2021-01-21

### Fixed

- use UMD build as the package entrypoint

## [0.1.1] - 2021-01-20

### Fixed

- Fix entrypoint

## [0.1.0] - 2021-01-20

### Added

- Initial release of the package
