import { expect, test, type Page } from '@playwright/test';

/**
 * The calculator journey.
 *
 * The arithmetic is covered by `tests/unit/calculator-model.test.ts`, which
 * asserts the worked example's figures literally. What is covered here is
 * everything the model cannot see: that the flow can be completed, that going
 * back does not lose an answer, that a refresh does not either, that the figure
 * arrives before anything is asked for, and that the keyboard can drive a radio
 * group whose pointer behaviour advances the screen.
 */

/** The brief's worked example. Values, not labels, so wording can change. */
const SAMPLE = [
  'dental',
  '4-7',
  '4000-10000',
  '240',
  '200-400',
  '4-6',
  'voicemail',
  'not-sure',
  'never',
] as const;

/** The rate limiter keys on the client IP; the API tests take their own. */
function bucket(name: string) {
  return { 'x-forwarded-for': `198.51.100.${name}` };
}

async function answer(page: Page, value: string) {
  if (value === '240') {
    await page.fill('input[name="weeklyAppointments"]', value);
    await page.click('.calc button[type="submit"]');
    return;
  }
  await page.locator(`.calc__radio[value="${value}"]`).click();
}

async function complete(page: Page) {
  for (const value of SAMPLE) await answer(page, value);
  await expect(page.locator('.calc__figure')).toBeVisible();
}

test.describe('the nine questions', () => {
  test('renders the first question without JavaScript having to run', async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto('/calculator');
    await expect(page.getByRole('heading', { name: /what kind of practice/i })).toBeVisible();
    // And the route out of it still works.
    await expect(page.getByRole('link', { name: /request an assessment/i }).first()).toBeVisible();
    await context.close();
  });

  test('completes, and shows the figure before asking for anything', async ({ page }) => {
    await page.goto('/calculator');
    await complete(page);

    // The email capture exists, but the figure is not behind it.
    await expect(page.locator('.calc__figure')).toHaveText(/^\$[\d,]+$/);
    await expect(page.locator('input[name="email"]')).toBeVisible();

    // Four module rows, each with a figure.
    await expect(page.locator('.calc-row')).toHaveCount(4);
    for (const text of await page.locator('.calc-row__value').allTextContents()) {
      expect(text).toMatch(/^\$[\d,]+$/);
    }
  });

  test('the headline is the low end and is stated as such', async ({ page }) => {
    await page.goto('/calculator');
    await complete(page);

    const headline = await page.locator('.calc__figure').innerText();
    const range = await page.locator('.calc__range').innerText();
    const toNumber = (value: string) => Number(value.replace(/[^\d]/g, ''));
    const upper = toNumber(range);

    expect(toNumber(headline)).toBeLessThan(upper);
    await expect(page.locator('.calc__resulthead')).toContainText(/at least/i);
    // Both figures are rounded down to a thousand; neither ends in stray digits.
    expect(toNumber(headline) % 1000).toBe(0);
    expect(upper % 1000).toBe(0);
  });

  test('back preserves the answer that was given', async ({ page }) => {
    await page.goto('/calculator');
    await answer(page, 'dental');
    await answer(page, '4-7');

    // Two answers leaves the third question open, so Back reaches the second.
    await page.getByRole('button', { name: /back/i }).click();
    await expect(page.locator('.calc__radio[value="4-7"]')).toBeChecked();

    await page.getByRole('button', { name: /back/i }).click();
    await expect(page.locator('.calc__radio[value="dental"]')).toBeChecked();
  });

  test('a refresh does not lose the answers', async ({ page }) => {
    await page.goto('/calculator');
    await answer(page, 'dental');
    await answer(page, '4-7');
    await answer(page, '4000-10000');

    await page.reload();
    // Back onto the question that was open, with the earlier answers intact.
    await page.getByRole('button', { name: /back/i }).click();
    await expect(page.locator('.calc__radio[value="4000-10000"]')).toBeChecked();
  });

  test('the appointment value opens on the band for the practice type', async ({ page }) => {
    await page.goto('/calculator');
    for (const value of ['dental', '4-7', '4000-10000', '240'] as const) {
      await answer(page, value);
    }
    await expect(page.locator('.calc__radio[value="200-400"]')).toBeChecked();
  });

  /**
   * The group advances on a pointer click and must not advance on an arrow
   * key, or the keyboard cannot move through the options at all. This is the
   * assertion that stops someone "simplifying" the handler back into onChange.
   */
  test('arrow keys move through the options without advancing the screen', async ({ page }) => {
    await page.goto('/calculator');
    await page.locator('.calc__radio[value="veterinary"]').focus();
    await page.keyboard.press('ArrowDown');

    await expect(page.locator('.calc__radio[value="dental"]')).toBeChecked();
    await expect(page.getByRole('heading', { name: /what kind of practice/i })).toBeVisible();

    // Enter submits the question, as it would in any form.
    await page.keyboard.press('Enter');
    await expect(page.getByRole('heading', { name: /how many locations/i })).toBeVisible();
  });

  test('the number question refuses to advance on nothing', async ({ page }) => {
    await page.goto('/calculator');
    for (const value of ['dental', '4-7', '4000-10000'] as const) await answer(page, value);

    await expect(page.locator('.calc button[type="submit"]')).toBeDisabled();
    await page.fill('input[name="weeklyAppointments"]', '240');
    await expect(page.locator('.calc button[type="submit"]')).toBeEnabled();
  });
});

