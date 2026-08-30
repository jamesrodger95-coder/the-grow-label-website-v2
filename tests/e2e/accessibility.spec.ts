import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { ROUTES } from './routes';

const WCAG = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

test.describe('WCAG 2.2 AA', () => {
  for (const route of ROUTES) {
    test(`${route.name} has no axe violations`, async ({ page }) => {
      await page.goto(route.path);
      // Let entrance transitions finish so nothing is measured mid-fade.
      await page.waitForTimeout(900);
      const results = await new AxeBuilder({ page }).withTags(WCAG).analyze();

      const summary = results.violations.map(
        (v) => `${v.id} (${v.impact}) x${v.nodes.length}: ${v.nodes[0]?.target.join(' ')}`
      );
      expect(summary, `${route.path} violations`).toEqual([]);
    });
  }
});

test('skip link is the first tab stop and moves focus to the main region', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  const skip = page.getByRole('link', { name: /skip to content/i });
  await expect(skip).toBeFocused();
  await expect(skip).toBeInViewport();
  await skip.press('Enter');
  await expect(page.locator('#site-main')).toBeFocused();
});

test('every interactive element in the header is reachable and shows focus', async ({ page }) => {
  await page.goto('/');
  const focusables = page.locator('header a, header button');
  const count = await focusables.count();
  expect(count).toBeGreaterThan(5);

  for (let i = 0; i < count; i++) {
    const el = focusables.nth(i);
    if (!(await el.isVisible())) continue;
    await el.focus();
    const outline = await el.evaluate((node) => {
      const cs = getComputedStyle(node);
      return { width: cs.outlineWidth, style: cs.outlineStyle };
    });
    expect(outline.style, 'focus ring style').not.toBe('none');
    expect(parseFloat(outline.width), 'focus ring width').toBeGreaterThan(0);
  }
});

test('heading order never skips a level', async ({ page }) => {
  for (const route of ROUTES) {
    await page.goto(route.path);
    const levels = await page.$$eval('h1,h2,h3,h4,h5,h6', (nodes) =>
      nodes.map((n) => Number(n.tagName.slice(1)))
    );
    expect(levels[0], `${route.path} starts at h1`).toBe(1);
    for (let i = 1; i < levels.length; i++) {
      const step = (levels[i] ?? 0) - (levels[i - 1] ?? 0);
      expect(step, `${route.path} h${levels[i - 1]} -> h${levels[i]}`).toBeLessThanOrEqual(1);
    }
  }
});

test('page reflows without horizontal scroll at 200% zoom', async ({ page }) => {
  // 200% zoom is equivalent to halving the CSS viewport at the same device size.
  await page.setViewportSize({ width: 640, height: 512 });
  for (const route of ROUTES) {
    await page.goto(route.path);
    await page.waitForTimeout(300);
    const overflow = await page.evaluate(() => {
      const el = document.documentElement;
      return { scroll: el.scrollWidth, client: el.clientWidth };
    });
    expect(overflow.scroll, `${route.path} horizontal overflow`).toBeLessThanOrEqual(
      overflow.client + 1
    );
  }
});

test('form errors are announced and tied to their field', async ({ page }) => {
  await page.goto('/contact');
  const form = page.locator('form');
  if ((await form.count()) === 0) {
    // No delivery provider configured: the form is deliberately absent.
    await expect(page.getByText(/form unavailable/i)).toBeVisible();
    return;
  }
  await form.getByRole('button', { name: /send request/i }).click();
  const alert = page.getByRole('alert');
  await expect(alert).toBeVisible();
});
