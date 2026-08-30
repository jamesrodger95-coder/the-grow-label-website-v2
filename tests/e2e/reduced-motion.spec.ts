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

  // Frame four: the staircase, its labels and the collected marker.
  await expect(page.getByText('One of these four numbers is revenue.')).toBeVisible();
  const rail = page.locator('.sequence__step[data-active="true"]');
  await expect(rail).toHaveCount(1);
  await expect(rail).toContainText('Hold');
});

test('stage bars are drawn at full width, not animating from zero', async ({ page }) => {
  await page.goto('/methodology');
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

test('the hero signal field stays inert', async ({ page }) => {
  await page.goto('/');
  await page.waitForTimeout(300);
  const marks = page.locator('.signalfield__mark');
  await expect(marks.first()).toBeAttached();
  // Marks are decorative and must never be announced.
  await expect(page.locator('.signalfield')).toHaveAttribute('aria-hidden', 'true');
});