test.describe('the lead endpoint', () => {
  test('reports its configuration honestly', async ({ request }) => {
    const res = await request.get('/api/calculator/lead');
    expect(res.status()).toBe(200);
    const body = (await res.json()) as { configured: boolean };
    expect(typeof body.configured).toBe('boolean');
  });

  test('never reports a capture it did not make', async ({ request }) => {
    const res = await request.post('/api/calculator/lead', {
      headers: bucket('21'),
      data: {
        email: 'owner@example.com',
        answers: {
          practice: 'dental',
          locations: '4-7',
          records: '4000-10000',
          weeklyAppointments: 240,
          value: '200-400',
          desk: '4-6',
          calls: 'voicemail',
          noShows: 'not-sure',
          campaign: 'never',
        },
      },
    });
    // 200 only where a destination is configured; otherwise it says so.
    expect([200, 429, 502, 503]).toContain(res.status());
    const body = (await res.json()) as { status: string };
    if (res.status() === 503) expect(body.status).toBe('unconfigured');
    if (res.status() === 200) expect(body.status).toBe('success');
  });

  test('rejects a filled honeypot and a malformed email', async ({ request }) => {
    const base = {
      email: 'owner@example.com',
      answers: {
        practice: 'dental',
        locations: '1',
        records: 'under-1500',
        weeklyAppointments: 40,
        value: '100-200',
        desk: '1',
        calls: 'not-sure',
        noShows: 'not-sure',
        campaign: 'never',
      },
    };

    const trapped = await request.post('/api/calculator/lead', {
      headers: bucket('22'),
      data: { ...base, website: 'http://spam.example' },
    });
    expect([400, 429]).toContain(trapped.status());

    const malformed = await request.post('/api/calculator/lead', {
      headers: bucket('23'),
      data: { ...base, email: 'nope' },
    });
    expect([400, 429]).toContain(malformed.status());
  });

  test('refuses an answer set that is not one the questions can produce', async ({ request }) => {
    const res = await request.post('/api/calculator/lead', {
      headers: bucket('24'),
      data: {
        email: 'owner@example.com',
        answers: {
          practice: 'dental',
          locations: '4-7',
          records: '4000-10000',
          // Not a band the form offers; the server recomputes from these, so
          // a payload edited in the console must not reach the model.
          weeklyAppointments: 9_000_000,
          value: '200-400',
          desk: '4-6',
          calls: 'voicemail',
          noShows: 'not-sure',
          campaign: 'never',
        },
      },
    });
    expect([400, 429]).toContain(res.status());
  });
});
