const esbuild = require('esbuild');
const express = require('express');
const { externalGlobalPlugin } = require('esbuild-plugin-external-global');

const sharedConfig = {
	entryPoints: ['src/wxtiles.ts'],
	bundle: true,
	loader: {
		'.woff': 'base64',
	},
	plugins: [
		externalGlobalPlugin({
			leaflet: 'window.L',
		}),
	],
	target: ['es2020', 'chrome80', 'safari13', 'edge89', 'firefox70'],
	globalName: 'wxtilesjs',
	minify: true,
};

// build for web
esbuild
	.build({
		...sharedConfig,
		format: 'iife',
		// outdir: 'dist/web',
		outfile: 'dist/web/wxtiles.js',
	})
	.catch((e) => console.error(e.message));

// BUILD as ESModules
esbuild
	.build({
		...sharedConfig,
		format: 'esm',
		// outdir: 'dist/es',
		outfile: 'dist/es/wxtiles.js',
	})
	.catch((e) => console.error(e.message));
