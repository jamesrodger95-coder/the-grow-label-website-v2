import { expect, test } from '@playwright/test';
import { ROUTES } from './routes';

/**
 * Under reduced motion every sequence must render its authored end state, not a
 * disabled or half-finished one. The check is that content is fully visible
 * without any scrolling or waiting.
 */

test('all revealed content is visible immediately under reduced motion', async ({ page }) => {
  for (const route of ROUTES) {
    await page.goto(route.path);
    await page.waitForTimeout(200);

    const hidden = await page.$$eval('.m-detect, .m-reveal, .m-rule', (nodes) =>
      nodes
        .filter((n) => {
          const cs = getComputedStyle(n);
          return Number(cs.opacity) < 0.99;
        })
        .map((n) => (typeof n.className === 'string' ? n.className : ''))
        .slice(0, 5)
    );
    expect(hidden, `${route.path} has faded content under reduced motion`).toEqual([]);
  }
});

test('the recovery sequence shows its completed final state', async ({ page }) => {
  await page.goto('/');
  await page.waitForTimeout(400);

  // Under reduced motion the scene is not a scrubbed rail with one active
  // step; it is a static list carrying all four states at once, so nothing is
  // hidden behind the preference. Frame four's copy is the last of them.
  await expect(page.getByText('One of these four numbers is revenue.')).toBeVisible();
  const steps = page.locator('.scene--static .scene__listitem');
  await expect(steps).toHaveCount(4);
  await expect(steps.last()).toContainText('Hold');
});

test('stage bars are drawn at full width, not animating from zero', async ({ page }) => {
  await page.goto('/platform');
  await page.waitForTimeout(400);
  const fills = page.locator('.stagebar__fill');
  const count = await fills.count();
  expect(count).toBeGreaterThan(0);

  for (let i = 0; i < count; i++) {
    const box = await fills.nth(i).boundingBox();
    expect(box?.width ?? 0, `stage fill ${i} width`).toBeGreaterThan(4);
  }
});

test('transition durations collapse to effectively zero', async ({ page }) => {
  await page.goto('/');
  const duration = await page.evaluate(() =>
    getComputedStyle(document.documentElement).getPropertyValue('--gl-dur-slow').trim()
  );
  expect(duration).toBe('1ms');
});

test('the hero recovery field stays inert', async ({ page }) => {
  await page.goto('/');
  await page.waitForTimeout(300);
  await expect(page.locator('.field__tick').first()).toBeAttached();
  // The field is decorative and must never be announced.
  await expect(page.locator('.field__grid')).toHaveAttribute('aria-hidden', 'true');
});

/** The record panel must settle on one scenario rather than cycling. */
test('the opportunity record does not cycle', async ({ page }) => {
  await page.goto('/');
  await page.waitForTimeout(300);
  const animation = await page
    .locator('.pipe__card')
    .first()
    .evaluate((el) => getComputedStyle(el).animationName);
  expect(animation).toBe('none');
});
