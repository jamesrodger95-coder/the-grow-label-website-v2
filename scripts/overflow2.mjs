import { chromium } from '@playwright/test';
const BASE = process.env.BASE_URL ?? 'http://localhost:3111';
const [, , path = '/', width = '360', height = '800'] = process.argv;
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: +width, height: +height }, hasTouch: true });
await p.goto(BASE + path, { waitUntil: 'load' });
await p.waitForTimeout(700);
const rows = await p.evaluate(() => {
  const out = [];
  const all = [document.documentElement, document.body, ...document.body.querySelectorAll('*')];
  for (const el of all) {
    if (el.scrollWidth > el.clientWidth + 1 && el.clientWidth > 0) {
      const cs = getComputedStyle(el);
      const cls = typeof el.className === 'string' ? el.className.trim() : '';
      out.push(
        `${el.tagName.toLowerCase()}.${cls.slice(0, 60)} scrollW=${el.scrollWidth} clientW=${el.clientWidth} ovx=${cs.overflowX} disp=${cs.display} :: "${(el.textContent || '').trim().slice(0, 50)}"`
      );
    }
  }
  return out;
});
console.log(rows.join('\n') || 'none');
await b.close();
