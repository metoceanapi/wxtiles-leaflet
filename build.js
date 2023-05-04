const esbuild = require('esbuild');
const { externalGlobalPlugin } = require('esbuild-plugin-external-global');

const sharedConfig = {
	entryPoints: ['src/index.ts'],
	bundle: true,
	loader: {
		'.png': 'base64',
		'.woff': 'base64',
	},
	plugins: [externalGlobalPlugin({ leaflet: 'window.L' })],
	minify: true,
	// mangleProps: /.*/, // minify lib's names
};

// build for web
esbuild
	.build({
		...sharedConfig,
		globalName: 'wxtilesleaflet',
		format: 'iife',
		outfile: 'dist/web/index.js',
	})
	.catch((e) => console.error(e.message));

// BUILD as ESModules
esbuild
	.build({
		...sharedConfig,
		format: 'esm',
		outfile: 'dist/es/index.js',
	})
	.catch((e) => console.error(e.message));
