// Render several QC stills from an existing bundle with ONE browser instance, then tile them.
// Usage: node tools/stills_fast.mjs <bundleDir> <composition> <name> f1 f2 ...
import {renderStill, selectComposition, openBrowser} from '@remotion/renderer';
import path from 'node:path';
import fs from 'node:fs';
const [bundle, comp, name, ...frames] = process.argv.slice(2);
const serveUrl = path.resolve(bundle);
fs.mkdirSync('out/stills', {recursive: true});
const browser = await openBrowser('chrome');
const composition = await selectComposition({serveUrl, id: comp, puppeteerInstance: browser, inputProps: {withNarration: false}});
for (const fr of frames) {
	const out = `out/stills/${name}_${fr}.png`;
	await renderStill({composition, serveUrl, output: out, frame: Number(fr), puppeteerInstance: browser, inputProps: {withNarration: false}, overwrite: true});
	process.stdout.write(fr + ' ');
}
await browser.close({silent: true});
console.log('done');
