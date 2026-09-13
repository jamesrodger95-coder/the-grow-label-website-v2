import { expect, test } from '@playwright/test';
import { awaitHydration } from './helpers';

/**
 * Motion with animation *enabled*. The reduced-motion suite covers the authored
 * end states; this one covers the path a reader with default settings takes,
 * where a mis-wired observer leaves content stuck in its start state.
 */

test('stage bars actually fill once scrolled into view', async ({ page }) => {
  await page.goto('/platform');
  await awaitHydration(page);

  const bar = page.locator('.stagebar').first();
  await bar.scrollIntoViewIfNeeded();
  await expect(bar).toHaveAttribute('data-inview', 'true');

  const fills = bar.locator('.stagebar__fill');
  const count = await fills.count();
  expect(count).toBe(4);

  // Give the transition its authored duration plus the last stagger step.
  await page.waitForTimeout(1600);

  const widths: number[] = [];
  for (let i = 0; i < count; i++) {
    const box = await fills.nth(i).boundingBox();
    widths.push(box?.width ?? 0);
  }
  for (const [i, width] of widths.entries()) {
    expect(width, `stage ${i} is visible`).toBeGreaterThan(8);
  }
  // The staircase descends: every stage is narrower than the one above it.
  for (let i = 1; i < widths.length; i++) {
    expect(widths[i]!, `stage ${i} narrower than ${i - 1}`).toBeLessThan(widths[i - 1]!);
  }
});

test('entrance reveals resolve rather than leaving content hidden', async ({ page }) => {
  await page.goto('/');
  await awaitHydration(page);
  expect(await page.evaluate(() => document.documentElement.dataset.motion)).toBe('on');

  // Walk the page, then assert nothing that was scrolled past is still faded.
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < height; y += 600) {
    await page.evaluate((v) => window.scrollTo(0, v), y);
    await page.waitForTimeout(90);
  }
  await page.waitForTimeout(1200);

  const stuck = await page.$$eval('.m-detect, .m-reveal, .m-rule', (nodes) =>
    nodes
      .filter(
        (n) => n.getAttribute('data-inview') === 'true' && Number(getComputedStyle(n).opacity) < 0.9
      )
      .map((n) => (typeof n.className === 'string' ? n.className : ''))
      .slice(0, 5)
  );
  expect(stuck).toEqual([]);
});

test('the recovery sequence advances through all four states on scroll', async ({ page }) => {
  await page.goto('/');
  await awaitHydration(page);

  const sequence = page.locator('.scene');
  await sequence.scrollIntoViewIfNeeded();

  const seen = new Set<string>();
  // boundingBox() is viewport-relative; the scroll target must be a document
  // offset, so read the rect and the current scroll position together.
  const { top, height, viewport } = await sequence.evaluate((el) => {
    const rect = el.getBoundingClientRect();
    return { top: rect.top + window.scrollY, height: rect.height, viewport: window.innerHeight };
  });

  // The scene's window opens while it is still below the fold (useScene runs
  // `from: 0.95`), so a sweep that starts with the scene's top at the top of
  // the viewport begins half way through the sequence and never sees Detect or
  // Consolidate. Start a full viewport earlier, where the scene enters.
  const start = Math.max(0, top - viewport);
  const span = height + viewport;

  for (let step = 0; step <= 12; step++) {
    await page.evaluate((y) => window.scrollTo(0, y), start + (span * step) / 12);
    await page.waitForTimeout(220);
    const active = await page
      .locator('.scene__step[data-active="true"] .scene__stepname')
      .first()
      .textContent();
    if (active) seen.add(active.trim());
  }

  expect([...seen].sort()).toEqual(['Consolidate', 'Detect', 'Hold', 'Settle']);
});

test('the hero recovery field is decorative and never announced', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/');
  await expect(page.locator('.field__grid')).toHaveAttribute('aria-hidden', 'true');
  await expect(page.locator('.field__tick').first()).toBeVisible();

  // The field is simplified rather than removed on a phone: it still renders,
  // but with fewer marks and no pointer tilt.
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(200);
  await expect(page.locator('.field__tick').first()).toBeVisible();
});

/**
 * The opportunity record is server-rendered and cycles on CSS delays, so every
 * scenario must be in the DOM whether or not JavaScript ran.
 */
test('the opportunity record holds every scenario in the initial HTML', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.pipe__card')).toHaveCount(4);
  await expect(page.locator('.pipe__card').first()).toContainText('Inbound call');
});
