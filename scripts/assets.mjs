import { chromium } from '@playwright/test';

/**
 * What each route actually downloads, grouped by kind, with the largest
 * individual assets and any third-party origin.
 */
const BASE = process.env.BASE_URL ?? 'http://127.0.0.1:3112';
const ROUTES = process.argv.slice(2).length
  ? process.argv.slice(2)
  : ['/', '/modules', '/modules/answer'];

const browser = await chromium.launch();

for (const route of ROUTES) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  const seen = [];

  page.on('response', async (res) => {
    try {
      const req = res.request();
      const headers = res.headers();
      const len = Number(headers['content-length'] ?? 0);
      let size = len;
      if (!size) {
        const body = await res.body().catch(() => null);
        size = body ? body.length : 0;
      }
      seen.push({
        url: res.url(),
        type: req.resourceType(),
        size,
        origin: new URL(res.url()).origin,
      });
    } catch {
      /* some responses cannot be read */
    }
  });

  await page.goto(`${BASE}${route}`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);

  const total = seen.reduce((n, r) => n + r.size, 0);
  const byType = {};
  for (const r of seen) byType[r.type] = (byType[r.type] ?? 0) + r.size;

  const base = new URL(BASE).origin;
  const thirdParty = seen.filter((r) => r.origin !== base);

  const kb = (n) => `${(n / 1024).toFixed(1)}KB`;
  console.log(`\n=== ${route} ===`);
  console.log(`requests ${seen.length}   total ${kb(total)}`);
  console.log(
    Object.entries(byType)
      .sort((a, b) => b[1] - a[1])
      .map(([k, v]) => `${k} ${kb(v)}`)
      .join('   ')
  );
  console.log('largest assets:');
  for (const r of seen.sort((a, b) => b.size - a.size).slice(0, 8)) {
    console.log(`  ${kb(r.size).padStart(9)}  ${r.type.padEnd(10)} ${r.url.replace(base, '')}`);
  }
  console.log(
    thirdParty.length
      ? `third party: ${[...new Set(thirdParty.map((r) => r.origin))].join(', ')}`
      : 'third party: none'
  );

  await context.close();
}

await browser.close();
