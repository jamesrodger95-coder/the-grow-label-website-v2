import { chromium } from '@playwright/test';

/**
 * Crawls every internal link reachable from the site's own routes and reports
 * anything that does not resolve, plus any console error along the way.
 *
 * Fragment links are checked too: an anchor that points at an id nothing on the
 * target page defines is a broken link even though the request succeeds.
 */
const BASE = process.env.BASE_URL ?? 'http://localhost:3112';

const SEEDS = [
  '/',
  '/platform',
  '/modules',
  '/modules/answer',
  '/modules/respond',
  '/modules/retain',
  '/modules/reactivate',
  '/industries/veterinary',
  '/industries/dental',
  '/insights',
  '/about',
  '/contact',
  '/privacy',
  '/terms',
];

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });

const consoleErrors = [];
const failedRequests = [];
page.on('console', (m) => {
  if (m.type() === 'error') consoleErrors.push(`${page.url()} :: ${m.text()}`);
});
page.on('requestfailed', (r) => {
  failedRequests.push(`${page.url()} :: ${r.url()} :: ${r.failure()?.errorText}`);
});

const seen = new Set(SEEDS);
const queue = [...SEEDS];
const links = new Map(); // href -> Set of pages linking to it
const idsByPath = new Map();

while (queue.length) {
  const path = queue.shift();
  const response = await page.goto(BASE + path, { waitUntil: 'load' });
  const status = response?.status() ?? 0;
  if (status >= 400) console.log(`STATUS ${status}  ${path}`);

  const found = await page.evaluate(() =>
    Array.from(document.querySelectorAll('a[href]')).map((a) => a.getAttribute('href'))
  );
  const ids = await page.evaluate(() =>
    Array.from(document.querySelectorAll('[id]')).map((el) => el.id)
  );
  idsByPath.set(path, new Set(ids));

  for (const href of found) {
    if (!href || !href.startsWith('/')) continue;
    if (!links.has(href)) links.set(href, new Set());
    links.get(href).add(path);
    const bare = href.split('#')[0] || '/';
    if (!seen.has(bare)) {
      seen.add(bare);
      queue.push(bare);
    }
  }
}

const broken = [];
for (const [href, sources] of links) {
  const [bare, hash] = href.split('#');
  const target = bare || '/';
  const response = await page.goto(BASE + target, { waitUntil: 'domcontentloaded' });
  const status = response?.status() ?? 0;
  if (status >= 400) {
    broken.push(`${status}  ${href}  <- ${[...sources].join(', ')}`);
    continue;
  }
  if (hash) {
    const has = await page.evaluate((id) => Boolean(document.getElementById(id)), hash);
    if (!has) broken.push(`NO ANCHOR #${hash} on ${target}  <- ${[...sources].join(', ')}`);
  }
}

console.log(`\ncrawled ${seen.size} routes, checked ${links.size} distinct internal links`);
console.log(broken.length ? `\nBROKEN:\n${broken.join('\n')}` : '\nno broken links');
console.log(
  consoleErrors.length ? `\nCONSOLE ERRORS:\n${consoleErrors.join('\n')}` : 'no console errors'
);
console.log(
  failedRequests.length ? `\nFAILED REQUESTS:\n${failedRequests.join('\n')}` : 'no failed requests'
);

await browser.close();
