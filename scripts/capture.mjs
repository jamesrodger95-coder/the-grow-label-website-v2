import { chromium } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Route x breakpoint capture harness.
 *
 * Scrolls each page so IntersectionObserver reveals fire, then captures a
 * full-page screenshot and reports console errors, failed requests, horizontal
 * overflow and any element that overflows the viewport width.
 */

const BASE = process.env.BASE_URL ?? 'http://localhost:3112';
const OUT = process.env.OUT_DIR ?? 'artifacts/final-screenshots';

export const ROUTES = [
  ['home', '/'],
  ['platform', '/platform'],
  ['modules-answer', '/modules/answer'],
  ['modules-respond', '/modules/respond'],
  ['modules-retain', '/modules/retain'],
  ['modules-reactivate', '/modules/reactivate'],
  ['industries-veterinary', '/industries/veterinary'],
  ['industries-dental', '/industries/dental'],
  ['methodology', '/methodology'],
  ['about', '/about'],
  ['insights', '/insights'],
  ['insights-entry', '/insights/why-one-revenue-number-is-not-enough'],
  ['contact', '/contact'],
  ['privacy', '/privacy'],
  ['terms', '/terms'],
  ['dev-styleguide', '/dev/styleguide'],
  ['dev-motion-lab', '/dev/motion-lab'],
  ['not-found', '/this-route-does-not-exist'],
];

export const VIEWPORTS = [
  ['1440x1000', 1440, 1000],
  ['1024x900', 1024, 900],
  ['768x1024', 768, 1024],
  ['390x844', 390, 844],
  ['360x800', 360, 800],
];

const only = process.argv[2];
const viewportFilter = process.argv[3];

const routes = only ? ROUTES.filter(([name]) => name === only || name.startsWith(only)) : ROUTES;
const viewports = viewportFilter
  ? VIEWPORTS.filter(([name]) => name === viewportFilter)
  : VIEWPORTS;

const browser = await chromium.launch();
const problems = [];

for (const [vpName, width, height] of viewports) {
  const dir = join(OUT, vpName);
  mkdirSync(dir, { recursive: true });
  const context = await browser.newContext({
    viewport: { width, height },
    deviceScaleFactor: 1,
    hasTouch: width <= 820,
    isMobile: width <= 480,
  });

  for (const [name, path] of routes) {
    const page = await context.newPage();
    const errors = [];
    const failures = [];
    page.on('console', (m) => {
      if (m.type() !== 'error') return;
      // The 404 route legitimately returns 404, and the browser logs that.
      if (name === 'not-found' && /404/.test(m.text())) return;
      errors.push(m.text());
    });
    page.on('pageerror', (e) => errors.push(`PAGEERROR ${e.message}`));
    page.on('response', (r) => {
      // Prefetches of the intentionally-missing 404 route are expected.
      if (r.status() >= 400 && !r.url().includes('this-route-does-not-exist')) {
        failures.push(`${r.status()} ${r.url()}`);
      }
    });

    try {
      await page.goto(BASE + path, { waitUntil: 'load', timeout: 60000 });
      await page.waitForTimeout(500);

      const docHeight = await page.evaluate(() => document.documentElement.scrollHeight);
      const step = Math.round(height * 0.7);
      for (let y = 0; y < docHeight; y += step) {
        await page.evaluate((v) => window.scrollTo(0, v), y);
        await page.waitForTimeout(110);
      }
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(800);

      // Layout diagnostics.
      const diag = await page.evaluate(() => {
        const docEl = document.documentElement;
        const overflowX = docEl.scrollWidth > docEl.clientWidth + 1;
        const wide = [];
        for (const el of Array.from(document.body.querySelectorAll('*'))) {
          const r = el.getBoundingClientRect();
          if (r.width === 0 || r.height === 0) continue;
          if (r.right > docEl.clientWidth + 2 || r.left < -2) {
            const cls = typeof el.className === 'string' ? el.className : '';
            wide.push(
              `${el.tagName.toLowerCase()}${cls ? '.' + cls.split(' ').filter(Boolean).slice(0, 2).join('.') : ''} [${Math.round(r.left)}→${Math.round(r.right)}]`
            );
          }
          if (wide.length > 6) break;
        }
        const h1s = document.querySelectorAll('h1').length;
        const headings = Array.from(document.querySelectorAll('h1,h2,h3,h4,h5,h6')).map((h) =>
          Number(h.tagName.slice(1))
        );
        let skips = [];
        for (let i = 1; i < headings.length; i++) {
          const prev = headings[i - 1];
          const cur = headings[i];
          if (cur - prev > 1) skips.push(`h${prev}→h${cur}`);
        }
        return {
          overflowX,
          scrollWidth: docEl.scrollWidth,
          clientWidth: docEl.clientWidth,
          wide: wide.slice(0, 5),
          h1s,
          skips: skips.slice(0, 4),
          title: document.title,
        };
      });

      await page.screenshot({ path: join(dir, `${name}.png`), fullPage: true });

      const issues = [];
      if (diag.overflowX)
        issues.push(
          `H-OVERFLOW ${diag.scrollWidth}>${diag.clientWidth} :: ${diag.wide.join(' | ')}`
        );
      if (diag.h1s !== 1) issues.push(`H1-COUNT ${diag.h1s}`);
      if (diag.skips.length) issues.push(`HEADING-SKIP ${diag.skips.join(',')}`);
      if (errors.length) issues.push(`CONSOLE ${[...new Set(errors)].slice(0, 3).join(' | ')}`);
      if (failures.length) issues.push(`REQ ${[...new Set(failures)].slice(0, 3).join(' | ')}`);
      if (issues.length) problems.push(`[${vpName}] ${path}\n    ${issues.join('\n    ')}`);
    } catch (error) {
      problems.push(`[${vpName}] ${path}\n    FAILED ${error.message.split('\n')[0]}`);
    }
    await page.close();
  }
  await context.close();
  console.log(`captured ${vpName}`);
}

await browser.close();

if (problems.length) {
  console.log('\n=== ISSUES ===\n' + problems.join('\n'));
} else {
  console.log('\nNo issues detected.');
}
