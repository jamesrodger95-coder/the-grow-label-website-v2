import { chromium, webkit } from '@playwright/test';
import { mkdirSync } from 'node:fs';

/**
 * Chrome and Safari, on the three routes that carry the scroll-linked work.
 *
 * Safari is the usual failure point for exactly two things this site depends
 * on, so both are asserted rather than eyeballed:
 *
 *   backdrop-filter   the nav bar is a translucent pill over the page
 *   scroll-linked     the scenes read their own rect in a rAF loop; WebKit
 *                     has historically been the engine where a sticky
 *                     ancestor or a compositing quirk leaves that stuck
 *
 * It also checks `contain: paint`, which is what fixed the value-stages
 * repaint, and confirms every scene actually reaches its settled state.
 */
// 127.0.0.1, not localhost: WebKit upgrades http://localhost to https and
// every subresource then fails with an SSL error, so the page renders with no
// CSS and no JavaScript and every check reports a false failure.
const BASE = process.env.BASE_URL ?? 'http://127.0.0.1:3112';
const ROUTES = ['/', '/modules', '/modules/answer'];
const OUT = 'artifacts/crossbrowser';
mkdirSync(OUT, { recursive: true });

const problems = [];

for (const [name, engine] of [
  ['chrome', chromium],
  ['safari', webkit],
]) {
  const browser = await engine.launch();
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });

  /**
   * Strip `upgrade-insecure-requests` from the site's CSP for this run only.
   *
   * It is a correct header in production, where the site is served over HTTPS.
   * Over plain HTTP it is a problem for one engine: Chrome exempts localhost
   * from the directive, WebKit does not, so Safari upgrades every subresource
   * to https, every one fails, and the page renders with no CSS and no
   * JavaScript. Left in place, this run reported four broken bar fills and 28
   * console errors that do not exist on the real site.
   *
   * Rewriting the header here tests the real build rather than weakening a
   * production security header to suit a local test.
   */
  await context.route('**/*', async (route) => {
    const response = await route.fetch();
    const headers = { ...response.headers() };
    for (const key of Object.keys(headers)) {
      if (key.toLowerCase() === 'content-security-policy') {
        headers[key] = headers[key]
          .split(';')
          .filter((d) => !/upgrade-insecure-requests/i.test(d))
          .join(';');
      }
    }
    await route.fulfill({ response, headers });
  });

  const page = await context.newPage();

  const consoleErrors = [];
  page.on('console', (m) => {
    if (m.type() === 'error') consoleErrors.push(m.text());
  });
  page.on('pageerror', (e) => consoleErrors.push(String(e)));

  for (const route of ROUTES) {
    await page.goto(`${BASE}${route}`, { waitUntil: 'load' });
    await page.waitForTimeout(500);

    // Feature support the design actually leans on.
    const support = await page.evaluate(() => ({
      backdrop:
        CSS.supports('backdrop-filter', 'blur(4px)') ||
        CSS.supports('-webkit-backdrop-filter', 'blur(4px)'),
      contain: CSS.supports('contain', 'paint'),
      subgrid: CSS.supports('grid-template-rows', 'subgrid'),
      clamp: CSS.supports('width', 'clamp(1px, 2vw, 3px)'),
    }));
    for (const [k, v] of Object.entries(support)) {
      if (!v) problems.push(`${name} ${route}: no support for ${k}`);
    }

    // Scroll the whole page so every scene runs, then check they settled.
    await page.addStyleTag({ content: 'html{scroll-behavior:auto !important}' });
    await page.evaluate(async () => {
      const step = window.innerHeight * 0.6;
      for (let y = 0; y < document.body.scrollHeight; y += step) {
        window.scrollTo({ top: y, behavior: 'instant' });
        await new Promise((r) => setTimeout(r, 60));
      }
    });
    await page.waitForTimeout(400);

    const state = await page.evaluate(() => {
      const out = {};
      // Reveals must all have fired.
      const reveals = [...document.querySelectorAll('.m-rise, .m-card, .m-wipe')];
      out.revealsHidden = reveals.filter(
        (el) => parseFloat(getComputedStyle(el).opacity) < 0.9
      ).length;
      out.revealTotal = reveals.length;
      // Scene marks must have been written to by the rAF loop.
      const marks = [...document.querySelectorAll('.seqart__mark')];
      out.sceneWritten = marks.filter((m) => m.style.transform !== '').length;
      out.sceneTotal = marks.length;
      // Bar fills must have real width.
      const bars = [...document.querySelectorAll('.result__barfill')];
      out.zeroBars = bars.filter((b) => b.getBoundingClientRect().width < 2).length;
      return out;
    });

    if (state.revealsHidden > 0) {
      problems.push(
        `${name} ${route}: ${state.revealsHidden}/${state.revealTotal} reveals never became visible`
      );
    }
    if (state.sceneTotal > 0 && state.sceneWritten === 0) {
      problems.push(`${name} ${route}: the scroll-linked scene never ran`);
    }
    if (state.zeroBars > 0) {
      problems.push(`${name} ${route}: ${state.zeroBars} bar fills at zero width`);
    }

    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(300);
    await page.screenshot({
      path: `${OUT}/${name}${route.replace(/\//g, '_') || '_home'}.png`,
    });
  }

  if (consoleErrors.length) {
    problems.push(`${name}: ${consoleErrors.length} console errors :: ${consoleErrors[0]}`);
  }

  await browser.close();
  console.log(`${name} done`);
}

if (problems.length) {
  console.log('\nCROSS-BROWSER PROBLEMS');
  for (const p of problems) console.log(`  ${p}`);
  process.exitCode = 1;
} else {
  console.log(`\nno cross-browser problems across ${ROUTES.length} routes in Chrome and Safari`);
}
