import { expect, test } from '@playwright/test';

/**
 * The rate limiter keys on the client IP, and every local request shares one.
 * Each test therefore sends a distinct forwarded-for value, so a test that is
 * meant to exercise the honeypot or the timing gate is not silently answered by
 * a 429 left over from the rate-limit test.
 */
function bucket(name: string) {
  return { 'x-forwarded-for': `203.0.113.${name}` };
}

/**
 * The contact journey. These run against whatever delivery configuration the
 * environment has, so each assertion states which state it is checking.
 */

test('the endpoint reports its configuration honestly', async ({ request }) => {
  const res = await request.get('/api/contact');
  expect(res.status()).toBe(200);
  const body = (await res.json()) as { configured: boolean };
  expect(typeof body.configured).toBe('boolean');
});

test('a malformed body is rejected with field errors, not accepted', async ({ request }) => {
  const res = await request.post('/api/contact', {
    headers: bucket('11'),
    data: {
      name: '',
      email: 'nope',
      organisation: '',
      sector: 'veterinary',
      sites: '1',
      message: 'x',
    },
  });
  expect([400, 429]).toContain(res.status());
  if (res.status() === 400) {
    const body = (await res.json()) as { status: string; fieldErrors?: Record<string, string> };
    expect(body.status).toBe('error');
    expect(Object.keys(body.fieldErrors ?? {}).length).toBeGreaterThan(0);
  }
});

test('a filled honeypot is never treated as a success', async ({ request }) => {
  const res = await request.post('/api/contact', {
    headers: bucket('12'),
    data: {
      name: 'Spam Bot',
      email: 'bot@example.com',
      organisation: 'Spam Co',
      sector: 'other',
      sites: '1',
      message: 'This is a long enough message to pass length validation checks.',
      website: 'https://spam.example',
      elapsed: 30000,
    },
  });
  expect(res.status()).not.toBe(200);
  const body = (await res.json()) as { status: string };
  expect(body.status).not.toBe('success');
});

test('an instant submission is rejected by the timing check', async ({ request }) => {
  const res = await request.post('/api/contact', {
    headers: bucket('13'),
    data: {
      name: 'Fast Bot',
      email: 'fast@example.com',
      organisation: 'Fast Co',
      sector: 'other',
      sites: '1',
      message: 'This is a long enough message to pass the length validation check.',
      elapsed: 10,
    },
  });
  expect(res.status()).not.toBe(200);
});

test('repeated submissions hit the rate-limit boundary', async ({ request }) => {
  const payload = {
    name: 'Rate Test',
    email: 'rate@example.com',
    organisation: 'Rate Co',
    sector: 'other',
    sites: '1',
    message: 'A message that is comfortably long enough to pass validation rules.',
    elapsed: 30000,
  };

  let sawLimit = false;
  for (let i = 0; i < 12; i++) {
    const res = await request.post('/api/contact', { headers: bucket('14'), data: payload });
    if (res.status() === 429) {
      sawLimit = true;
      expect(res.headers()['retry-after']).toBeTruthy();
      break;
    }
  }
  expect(sawLimit, 'rate limit engaged within 12 requests').toBe(true);
});

test('the contact page states the journey before asking for anything', async ({ page }) => {
  await page.goto('/contact');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Request a revenue-recovery');
  await expect(page.getByRole('heading', { name: /you send the outline/i })).toBeVisible();
  await expect(page.getByRole('heading', { name: /scoping call/i })).toBeVisible();
  await expect(page.getByText(/you keep the analysis/i)).toBeVisible();
});

test('the contact page starts the revenue calculator below the outline heading', async ({
  page,
}) => {
  await page.goto('/contact');
  await expect(page.getByText(/form unavailable/i)).toHaveCount(0);
  await expect(
    page.getByRole('heading', { name: /what kind of practice do you run/i })
  ).toBeVisible();
  await expect(page.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '1');
  await expect(page.getByRole('radio', { name: 'Veterinary' })).toBeVisible();
  await expect(page.getByRole('radio', { name: 'Dental' })).toBeVisible();
});

test('the contact calculator ends on the inline booking calendar', async ({ page }) => {
  await page.goto('/contact');

  const answers = [
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

  for (const answer of answers) {
    if (answer === '240') {
      await page.fill('input[name="weeklyAppointments"]', answer);
      await page.click('.calc button[type="submit"]');
    } else {
      await page.locator(`.calc__radio[value="${answer}"]`).click();
    }
  }

  const bookingHeading = page.getByRole('heading', { name: /book your call/i });
  await expect(bookingHeading).toBeVisible();
  expect(await bookingHeading.evaluate((node) => node.tagName)).toBe('H2');
  await expect(page.locator('.calembed')).toBeVisible();
  await expect(page.locator('.phead')).toBeVisible();
});
