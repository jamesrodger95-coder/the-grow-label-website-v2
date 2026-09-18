import { chromium } from '@playwright/test';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join, resolve } from 'node:path';

/**
 * Rasterises a generated PDF, one PNG per page.
 *
 * The report is a sales asset, so it needs reviewing the same way a page does —
 * by looking at it. Chromium's own PDF viewer cannot be screenshotted, so
 * pdf.js is injected into a blank page and each page is drawn to a canvas and
 * pulled back out.
 *
 *   node scripts/pdf-shots.mjs artifacts/calculator/desktop/report.pdf artifacts/calculator/pdf
 */
const [, , input, outDir = 'artifacts/calculator/pdf', scale = '1.6'] = process.argv;
if (!input) throw new Error('usage: node scripts/pdf-shots.mjs <file.pdf> [outDir] [scale]');

const require = createRequire(import.meta.url);
const pdfjs = readFileSync(require.resolve('pdfjs-dist/build/pdf.min.mjs'), 'utf8');
const worker = readFileSync(require.resolve('pdfjs-dist/build/pdf.worker.min.mjs'), 'utf8');
const bytes = readFileSync(resolve(input));

mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1000, height: 1400 } });
await page.setContent('<body style="margin:0"></body>');

await page.addScriptTag({ content: `${pdfjs}\nwindow.pdfjsLib = pdfjsLib;`, type: 'module' });
await page.evaluate(
  ([workerSource]) => {
    const blob = new Blob([workerSource], { type: 'text/javascript' });
    window.pdfjsLib.GlobalWorkerOptions.workerSrc = URL.createObjectURL(blob);
  },
  [worker]
);

const pages = await page.evaluate(
  async ([data, zoom]) => {
    const doc = await window.pdfjsLib.getDocument({ data: new Uint8Array(data) }).promise;
    const out = [];
    for (let i = 1; i <= doc.numPages; i += 1) {
      const pdfPage = await doc.getPage(i);
      const viewport = pdfPage.getViewport({ scale: zoom });
      const canvas = document.createElement('canvas');
      canvas.width = Math.ceil(viewport.width);
      canvas.height = Math.ceil(viewport.height);
      await pdfPage.render({ canvasContext: canvas.getContext('2d'), viewport }).promise;
      out.push(canvas.toDataURL('image/png'));
    }
    return out;
  },
  [[...bytes], Number(scale)]
);

pages.forEach((dataUrl, i) => {
  const file = join(outDir, `page-${String(i + 1).padStart(2, '0')}.png`);
  writeFileSync(file, Buffer.from(dataUrl.split(',')[1], 'base64'));
});

await browser.close();
console.log(`wrote ${pages.length} pages to ${outDir}`);
