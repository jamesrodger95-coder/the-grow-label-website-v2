import { chromium } from '@playwright/test';

/**
 * Verifies an interaction changes colour without changing layout.
 *
 * Records the element's box before and after, so a hover state that shifts the
 * page by a pixel fails here rather than in review.
 */
const BASE = process.env.BASE_URL ?? 'http://localhost:3112';
const [, , path = '/', selector = '.leak'] = process.argv;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
await page.goto(BASE + path, { waitUntil: 'load' });
await page.waitForTimeout(600);

const target = page.locator(selector).first();
await target.scrollIntoViewIfNeeded();
await page.waitForTimeout(400);

const read = async () => {
  const box = await target.boundingBox();
  return target
    .evaluate((el) => {
      const row = getComputedStyle(el);
      const pick = (sel) => {
        const child = el.querySelector(sel);
        return child ? getComputedStyle(child).color : null;
      };
      const rail = el.querySelector('.leak__rail');
      return {
        border: row.borderBottomColor,
        idx: pick('.leak__idx'),
        key: pick('.leak__key'),
        tag: pick('.leak__tag'),
        rail: rail ? getComputedStyle(rail, '::after').transform : null,
        arrow: el.querySelector('.leak__arrow')
          ? getComputedStyle(el.querySelector('.leak__arrow')).opacity
          : null,
      };
    })
    .then((styles) => ({ ...styles, box }));
};

const rest = await read();
await target.hover();
await page.waitForTimeout(500);
const hovered = await read();

await page.keyboard.press('Tab');
await target.focus();
await page.waitForTimeout(500);
const focused = await read();

const same = (a, b) =>
  a &&
  b &&
  Math.abs(a.x - b.x) < 0.5 &&
  Math.abs(a.y - b.y) < 0.5 &&
  Math.abs(a.width - b.width) < 0.5 &&
  Math.abs(a.height - b.height) < 0.5;

console.log('rest    ', JSON.stringify(rest, null, 0));
console.log('hover   ', JSON.stringify(hovered, null, 0));
console.log('focus   ', JSON.stringify(focused, null, 0));
console.log('');
console.log(
  'no layout shift on hover:',
  same(rest.box, hovered.box)
    ? 'yes'
    : 'NO — ' + JSON.stringify(rest.box) + ' -> ' + JSON.stringify(hovered.box)
);
console.log(
  'no layout shift on focus:',
  same(rest.box, focused.box)
    ? 'yes'
    : 'NO — ' + JSON.stringify(rest.box) + ' -> ' + JSON.stringify(focused.box)
);

await browser.close();
