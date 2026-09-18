import { chromium } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Walks the calculator end to end and captures every state.
 *
 * Nine question screens, the result, and the generated PDF, at one viewport per
 * run. It also reports what the capture harness reports — console errors,
 * failed requests and horizontal overflow — because a flow that is only ever
 * screenshotted at rest hides the states that actually break.
 *
 *   node scripts/calculator-walk.mjs 3112 390 844 artifacts/calculator/mobile
 */
const [, , port = '3112', w = '1440', h = '1000', outDir = 'artifacts/calculator'] = process.argv;

/**
 * The brief's worked example: a four-location dental group, 6,000 records,
 * 240 appointments a week. Answers are given as option values rather than as
 * labels, so a wording change does not silently walk a different path.
 */
const ANSWERS = [
  'dental',
  '4-7',
  '4000-10000',
  '240',
  '200-400',
  '4-6',
  'voicemail',
  'not-sure',
  'never',
];

mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: +w, height: +h },
  deviceScaleFactor: 1,
  hasTouch: +w <= 820,
  acceptDownloads: true,
});
const page = await context.newPage();

const errors = [];
const failed = [];
page.on('console', (m) => {
  if (m.type() === 'error') errors.push(m.text());
});
page.on('pageerror', (e) => errors.push(`PAGEERROR: ${e.message}`));
page.on('response', (r) => {
  // The lead endpoint answers 503 with no CRM configured, which is the
  // behaviour under test rather than a failure.
  if (r.status() >= 400 && !r.url().includes('/api/calculator/lead')) {
    failed.push(`${r.status()} ${r.url()}`);
  }
});

async function overflow() {
  return page.evaluate(() => {
    const doc = document.documentElement;
    if (doc.scrollWidth <= doc.clientWidth) return null;
    const wide = [...document.querySelectorAll('*')]
      .filter((el) => el.getBoundingClientRect().right > doc.clientWidth + 1)
      .slice(0, 5)
      .map((el) => `${el.tagName.toLowerCase()}.${el.className}`.slice(0, 80));
    return { scrollWidth: doc.scrollWidth, clientWidth: doc.clientWidth, wide };
  });
}

const notes = [];

await page.goto(`http://localhost:${port}/calculator`, { waitUntil: 'load', timeout: 90000 });
await page.waitForTimeout(700);

for (let i = 0; i < ANSWERS.length; i += 1) {
  const label = ANSWERS[i];
  await page.waitForTimeout(420);
  const shot = join(outDir, `q${String(i + 1).padStart(2, '0')}.png`);
  await page.screenshot({ path: shot, fullPage: false });
  const over = await overflow();
  if (over) notes.push(`q${i + 1} overflow: ${JSON.stringify(over)}`);

  if (label === '240') {
    await page.fill('input[name="weeklyAppointments"]', '240');
    await page.click('button[type="submit"]');
  } else {
    const option = page.locator(`.calc__radio[value="${label}"]`);
    await option.evaluate((el) => el.scrollIntoView({ block: 'center' }));
    await page.waitForTimeout(150);
    // A real click rather than check(): the flow only advances on a pointer
    // event, which is what keeps arrow-key navigation usable in the group.
    await option.click();
  }
}

await page.waitForTimeout(900);
await page.screenshot({ path: join(outDir, 'result-top.png'), fullPage: false });
await page.screenshot({ path: join(outDir, 'result-full.png'), fullPage: true });

const headline = await page.locator('.calc__figure').first().textContent();
const range = await page.locator('.calc__range').first().textContent();
const hours = await page.locator('.calc__hoursvalue').first().textContent();
const rows = await page.locator('.calc-row__value').allTextContents();
const over = await overflow();
if (over) notes.push(`result overflow: ${JSON.stringify(over)}`);

// The report: fill the capture, submit, and keep the file.
await page.fill('input[name="email"]', 'owner@example.com');
await page.fill('input[name="practiceName"]', 'Northgate Dental Group');
const download = page.waitForEvent('download', { timeout: 60000 });
await page.click('.calc__reportform button[type="submit"]');
const file = await download;
const pdfPath = join(outDir, 'report.pdf');
await file.saveAs(pdfPath);

await page.waitForTimeout(500);
await page.screenshot({ path: join(outDir, 'result-after-download.png'), fullPage: false });

writeFileSync(
  join(outDir, 'summary.json'),
  JSON.stringify({ headline, range, hours, rows, errors, failed, notes, pdf: pdfPath }, null, 2)
);

console.log(JSON.stringify({ headline, range, hours, rows, errors, failed, notes }, null, 2));

await browser.close();
