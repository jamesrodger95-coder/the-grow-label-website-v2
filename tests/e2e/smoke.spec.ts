import { expect, test } from '@playwright/test';
import { ROUTES } from './routes';
import { PRIMARY_NAV } from '../../src/content/site';

test.describe('every route renders', () => {
  for (const route of ROUTES) {
    test(`${route.name} responds, titles and has one h1`, async ({ page }) => {
      const errors: string[] = [];
      page.on('console', (m) => {
        if (m.type() === 'error') errors.push(m.text());
      });
      page.on('pageerror', (e) => errors.push(`PAGEERROR ${e.message}`));

      const response = await page.goto(route.path);
      expect(response?.status(), `${route.path} status`).toBe(200);
      await expect(page).toHaveTitle(route.title);

      const h1 = page.locator('h1');
      await expect(h1).toHaveCount(1);
      await expect(h1).toBeVisible();

      // Meaningful content is present without waiting for hydration effects.
      const description = page.locator('meta[name="description"]');
      await expect(description).toHaveAttribute('content', /.{40,}/);

      expect(errors, `console errors on ${route.path}`).toEqual([]);
    });
  }
});

test('the hero states the proposition in the initial HTML', async ({ request }) => {
  const res = await request.get('/');
  const html = await res.text();
  expect(html).toContain('Recover the revenue');
  expect(html).toContain('you already earned');
  expect(html).toContain('Request a revenue-recovery assessment');
  // No loader, splash or gate before the content.
  expect(html).not.toMatch(/id="?(loader|splash|preloader)/i);
});

test('unknown routes return a 404 with a usable index', async ({ page }) => {
  const response = await page.goto('/definitely-not-a-real-route');
  expect(response?.status()).toBe(404);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('does not exist');
  await expect(page.getByRole('link', { name: /back to the homepage/i })).toBeVisible();
});

test('sitemap and robots are served and consistent', async ({ request }) => {
  const sitemap = await request.get('/sitemap.xml');
  expect(sitemap.status()).toBe(200);
  const xml = await sitemap.text();
  for (const route of ROUTES) {
    if (route.path.startsWith('/dev/')) {
      expect(xml, 'dev routes stay out of the sitemap').not.toContain(`${route.path}<`);
    } else if ('unlisted' in route && route.unlisted) {
      expect(xml, 'noindex routes stay out of the sitemap').not.toContain(`${route.path}<`);
    } else {
      expect(xml).toContain(`${route.path === '/' ? '/' : route.path}<`);
    }
  }

  const robots = await request.get('/robots.txt');
  expect(robots.status()).toBe(200);
  expect(await robots.text()).toContain('Sitemap:');
});

test('navigation reaches every primary destination', async ({ page }) => {
  await page.goto('/');
  const nav = page.getByRole('navigation', { name: 'Primary' });
  const labels = [
    'Platform',
    'Modules',
    'Veterinary',
    'Dental',
    'Results',
    'Case studies',
    'About',
  ];
  for (const label of labels) {
    await expect(nav.getByRole('link', { name: label, exact: true })).toBeVisible();
  }
  await nav.getByRole('link', { name: 'Modules', exact: true }).click();
  await expect(page).toHaveURL(/\/modules$/);
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
});

/**
 * The methodology page was folded into Platform. The old URL must still land
 * somewhere sensible, because it was linked from every page for a while.
 */
test('the old methodology URL redirects into the platform page', async ({ page }) => {
  const response = await page.goto('/methodology');
  expect(response?.status()).toBe(200);
  await expect(page).toHaveURL(/\/platform#value-stages$/);
  await expect(page.locator('#value-stages')).toBeAttached();
});

/**
 * Every anchored nav item must land on a section that exists.
 *
 * The list is read from `PRIMARY_NAV` rather than written out here, so removing
 * a homepage section and repointing its nav item at a page — which is what
 * happened to case studies — cannot leave this test asserting an anchor nobody
 * links to any more. `#team` is asserted separately because the footer links it
 * even though the primary nav does not.
 */
test('the anchored navigation items resolve to real sections', async ({ page }) => {
  await page.goto('/');
  const anchored = PRIMARY_NAV.filter((link) => link.href.startsWith('/#'));
  expect(anchored.length).toBeGreaterThan(0);
  for (const link of anchored) {
    await expect(page.locator(`#${link.href.slice(2)}`)).toBeAttached();
  }
  await expect(page.locator('#team')).toBeAttached();
});

test('the current route is marked in the navigation', async ({ page }) => {
  await page.goto('/platform');
  const current = page.locator('.nav__link[aria-current="page"]');
  await expect(current).toHaveText('Platform');
});
