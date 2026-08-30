#!/usr/bin/env node
/**
 * Verifies a deployed Vercel preview.
 *
 * Preview deployments sit behind Vercel Authentication, so requests go through
 * `vercel curl`, which attaches the signed-in CLI session. That is enough to
 * check status, metadata, headers and rendered content for every route; the
 * browser-level checks (axe, responsive, motion, Lighthouse) run against the
 * identical production build locally, because driving a browser through the SSO
 * flow needs a human session.
 *
 * Usage: node scripts/verify-preview.mjs https://<deployment>.vercel.app
 */
import { execFileSync } from 'node:child_process';

const BASE = process.argv[2];
if (!BASE) {
  console.error('usage: node scripts/verify-preview.mjs <deployment-url>');
  process.exit(1);
}

function fetchPath(path, extra = []) {
  try {
    return execFileSync('vercel', ['curl', `${BASE}${path}`, '-s', '-L', ...extra], {
      encoding: 'utf8',
      maxBuffer: 20 * 1024 * 1024,
      shell: true,
    });
  } catch (error) {
    return `ERROR ${error.message}`;
  }
}

const ROUTES = [
  ['/', 'Find the revenue your practice already earned', 'revenue recovery for veterinary'],
  ['/platform', 'four points of contact with the schedule', 'Platform'],
  ['/modules/answer', 'Coverage for the calls', 'Answer'],
  ['/modules/respond', 'first response on every written enquiry', 'Respond'],
  ['/modules/retain', 'Protecting appointments that are already booked', 'Retain'],
  ['/modules/reactivate', 'records that stopped coming back', 'Reactivate'],
  ['/industries/veterinary', 'the shape of the day', 'Veterinary revenue recovery'],
  ['/industries/dental', 'the interval and the gap after yes', 'Dental revenue recovery'],
  ['/methodology', 'and what it does not mean', 'Measurement methodology'],
  ['/about', 'not a marketing channel', 'About'],
  ['/insights', 'scheduling and the back book', 'Insights'],
  [
    '/insights/why-one-revenue-number-is-not-enough',
    'answering four questions',
    'recovered-revenue',
  ],
  ['/contact', 'Four steps, stated', 'Request an assessment'],
  ['/privacy', 'which is very little', 'Privacy'],
  ['/terms', 'and what it is not', 'Terms'],
  ['/dev/styleguide', 'Styleguide', 'Styleguide'],
  ['/dev/motion-lab', 'Three verbs only', 'Motion lab'],
];

const failures = [];
let checks = 0;

console.log(`Verifying ${BASE}\n`);

for (const [path, marker, title] of ROUTES) {
  const html = fetchPath(path);
  const problems = [];
  checks += 1;

  if (!html.includes(marker)) problems.push(`missing content: "${marker.slice(0, 40)}"`);
  if (!html.includes(title)) problems.push(`missing title fragment: "${title}"`);
  if (!/<h1[\s>]/.test(html)) problems.push('no h1');
  if ((html.match(/<h1[\s>]/g) ?? []).length > 1) problems.push('more than one h1');
  if (!/<meta name="description" content="[^"]{40,}"/.test(html))
    problems.push('no usable meta description');
  if (!html.includes('Skip to content')) problems.push('no skip link');
  if (!html.includes('Grow Label')) problems.push('no brand mark');
  // The hero and nav must be in the delivered HTML, not injected later.
  if (path === '/' && !html.includes('Request a revenue-recovery assessment'))
    problems.push('primary CTA missing from initial HTML');

  const dev = path.startsWith('/dev/');
  const noindex = /<meta name="robots" content="[^"]*noindex/.test(html);
  if (dev && !noindex) problems.push('dev route is not noindex');

  if (problems.length) failures.push(`${path}\n    ${problems.join('\n    ')}`);
  console.log(`${problems.length ? 'FAIL' : ' ok '}  ${path}`);
}

// --- Metadata endpoints ---------------------------------------------------
const sitemap = fetchPath('/sitemap.xml');
checks += 1;
if (!sitemap.includes('<urlset')) failures.push('/sitemap.xml is not a urlset');
else {
  for (const path of ['/platform', '/methodology', '/contact', '/modules/answer']) {
    if (!sitemap.includes(`${path}<`)) failures.push(`sitemap missing ${path}`);
  }
  if (sitemap.includes('/dev/')) failures.push('sitemap exposes a dev route');
}
console.log(`${sitemap.includes('<urlset') ? ' ok ' : 'FAIL'}  /sitemap.xml`);

const robots = fetchPath('/robots.txt');
checks += 1;
const robotsBlocks = /Disallow:\s*\/\s*$/m.test(robots);
if (!robotsBlocks) failures.push('robots.txt does not disallow crawling on a preview');
console.log(`${robotsBlocks ? ' ok ' : 'FAIL'}  /robots.txt (preview disallows crawling)`);

// --- API ------------------------------------------------------------------
const api = fetchPath('/api/contact');
checks += 1;
let apiOk = false;
try {
  apiOk = typeof JSON.parse(api).configured === 'boolean';
} catch {
  apiOk = false;
}
if (!apiOk) failures.push('/api/contact did not report its configuration');
console.log(
  `${apiOk ? ' ok ' : 'FAIL'}  /api/contact reports configuration: ${api.trim().slice(0, 40)}`
);

// --- Security headers -----------------------------------------------------
const headers = fetchPath('/', ['-D', '-', '-o', 'NUL']);
checks += 1;
const wanted = [
  'content-security-policy',
  'x-content-type-options',
  'referrer-policy',
  'x-frame-options',
  'strict-transport-security',
];
const lower = headers.toLowerCase();
const missing = wanted.filter((h) => !lower.includes(h));
if (missing.length) failures.push(`missing security headers: ${missing.join(', ')}`);
console.log(`${missing.length ? 'FAIL' : ' ok '}  security headers`);

// --- Report ---------------------------------------------------------------
console.log(`\n${checks} checks`);
if (failures.length) {
  console.log('\nFailures:\n  ' + failures.join('\n  '));
  process.exit(1);
}
console.log('Preview verified.');
