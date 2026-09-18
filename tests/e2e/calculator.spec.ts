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
  await expect(page.locator('.calembed')).toBeVisible();
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

  test('completes, and ends on the booking', async ({ page }) => {
    await page.goto('/calculator');
    await complete(page);

    await expect(page.getByRole('heading', { name: /book your call/i })).toBeVisible();
    await expect(page.locator('.calembed')).toBeVisible();
  });

  /**
   * The calendar leads the page once the questions are done.
   *
   * It used to sit under the copy and the module list, which put it below the
   * fold — and a calendar nobody scrolls to is, to the reader, a calendar that
   * did not load. Both halves are asserted: the hero goes, and the calendar is
   * above the box that explains it.
   */
  test('puts the calendar at the top, and takes the hero away', async ({ page }) => {
    await page.goto('/calculator');
    await expect(page.locator('.phead')).toBeVisible();

    await complete(page);

    // "Start with nine questions" is not true of anybody reading this screen.
    await expect(page.locator('.phead')).toBeHidden();

    const calendar = await page.locator('.calembed').boundingBox();
    const box = await page.locator('.calc__box').boundingBox();
    expect(calendar).not.toBeNull();
    expect(box).not.toBeNull();
    expect(calendar!.y).toBeLessThan(box!.y);

    // And it starts near the top of the document rather than a screen down.
    expect(calendar!.y).toBeLessThan(500);
  });

  /**
   * The point of the funnel. The figure is what the call is for, so a reader
   * who has finished the questions must not be able to read it off the page —
   * not in the copy, not in an attribute, not in the markup at all.
   */
  test('shows no revenue figure anywhere on the completed screen', async ({ page }) => {
    await page.goto('/calculator');
    await complete(page);

    const markup = await page.locator('main').innerHTML();
    expect(markup).not.toMatch(/\$\s?\d/);
    // The two things it IS allowed to show: the hours, and the module order.
    await expect(page.locator('.calc__hoursvalue')).toHaveText(/^[\d,]+$/);
    await expect(page.locator('.calc__point')).toHaveCount(4);
  });

  /**
   * The answers go the moment the questions are finished, not on a click.
   *
   * With a calendar embedded there is no click to hang it on — a booking
   * happens inside an iframe we never hear from — and somebody who completes
   * the questions and never picks a time is still a lead worth having.
   */
  test('sends the answers as soon as the questions are finished', async ({ page }) => {
    const posted = page.waitForRequest(
      (request) => request.url().includes('/api/calculator/lead') && request.method() === 'POST'
    );

    await page.goto('/calculator');
    await complete(page);
    const request = await posted;

    const body = request.postDataJSON() as { answers?: Record<string, unknown> };
    expect(body.answers?.practice).toBe('dental');
    expect(body.answers?.weeklyAppointments).toBe(240);
    // No email is collected on our side; Cal.com takes it at the booking.
    expect(body).not.toHaveProperty('email');
  });

  test('mounts the calendar, and keeps a way to book if it does not load', async ({ page }) => {
    await page.goto('/calculator');
    await complete(page);

    // The element Cal.com mounts into, by the id its own snippet names.
    await expect(page.locator('#my-cal-inline-revenue-assessment')).toBeVisible();

    // The fallback beside it, which has to survive the embed: on a network
    // that blocks app.cal.com this link is the only way left to book.
    await expect(page.getByRole('link', { name: /book the call|request a time/i })).toBeVisible();
  });

  /**
   * The embed is the site's only third-party script, so `/calculator` is the
   * only route whose CSP names Cal.com. Get that wrong and the calendar is a
   * blank box with a console error nobody sees.
   */
  test('carries a policy that allows the calendar, and only here', async ({ request }) => {
    const booking = await request.get('/calculator');
    const policy = booking.headers()['content-security-policy'] ?? '';
    expect(policy).toContain('frame-src https://app.cal.com');
    expect(policy).toMatch(/script-src[^;]*https:\/\/app\.cal\.com/);
    expect(policy).toMatch(/connect-src[^;]*https:\/\/app\.cal\.com/);

    const elsewhere = await request.get('/contact');
    const strict = elsewhere.headers()['content-security-policy'] ?? '';
    expect(strict).toContain("frame-src 'none'");
    expect(strict).not.toContain('cal.com');
    // And exactly one policy header, or the browser intersects them.
    expect(strict.split('frame-src').length).toBe(2);
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

  test('accepts a lead with no email at all, which is the normal case', async ({ request }) => {
    const res = await request.post('/api/calculator/lead', {
      headers: bucket('25'),
      data: {
        answers: {
          practice: 'veterinary',
          locations: '2-3',
          records: '1500-4000',
          weeklyAppointments: 120,
          value: '100-200',
          desk: '2-3',
          calls: 'try-again',
          noShows: '5-10',
          campaign: 'over-12',
        },
      },
    });
    // Never a 400: the questionnaire does not ask for an email.
    expect([200, 429, 502, 503]).toContain(res.status());
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
