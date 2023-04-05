import L from 'leaflet';
import { WxTileSource } from './wxsource';

/**
 * Framework dependent source type to be inherited by the framework dependent custom source type.
 * Mapbox does not provide a parent type for the custom source.
 * Leaflet provides a parent type for the custom layer to inherit from L.GridLayer.
 * Used as universal type for the custom source parent class. see {@link WxTileSource}
 */
export class FrameworkParentClass extends L.GridLayer {
	id: string;
	constructor(options: FrameworkOptions) {
		super(options);
		this.id = options.id;
	}
} // Leaflet

/**
 * Framework's basic options to construct the layer.
 * @example
 * ```ts
 * 	const leafletOptions: FrameworkOptions = { opacity: 1, attribution: 'WxTiles' };
 * ```
 */
export interface FrameworkOptions extends L.GridLayerOptions {
	id: string;
} // Leaflet
