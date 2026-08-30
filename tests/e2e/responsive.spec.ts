import { expect, test } from '@playwright/test';
import { awaitHydration } from './helpers';
import { ROUTES, VIEWPORTS } from './routes';

test.describe('no horizontal overflow at any breakpoint', () => {
  for (const vp of VIEWPORTS) {
    test(`${vp.name}`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      const offenders: string[] = [];

      for (const route of ROUTES) {
        await page.goto(route.path);
        await page.waitForTimeout(250);
        const result = await page.evaluate(() => {
          const el = document.documentElement;
          if (el.scrollWidth <= el.clientWidth + 1) return null;
          const wide: string[] = [];
          for (const node of Array.from(document.body.querySelectorAll<HTMLElement>('*'))) {
            if (node.scrollWidth > node.clientWidth + 1 && node.clientWidth > 0) {
              const cls = typeof node.className === 'string' ? node.className : '';
              wide.push(`${node.tagName.toLowerCase()}.${cls.split(' ')[0] ?? ''}`);
            }
            if (wide.length > 3) break;
          }
          return { scroll: el.scrollWidth, client: el.clientWidth, wide };
        });
        if (result) {
          offenders.push(
            `${route.path} ${result.scroll}>${result.client} :: ${result.wide.join(', ')}`
          );
        }
      }

      expect(offenders).toEqual([]);
    });
  }
});

test.describe('mobile navigation', () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true });

  test('drawer opens, traps focus, closes on Escape and restores focus', async ({ page }) => {
    await page.goto('/');
    await awaitHydration(page);
    const toggle = page.getByRole('button', { name: /^(menu|close)$/i });
    await expect(toggle).toBeVisible();
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');

    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');

    const drawerNav = page.getByRole('navigation', { name: 'All pages' });
    await expect(drawerNav).toBeVisible();
    await expect(drawerNav.getByRole('link', { name: /platform overview/i })).toBeVisible();

    // Focus is inside the drawer.
    const focusedInDrawer = await page.evaluate(() => {
      const drawer = document.querySelector('.drawer');
      return Boolean(drawer && document.activeElement && drawer.contains(document.activeElement));
    });
    expect(focusedInDrawer).toBe(true);

    // Background scroll is locked while the drawer is open.
    expect(await page.evaluate(() => document.body.style.overflow)).toBe('hidden');

    // Tab cycles without escaping into the page behind.
    for (let i = 0; i < 30; i++) await page.keyboard.press('Tab');
    const stillContained = await page.evaluate(() => {
      const nav = document.querySelector('header');
      return Boolean(nav && document.activeElement && nav.contains(document.activeElement));
    });
    expect(stillContained).toBe(true);

    await page.keyboard.press('Escape');
    await expect(drawerNav).toBeHidden();
    await expect(toggle).toBeFocused();
    expect(await page.evaluate(() => document.body.style.overflow)).toBe('');
  });

  test('drawer closes on navigation and lands on the right page', async ({ page }) => {
    await page.goto('/');
    await awaitHydration(page);
    await page.getByRole('button', { name: /^(menu|close)$/i }).click();
    await page
      .getByRole('navigation', { name: 'All pages' })
      .getByRole('link', { name: 'Dental', exact: true })
      .click();
    await expect(page).toHaveURL(/\/industries\/dental$/);
    await expect(page.getByRole('navigation', { name: 'All pages' })).toBeHidden();
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('targets clear the WCAG 2.2 minimum, and primary actions clear 44px', async ({ page }) => {
    await page.goto('/');

    // 2.5.8 Target Size (Minimum) is 24 x 24 CSS px at AA.
    const interactive = page.locator('header a, header button, main a.btn, main button');
    const count = await interactive.count();
    for (let i = 0; i < count; i++) {
      const el = interactive.nth(i);
      if (!(await el.isVisible())) continue;
      const box = await el.boundingBox();
      if (!box) continue;
      const name = await el.innerText();
      expect(
        Math.min(box.width, box.height),
        `target "${name.slice(0, 24)}"`
      ).toBeGreaterThanOrEqual(24);
    }

    // Primary calls to action are held to the more generous 44px.
    const buttons = page.locator('.btn');
    const buttonCount = await buttons.count();
    expect(buttonCount).toBeGreaterThan(0);
    for (let i = 0; i < buttonCount; i++) {
      const box = await buttons.nth(i).boundingBox();
      if (!box) continue;
      expect(box.height, `button ${i}`).toBeGreaterThanOrEqual(44);
    }
  });

  test('the hero aside is removed rather than squeezed', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.hero__aside')).toBeHidden();
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });
});
