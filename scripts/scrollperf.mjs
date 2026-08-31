import { chromium } from '@playwright/test';

/**
 * Scroll frame timing.
 *
 * Drives a real wheel scroll through a section and records the interval
 * between composited frames via requestAnimationFrame, plus long tasks from
 * the PerformanceObserver. Reports the median and 95th percentile interval and
 * the count of frames that missed the 16.7ms budget.
 *
 * Usage: node scripts/scrollperf.mjs /path #selector [steps]
 */
const BASE = process.env.BASE_URL ?? 'http://localhost:3112';
const route = process.argv[2] ?? '/';
const selector = process.argv[3] && process.argv[3] !== '-' ? process.argv[3] : null;
const steps = Number(process.argv[4] ?? 90);

const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await context.newPage();

await page.goto(`${BASE}${route}`, { waitUntil: 'load' });
await page.waitForTimeout(600);

if (selector) {
  await page.locator(selector).scrollIntoViewIfNeeded();
  await page.evaluate(() => window.scrollBy(0, -700));
  await page.waitForTimeout(400);
}

await page.evaluate(() => {
  window.__frames = [];
  window.__long = [];
  let last = performance.now();
  const tick = (now) => {
    window.__frames.push(now - last);
    last = now;
    window.__raf = requestAnimationFrame(tick);
  };
  window.__raf = requestAnimationFrame(tick);
  try {
    window.__obs = new PerformanceObserver((list) => {
      for (const e of list.getEntries()) window.__long.push(Math.round(e.duration));
    });
    window.__obs.observe({ entryTypes: ['longtask'] });
  } catch {
    /* longtask unsupported */
  }
});

for (let i = 0; i < steps; i += 1) {
  await page.mouse.wheel(0, 34);
  await page.waitForTimeout(16);
}

const result = await page.evaluate(() => {
  cancelAnimationFrame(window.__raf);
  window.__obs?.disconnect();
  // Drop the first few frames, which include the observer's own setup.
  const f = window.__frames.slice(5).sort((a, b) => a - b);
  const at = (q) => f[Math.min(f.length - 1, Math.floor(f.length * q))];
  return {
    frames: f.length,
    median: +at(0.5).toFixed(1),
    p95: +at(0.95).toFixed(1),
    worst: +f[f.length - 1].toFixed(1),
    // 17.5, not 16.7: a 60Hz frame lands on 16.7 give or take float error, and
    // counting those as drops made a static legal page look worse than a
    // scroll-linked scene. A dropped frame is one that missed the next vsync.
    over16: f.filter((v) => v > 17.5).length,
    over32: f.filter((v) => v > 32).length,
    longTasks: window.__long.length,
    longTaskMax: window.__long.length ? Math.max(...window.__long) : 0,
  };
});

const pct = ((result.over16 / result.frames) * 100).toFixed(1);
console.log(`${route}${selector ? ` ${selector}` : ''}`);
console.log(
  `  frames ${result.frames}  median ${result.median}ms  p95 ${result.p95}ms  worst ${result.worst}ms`
);
console.log(
  `  dropped (>17.5ms): ${result.over16} (${pct}%)   over 32ms: ${result.over32}   long tasks: ${result.longTasks} (max ${result.longTaskMax}ms)`
);

await browser.close();
