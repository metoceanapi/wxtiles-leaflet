const esbuild = require('esbuild');
const express = require('express');

esbuild
	.build({
		entryPoints: ['src_example/index.ts'],
		bundle: true,
		plugins: [],
		loader: {
			'.png': 'base64',
			'.woff': 'base64',
		},
		target: ['es2020', 'chrome80', 'safari13', 'edge89', 'firefox70'],
		format: 'iife',
		outfile: 'public/script/script.js',
		sourcemap: true,
		minify: false,
		watch: {
			onRebuild(error, result) {
				if (error) {
					console.error('watch build failed:', error);
				} else {
					console.log('rebuilded', new Date());
				}
			},
		},
	})
	.then((result) => {
		const app = express();
		app.use(express.static('public'));

		const PORT = 3002;

		const url = `http://localhost:${PORT}`;
		app.listen(PORT, () => {
			console.log(`Dev is running at ${url}`);
		});
	})
	.catch((e) => console.error(e.message));
