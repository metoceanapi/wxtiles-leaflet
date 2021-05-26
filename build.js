const esbuild = require('esbuild');
const sassPlugin = require('esbuild-plugin-sass');

const sharedConfig = {
	entryPoints: ['src/index.ts'],
	bundle: true,
	plugins: [sassPlugin()],
	loader: {
		'.woff': 'dataurl',
	},
	target: 'es6',
	minify: true,
};

// BUILD as ESModules
esbuild
	.build({
		...sharedConfig,
		format: 'esm',
		outfile: 'dist/es/bundle.js',
	})
	.catch((e) => console.error(e.message));

// build for web
esbuild
	.build({
		...sharedConfig,
		format: 'iife',
		outfile: 'dist/web/wxtile.js',
		globalName: 'wxtilejs',
	})
	.catch((e) => console.error(e.message));
