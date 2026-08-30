import { expect, test } from '@playwright/test';
import { ROUTES } from './routes';

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
  expect(html).toContain('Find the revenue your practice already earned');
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
  for (const label of ['Platform', 'Veterinary', 'Dental', 'Methodology', 'Insights', 'About']) {
    await expect(nav.getByRole('link', { name: label, exact: true })).toBeVisible();
  }
  await nav.getByRole('link', { name: 'Methodology', exact: true }).click();
  await expect(page).toHaveURL(/\/methodology$/);
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
});

test('the current route is marked in the navigation', async ({ page }) => {
  await page.goto('/platform');
  const current = page.locator('.nav__link[aria-current="page"]');
  await expect(current).toHaveText('Platform');
});
