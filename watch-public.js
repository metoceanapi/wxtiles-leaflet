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
		outdir: 'public/wxtiles',

		sourcemap: true,
		watch: {
			onRebuild(error, result) {
				if (error) {
					console.error('watch build failed:', error);
				} else {
					console.log('rebuilded', new Date());
					// !disableHotReload && watchResponse && watchResponse.write('data: refresh\n\n');
				}
			},
		},
	})
	.then((result) => {
		const app = express();
		app.use(express.static('public'));

		const PORT = 3001;

		app.get('/watch', function (req, res) {
			res.writeHead(200, {
				'Content-Type': 'text/event-stream',
				'Cache-Control': 'no-cache',
				Connection: 'keep-alive',
			});
		});

		const url = `http://localhost:${PORT}`;
		app.listen(PORT, () => {
			console.log(`Dev is running at ${url}`);
		});
	})
	.catch((e) => console.error(e.message));
