import { expect, test } from '@playwright/test';

/**
 * /AI, the product content studio.
 *
 * What this guards: the page stands apart from the clinic site (its own
 * header and footer, linked from nowhere), the reel stops when asked and when
 * it should, the form never claims a send it did not make, and the address
 * works in either case.
 */

test('serves /AI and /ai, with its own chrome and not the site’s', async ({ page }) => {
  for (const path of ['/AI', '/ai']) {
    const response = await page.goto(path);
    expect(response?.status()).toBe(200);
    await expect(page.locator('h1')).toHaveText(/Turn what you sell\s*into content\s*that sells\./);
    await expect(page.locator('header.nav')).toHaveCount(0);
    await expect(page.locator('.studio-bar')).toBeVisible();
    await expect(page.locator('.studio-footer')).toBeVisible();
  }
});

test('keeps the strict policy: no frames, no third-party connections', async ({ request }) => {
  const res = await request.get('/AI');
  const csp = res.headers()['content-security-policy'] ?? '';
  expect(csp).toContain("frame-src 'none'");
  expect(csp).toContain("connect-src 'self'");
});

test('is reached from the main nav as the Design Studio, and is in the sitemap', async ({
  page,
}) => {
  await page.goto('/');
  const link = page
    .getByRole('navigation', { name: 'Primary' })
    .getByRole('link', { name: 'Design Studio' });
  await expect(link).toHaveAttribute('href', '/AI');
  await link.click();
  await expect(page).toHaveURL(/\/AI$/);
  const sitemap = await (await page.request.get('/sitemap.xml')).text();
  expect(sitemap).toMatch(/\/AI</);
});

test('carries no em dash anywhere in the rendered page', async ({ page }) => {
  await page.goto('/AI');
  const text = await page.locator('body').innerText();
  expect(text).not.toContain('—');
});

test('offers a pause control for the moving wall', async ({ page }) => {
  await page.goto('/AI');
  const toggle = page.getByRole('button', { name: 'Pause motion' });
  await toggle.click();
  await expect(page.getByRole('button', { name: 'Play motion' })).toBeVisible();
  await expect(page.locator('.tunnel')).toHaveAttribute('data-paused', 'true');
  const playing = await page.evaluate(
    () =>
      [...document.querySelectorAll('.tunnel video')].filter((v) => !(v as HTMLVideoElement).paused)
        .length
  );
  expect(playing).toBe(0);
});

test.describe('with reduced motion', () => {
  test.use({ contextOptions: { reducedMotion: 'reduce' } });
  test('starts still, and the reader can still choose to play', async ({ page }) => {
    await page.goto('/AI');
    await expect(page.locator('.tunnel')).toHaveAttribute('data-paused', 'true');
    await expect(page.getByRole('button', { name: 'Play motion' })).toBeVisible();
  });
});

test('the sample form never reports a send it did not make', async ({ page }) => {
  await page.goto('/AI#sample');
  const form = page.locator('form.sample__form');
  if ((await form.count()) === 0) {
    // No delivery provider configured: the form is switched off and says so.
    await expect(page.locator('.sample__panel')).toContainText(/not connected/i);
    return;
  }
  await form.getByRole('button', { name: /request my free sample/i }).click();
  await expect(form.locator('.sample__error').first()).toBeVisible();
  await expect(page.locator('.sample__panel')).toHaveCount(0);
});

test('labels the form for assistive technology', async ({ page }) => {
  await page.goto('/AI#sample');
  const form = page.locator('form.sample__form');
  test.skip((await form.count()) === 0, 'form switched off without a delivery provider');
  for (const label of ['Your name', 'Work email', 'Company or website', 'Page to feature']) {
    await expect(form.getByLabel(label)).toBeVisible();
  }
  await expect(form.getByLabel('Your business')).toBeVisible();
  await expect(form.getByRole('radio', { name: 'Video' })).toBeChecked();
  await expect(form.getByRole('radio', { name: 'Images' })).toBeVisible();
});

test('the viewer opens, steps and closes from the keyboard', async ({ page }) => {
  await page.goto('/AI#work');
  const pieces = page.locator('button.work__open');
  test.skip((await pieces.count()) === 0, 'no portfolio files in public/ai/work yet');
  await pieces.first().focus();
  await page.keyboard.press('Enter');
  const dialog = page.locator('dialog.viewer[open]');
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole('button', { name: 'Close' })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
  await expect(pieces.first()).toBeFocused();
});

test('the showcase lays the work out in every format', async ({ page }) => {
  await page.goto('/AI#industries');
  const cards = page.locator('.show__card');
  expect(await cards.count()).toBeGreaterThanOrEqual(10);
  for (const shape of ['9:16', '1:1', '16:9']) {
    await expect(page.locator(`.show__card[data-shape="${shape}"]`).first()).toBeVisible();
  }
  await expect(cards.first().locator('video')).toHaveAttribute('src', /\/ai\/work\//);
});

test('the showcase is complete without scripts', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('/AI');
  const first = page.locator('.show__card').first();
  await expect(first).toBeVisible();
  // Rendered at rest, not stacked waiting for a scroll.
  await expect(first).toHaveAttribute('style', /rotate\(0deg\)/);
  await context.close();
});
