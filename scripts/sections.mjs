import { chromium } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Viewport-sized captures at successive scroll positions. More faithful than
 * slicing a full-page image because sticky and scroll-driven states render as
 * a reader actually sees them.
 */
const BASE = process.env.BASE_URL ?? 'http://localhost:3112';
const [, , path = '/', width = '1440', height = '1000', outDir = 'artifacts/review'] = process.argv;

mkdirSync(outDir, { recursive: true });
const b = await chromium.launch();
const p = await b.newPage({
  viewport: { width: +width, height: +height },
  hasTouch: +width <= 820,
});
await p.goto(BASE + path, { waitUntil: 'load' });
await p.waitForTimeout(700);

const docHeight = await p.evaluate(() => document.documentElement.scrollHeight);
const stem = path === '/' ? 'home' : path.replace(/^\//, '').replace(/\//g, '-');
const step = Math.round(+height * 0.92);
const frames = Math.ceil(docHeight / step);

for (let i = 0; i < frames; i++) {
  await p.evaluate((y) => window.scrollTo(0, y), i * step);
  await p.waitForTimeout(950);
  await p.screenshot({ path: join(outDir, `${stem}-${String(i).padStart(2, '0')}.png`) });
}
console.log(`${stem}: ${frames} frames at ${width}x${height}`);
await b.close();
