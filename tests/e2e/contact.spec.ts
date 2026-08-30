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

test('the form either works or says plainly that it is switched off', async ({ page }) => {
  await page.goto('/contact');
  const form = page.locator('form');

  if ((await form.count()) === 0) {
    await expect(page.getByText(/form unavailable/i)).toBeVisible();
    await expect(page.getByText(/no delivery provider configured/i)).toBeVisible();
    return;
  }

  // Client-side required attributes are present, and the notice is attached.
  await expect(form.getByLabel(/work email/i)).toHaveAttribute('type', 'email');
  await expect(page.getByText(/do not include client, patient or clinical/i)).toBeVisible();

  // No field asks for sensitive information.
  const labels = await page.$$eval('label', (nodes) => nodes.map((n) => n.textContent ?? ''));
  const forbidden = /patient|client name|nhs|medical|clinical detail|diagnosis|card|password/i;
  expect(labels.filter((l) => forbidden.test(l))).toEqual([]);
});
