import { chromium } from '@playwright/test';
import { readFileSync, writeFileSync } from 'node:fs';

/**
 * Derives the logo variants the site needs from the single supplied PNG.
 *
 * `public/logo.png` is the artwork as delivered and is never modified. Two
 * files are generated from it:
 *
 *   logo-mark.png        trimmed to the ink, so the gap beside the wordmark is
 *                        controlled by CSS rather than by baked-in padding
 *   logo-mark-light.png  the same, with the near-black outline lifted to the
 *                        warm white so the mark survives the black footer
 *
 * Run this again if the source logo is replaced:
 *   node scripts/logo-variants.mjs
 */
const SOURCE = 'public/logo.png';

/** The outline colour in the supplied artwork, and what it becomes on dark. */
const OUTLINE = { r: 15, g: 30, b: 60 };
const OUTLINE_ON_DARK = { r: 251, g: 250, b: 248 };
const TOLERANCE = 70;

const b64 = readFileSync(SOURCE).toString('base64');
const browser = await chromium.launch();
const page = await browser.newPage();
await page.setContent(`<img id="src" src="data:image/png;base64,${b64}">`);
await page.waitForFunction(() => {
  const img = document.getElementById('src');
  return img && img.complete && img.naturalWidth > 0;
});

const variants = await page.evaluate(
  ({ outline, target, tolerance }) => {
    const img = document.getElementById('src');
    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);

    // Trim to the bounding box of anything that is not fully transparent.
    let minX = canvas.width;
    let minY = canvas.height;
    let maxX = 0;
    let maxY = 0;
    for (let y = 0; y < canvas.height; y += 1) {
      for (let x = 0; x < canvas.width; x += 1) {
        if (data[(y * canvas.width + x) * 4 + 3] > 8) {
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        }
      }
    }
    const w = maxX - minX + 1;
    const h = maxY - minY + 1;

    const trim = document.createElement('canvas');
    trim.width = w;
    trim.height = h;
    trim.getContext('2d').drawImage(canvas, minX, minY, w, h, 0, 0, w, h);
    const plain = trim.toDataURL('image/png');

    // The same crop, with the dark outline pixels moved to the light tone.
    const lightCtx = trim.getContext('2d');
    const px = lightCtx.getImageData(0, 0, w, h);
    for (let i = 0; i < px.data.length; i += 4) {
      if (px.data[i + 3] < 8) continue;
      const dr = px.data[i] - outline.r;
      const dg = px.data[i + 1] - outline.g;
      const db = px.data[i + 2] - outline.b;
      if (Math.sqrt(dr * dr + dg * dg + db * db) <= tolerance) {
        px.data[i] = target.r;
        px.data[i + 1] = target.g;
        px.data[i + 2] = target.b;
      }
    }
    lightCtx.putImageData(px, 0, 0);

    return { plain, light: trim.toDataURL('image/png'), width: w, height: h };
  },
  { outline: OUTLINE, target: OUTLINE_ON_DARK, tolerance: TOLERANCE }
);

const write = (dataUrl, path) => {
  writeFileSync(path, Buffer.from(dataUrl.split(',')[1], 'base64'));
  return path;
};

write(variants.plain, 'public/logo-mark.png');
write(variants.light, 'public/logo-mark-light.png');

console.log(`source      ${SOURCE}`);
console.log(`trimmed to  ${variants.width}x${variants.height}`);
console.log('wrote       public/logo-mark.png, public/logo-mark-light.png');

await browser.close();
