import { chromium } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Walks the calculator end to end and captures every state.
 *
 * Nine question screens and the booking screen the funnel ends on, at one
 * viewport per run. The report is a team-side artefact now and is built by
 * `pnpm report`, not by anything the prospect touches.
 *
 * It reports what the capture harness reports — console errors, failed
 * requests and horizontal overflow — plus the one thing specific to this
 * funnel: whether a revenue figure leaked onto the completed screen.
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

// The lead posts as soon as the questions are finished, so this listens from
// the start rather than from the booking.
let posted = null;
page.on('request', (request) => {
  if (request.url().includes('/api/calculator/lead') && request.method() === 'POST') {
    posted = request.postDataJSON();
  }
});

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

// Walk the page down before the full-page capture, the way scripts/shot.mjs
// does. Entrances are marked by an IntersectionObserver, so a full-page
// screenshot of a page nobody scrolled shows every section below the fold at
// opacity 0 — which reads as a broken layout and is not one.
const pageHeight = await page.evaluate(() => document.documentElement.scrollHeight);
for (let y = 0; y < pageHeight; y += Math.round(+h * 0.7)) {
  await page.evaluate((to) => window.scrollTo(0, to), y);
  await page.waitForTimeout(120);
}
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(400);
await page.screenshot({ path: join(outDir, 'result-full.png'), fullPage: true });

const hours = await page.locator('.calc__hoursvalue').first().textContent();
const points = await page.locator('.calc__pointname').allTextContents();
const booking = await page
  .locator('.calembed')
  .count()
  .then((n) => n > 0);
const bookingControl = await page
  .getByRole('link', { name: /book the call|request a time/i })
  .count()
  .then((n) => n > 0);

// The calendar is the point of the screen, so the harness waits for it rather
// than screenshotting the top of the page and calling the flow verified. It
// reports what it found either way: "failed" is a real outcome on a network
// that blocks app.cal.com, and the fallback link is what covers it.
const mount = page.locator('#my-cal-inline-revenue-assessment');
let embed = 'absent';
if (await mount.count()) {
  await mount.scrollIntoViewIfNeeded();
  try {
    // Cal marks its wrapper `loading="done"` once the iframe has rendered.
    // Waiting on childElementCount instead catches the wrapper a second or two
    // earlier and screenshots a spinner, which is how a calendar that never
    // actually arrives gets recorded as working.
    await page.waitForFunction(
      () => {
        const el = document.querySelector('#my-cal-inline-revenue-assessment');
        return Boolean(el?.querySelector('cal-inline[loading="done"] iframe'));
      },
      undefined,
      { timeout: 25000 }
    );
  } catch {
    notes.push('the calendar did not finish loading inside 25s');
  }
  embed = (await mount.getAttribute('data-status')) ?? 'unknown';
  await page.waitForTimeout(1500);
  await mount.screenshot({ path: join(outDir, 'calendar.png') }).catch(() => {});
}

// The figure must not be anywhere in the completed screen's markup. This is
// the funnel's whole premise, so the harness checks it rather than trusting it.
const leaked = (await page.locator('main').innerHTML()).match(/\$\s?[\d,]+/g);
if (leaked) notes.push(`FIGURE LEAKED ON SCREEN: ${[...new Set(leaked)].join(', ')}`);
const over = await overflow();
if (over) notes.push(`result overflow: ${JSON.stringify(over)}`);

await page.waitForTimeout(500);
await page.screenshot({ path: join(outDir, 'booking.png'), fullPage: false });

const summary = {
  hours,
  points,
  booking,
  bookingControl,
  embed,
  postedAnswers: posted?.answers ?? null,
  errors,
  failed,
  notes,
};
writeFileSync(join(outDir, 'summary.json'), JSON.stringify(summary, null, 2));
console.log(JSON.stringify(summary, null, 2));

await browser.close();
