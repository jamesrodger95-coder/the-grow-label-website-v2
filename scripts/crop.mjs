// Crop a PNG into vertical slices so large full-page screenshots stay readable.
import { chromium } from '@playwright/test';
import { readFileSync, writeFileSync } from 'node:fs';
import { basename, dirname, join } from 'node:path';

const [, , src, sliceH = '1400', maxSlices = '8'] = process.argv;
const buf = readFileSync(src);
const b64 = buf.toString('base64');
const b = await chromium.launch();
const p = await b.newPage();
await p.setContent(
  `<img id="i" src="data:image/png;base64,${b64}" style="display:block">`
);
await p.waitForFunction(() => {
  const i = document.getElementById('i');
  return i && i.complete && i.naturalWidth > 0;
});
const { w, h } = await p.evaluate(() => {
  const i = document.getElementById('i');
  return { w: i.naturalWidth, h: i.naturalHeight };
});
const sh = +sliceH;
const n = Math.min(+maxSlices, Math.ceil(h / sh));
const stem = basename(src, '.png');
const dir = dirname(src);
const out = [];
for (let k = 0; k < n; k++) {
  const y = k * sh;
  const hh = Math.min(sh, h - y);
  const buf2 = await p.locator('#i').screenshot({ clip: { x: 0, y, width: w, height: hh } });
  const f = join(dir, `${stem}--${String(k).padStart(2, '0')}.png`);
  writeFileSync(f, buf2);
  out.push(f);
}
console.log(out.join('\n'));
await b.close();
