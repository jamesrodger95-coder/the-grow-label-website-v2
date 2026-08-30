import { chromium } from '@playwright/test';

/**
 * Screenshot helper.
 *
 * Scrolls the whole page first so IntersectionObserver-driven reveals have
 * fired, then returns to the top before capturing. Without this, a full-page
 * capture shows every below-the-fold section in its pre-reveal state.
 */
const [, , url, out, w = '1440', h = '1000', full = '1', reduced = '0'] = process.argv;

const b = await chromium.launch();
const ctx = await b.newContext({
  viewport: { width: +w, height: +h },
  deviceScaleFactor: 1,
  reducedMotion: reduced === '1' ? 'reduce' : 'no-preference',
  hasTouch: +w <= 820,
  isMobile: false,
});
const p = await ctx.newPage();
const errs = [];
const failed = [];
p.on('console', (m) => {
  if (m.type() === 'error') errs.push(m.text());
});
p.on('pageerror', (e) => errs.push('PAGEERROR: ' + e.message));
p.on('response', (r) => {
  if (r.status() >= 400) failed.push(`${r.status()} ${r.url()}`);
});

await p.goto(url, { waitUntil: 'load', timeout: 90000 });
await p.waitForTimeout(600);

// Walk the page so reveals fire, then settle back at the top.
const height = await p.evaluate(() => document.documentElement.scrollHeight);
const step = Math.round(+h * 0.7);
for (let y = 0; y < height; y += step) {
  await p.evaluate((v) => window.scrollTo(0, v), y);
  await p.waitForTimeout(120);
}
await p.evaluate(() => window.scrollTo(0, 0));
await p.waitForTimeout(900);

await p.screenshot({ path: out, fullPage: full === '1' });

if (errs.length) console.log('CONSOLE ERRORS:\n' + errs.join('\n'));
if (failed.length) console.log('FAILED REQUESTS:\n' + [...new Set(failed)].join('\n'));
console.log('saved', out);
await b.close();
