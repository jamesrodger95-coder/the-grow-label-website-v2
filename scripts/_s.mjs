import { chromium } from '@playwright/test';
const [, , out, ...sels] = process.argv;
const b = await chromium.launch();
const p = await (await b.newContext({ viewport: { width: 1440, height: 1000 } })).newPage();
await p.goto('http://localhost:3112/', { waitUntil: 'load', timeout: 90000 });
const dh = await p.evaluate(() => document.documentElement.scrollHeight);
for (let y = 0; y < dh; y += 700) {
  await p.evaluate((v) => scrollTo(0, v), y);
  await p.waitForTimeout(100);
}
await p.evaluate(() => scrollTo(0, 0));
await p.waitForTimeout(500);
for (const s of sels) {
  const el = p.locator(s).first();
  try {
    await el.scrollIntoViewIfNeeded();
    await p.waitForTimeout(1000);
    await el.screenshot({ path: `${out}/x-${s.replace(/[^a-z0-9]/gi, '_')}.png` });
    console.log('ok', s);
  } catch (e) {
    console.log('FAIL', s, e.message);
  }
}
await b.close();
