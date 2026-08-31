import { chromium, webkit } from '@playwright/test';

/**
 * Client-side navigation, then scroll. The combination that broke.
 *
 * A crawl that loads each URL directly cannot catch this: the root layout is
 * remounted on a hard load, so the observers re-register and everything works.
 * Only clicking a link exercises the case where the layout persists.
 */
const BASE = process.env.BASE_URL ?? 'http://127.0.0.1:3112';
const problems = [];

for (const [engine, launch] of [
  ['chrome', chromium],
  ['safari', webkit],
]) {
  const browser = await launch.launch();
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  await context.route('**/*', async (route) => {
    const response = await route.fetch();
    const headers = { ...response.headers() };
    for (const k of Object.keys(headers)) {
      if (k.toLowerCase() === 'content-security-policy') {
        headers[k] = headers[k]
          .split(';')
          .filter((d) => !/upgrade-insecure-requests/i.test(d))
          .join(';');
      }
    }
    await route.fulfill({ response, headers });
  });
  const page = await context.newPage();
  await page.goto(`${BASE}/`, { waitUntil: 'load' });
  await page.addStyleTag({ content: 'html{scroll-behavior:auto !important}' });
  await page.waitForTimeout(900);

  const hops = ['Platform', 'Modules', 'Veterinary', 'Dental', 'About', 'Results'];
  for (const name of hops) {
    const link = page.locator(`.nav__link:text-is("${name}")`);
    if (!(await link.count())) continue;
    await link.first().click();
    await page.waitForTimeout(900);

    // Scroll the whole page after the soft navigation.
    for (let i = 0; i < 90; i += 1) {
      await page.mouse.wheel(0, 200);
      await page.waitForTimeout(25);
    }
    await page.waitForTimeout(900);

    const s = await page.evaluate(() => {
      const rev = [...document.querySelectorAll('[data-reveal]')];
      const hidden = rev.filter((e) => parseFloat(getComputedStyle(e).opacity) < 0.9);
      return { path: location.pathname, total: rev.length, hidden: hidden.length };
    });
    if (s.hidden > 0) {
      problems.push(
        `${engine} ${s.path}: ${s.hidden}/${s.total} still hidden after soft nav + scroll`
      );
    }
    console.log(
      `${engine.padEnd(7)} click ${name.padEnd(11)} -> ${s.path.padEnd(24)} hidden after scroll: ${s.hidden}/${s.total}`
    );
  }

  // The module switcher navigates with scroll={false}; check that too.
  await page.goto(`${BASE}/modules/answer`, { waitUntil: 'load' });
  await page.waitForTimeout(700);
  for (const m of ['Respond', 'Retain', 'Reactivate']) {
    const chip = page.locator(`.mswitch__item:has-text("${m}")`);
    if (!(await chip.count())) continue;
    await chip.first().click();
    await page.waitForTimeout(1100);
    const s = await page.evaluate(() => {
      const rev = [...document.querySelectorAll('[data-reveal]')];
      const onScreenHidden = rev.filter((e) => {
        const r = e.getBoundingClientRect();
        return (
          r.top < window.innerHeight &&
          r.bottom > 0 &&
          parseFloat(getComputedStyle(e).opacity) < 0.9
        );
      });
      return { path: location.pathname, bad: onScreenHidden.length };
    });
    if (s.bad > 0) problems.push(`${engine} switcher ${s.path}: ${s.bad} hidden on screen`);
    console.log(
      `${engine.padEnd(7)} switch ${m.padEnd(11)} -> ${s.path.padEnd(24)} hidden on screen: ${s.bad}`
    );
  }

  await browser.close();
}

if (problems.length) {
  console.log('\nPROBLEMS');
  for (const p of problems) console.log('  ' + p);
  process.exitCode = 1;
} else {
  console.log('\nno hidden content after client-side navigation, in Chrome or Safari');
}
