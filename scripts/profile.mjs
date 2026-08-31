import { chromium } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'node:fs';

/**
 * Chrome DevTools trace profiler.
 *
 * Collects a real performance trace over a full-length scroll and reports what
 * a DevTools Performance panel would show: frame intervals, long tasks,
 * scripting / rendering / painting totals, forced synchronous layouts with
 * their call sites, the functions that dominated the main thread, layer count
 * and GPU memory, and whether any animation kept running off screen.
 *
 * Usage:
 *   node scripts/profile.mjs <route> [cpuThrottle] [label]
 */
const BASE = process.env.BASE_URL ?? 'http://127.0.0.1:3112';
const route = process.argv[2] ?? '/';
const throttle = Number(process.argv[3] ?? 1);
const label = process.argv[4] ?? 'run';
const OUT = 'artifacts/profiles';
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({
  args: ['--enable-gpu-benchmarking', '--enable-thread-composting'],
});
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  reducedMotion: process.env.PROFILE_REDUCED ? 'reduce' : 'no-preference',
});
const page = await context.newPage();
const cdp = await context.newCDPSession(page);

await cdp.send('Page.enable');
await cdp.send('DOM.enable');
await cdp.send('LayerTree.enable');
if (throttle > 1) await cdp.send('Emulation.setCPUThrottlingRate', { rate: throttle });

/* Count IntersectionObservers and their targets, and scroll/resize listeners,
   before any of the page's own code runs. */
await page.addInitScript(() => {
  window.__io = { instances: 0, targets: 0 };
  const Native = window.IntersectionObserver;
  window.IntersectionObserver = class extends Native {
    constructor(...args) {
      super(...args);
      window.__io.instances += 1;
    }
    observe(el) {
      window.__io.targets += 1;
      return super.observe(el);
    }
  };
  window.__listeners = {};
  const add = EventTarget.prototype.addEventListener;
  EventTarget.prototype.addEventListener = function (type, ...rest) {
    if (type === 'scroll' || type === 'resize' || type === 'pointermove' || type === 'wheel') {
      window.__listeners[type] = (window.__listeners[type] ?? 0) + 1;
    }
    return add.call(this, type, ...rest);
  };
});

await page.goto(`${BASE}${route}`, { waitUntil: 'load' });
await page.addStyleTag({ content: 'html{scroll-behavior:auto !important}' });
if (process.env.PROFILE_NOATTR) {
  await page.evaluate(() => {
    const strip = () => document.documentElement.removeAttribute('data-motion');
    strip();
    new MutationObserver(strip).observe(document.documentElement, { attributes: true });
  });
}
await page.waitForTimeout(900);

/* --- instrument the page before tracing --------------------------------- */
await page.evaluate(() => {
  window.__frames = [];
  window.__rafCount = 0;
  // Count how many distinct rAF loops are running: wrap rAF and record the
  // callback identity so repeat schedulers are visible as loops, not calls.
  const raf = window.requestAnimationFrame.bind(window);
  window.__rafOwners = new Map();
  window.requestAnimationFrame = (cb) => {
    window.__rafCount += 1;
    const key = cb.name || cb.toString().slice(0, 60);
    window.__rafOwners.set(key, (window.__rafOwners.get(key) ?? 0) + 1);
    return raf(cb);
  };
  let last = performance.now();
  const tick = (now) => {
    window.__frames.push(now - last);
    last = now;
    raf(tick);
  };
  raf(tick);
});

const collected = [];
cdp.on('Tracing.dataCollected', (e) => collected.push(...e.value));

await cdp.send('Tracing.start', {
  traceConfig: {
    recordMode: 'recordAsMuchAsPossible',
    includedCategories: [
      'devtools.timeline',
      'disabled-by-default-devtools.timeline',
      'disabled-by-default-devtools.timeline.frame',
      'disabled-by-default-devtools.timeline.stack',
      'blink.user_timing',
      'v8.execute',
      'loading',
    ],
  },
});

/* --- the scroll -----------------------------------------------------------
   Driven with real wheel input, not `window.scrollTo` from a script.

   A scripted scroll loop calls scrollTo and then awaits rAF, and every one of
   those calls is itself a forced synchronous layout attributed to the
   injected eval frame. The first run of this profiler reported 546 forced
   layouts costing 2.7 seconds, and every one of them was the measuring
   instrument rather than the site. Wheel events go through the browser's own
   input pipeline, which is what a reader actually does. */
const distance = await page.evaluate(() => document.body.scrollHeight - window.innerHeight);
const steps = Math.max(40, Math.min(320, Math.round(distance / 46)));
for (let i = 0; i < steps; i += 1) {
  await page.mouse.wheel(0, 46);
  await page.waitForTimeout(8);
}
await page.waitForTimeout(400);

const tracingComplete = new Promise((resolve) => cdp.once('Tracing.tracingComplete', resolve));
await cdp.send('Tracing.end');
await tracingComplete;

/* --- page-side observations ---------------------------------------------- */
const pageState = await page.evaluate(() => {
  const f = window.__frames.slice(5).sort((a, b) => a - b);
  const at = (q) => f[Math.min(f.length - 1, Math.floor(f.length * q))] ?? 0;
  return {
    frames: f.length,
    median: +at(0.5).toFixed(1),
    p95: +at(0.95).toFixed(1),
    p99: +at(0.99).toFixed(1),
    worst: +(f[f.length - 1] ?? 0).toFixed(1),
    dropped: f.filter((v) => v > 17.5).length,
    bad: f.filter((v) => v > 32).length,
    rafCalls: window.__rafCount,
    rafOwners: [...window.__rafOwners.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6),
    willChange: [...document.querySelectorAll('*')].filter(
      (el) => getComputedStyle(el).willChange !== 'auto'
    ).length,
    io: window.__io,
    listeners: window.__listeners,
  };
});

/* --- does anything keep running off screen? ------------------------------- */
await page.evaluate(() => {
  window.scrollTo({ top: 0, behavior: 'instant' });
});
await page.waitForTimeout(500);
await page.evaluate(() => {
  window.__offBefore = window.__rafCount;
});
// Park the viewport far from every scene, then watch rAF for a second.
await page.evaluate(() => {
  window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' });
});
await page.waitForTimeout(1200);
const offScreen = await page.evaluate(() => window.__rafCount - window.__offBefore);

/* --- layers and GPU ------------------------------------------------------- */
let layers = { count: 0, memoryMB: 0 };
try {
  // LayerTree only emits on change, so collect whatever arrives while the page
  // is nudged rather than waiting for a single event that may never fire.
  let latest = null;
  cdp.on('LayerTree.layerTreeDidChange', (e) => {
    if (e.layers?.length) latest = e.layers;
  });
  for (let i = 0; i < 6; i += 1) {
    await page.mouse.wheel(0, 120);
    await page.waitForTimeout(180);
  }
  const list = latest ?? [];
  layers = {
    count: list.length,
    memoryMB: +(
      list.reduce((n, l) => n + (l.width ?? 0) * (l.height ?? 0) * 4, 0) / 1048576
    ).toFixed(1),
  };
} catch {
  /* LayerTree is best-effort */
}

await browser.close();

/* --- parse the trace ------------------------------------------------------ */
const DUR = (e) => (e.dur ?? 0) / 1000;
const byName = new Map();
let scripting = 0;
let rendering = 0;
let painting = 0;
const longTasks = [];
const forcedLayouts = [];
const fnTotals = new Map();
const styleRecalcs = { count: 0, elements: 0 };

const SCRIPT = new Set([
  'FunctionCall',
  'EvaluateScript',
  'v8.run',
  'V8.Execute',
  'TimerFire',
  'FireAnimationFrame',
  'EventDispatch',
  'MajorGC',
  'MinorGC',
]);
const RENDER = new Set([
  'Layout',
  'UpdateLayoutTree',
  'RecalculateStyles',
  'ParseHTML',
  'UpdateLayerTree',
]);
const PAINT = new Set([
  'Paint',
  'PaintImage',
  'Rasterize',
  'CompositeLayers',
  'RasterTask',
  'DecodeImage',
]);

for (const e of collected) {
  const d = DUR(e);
  if (!d) continue;
  byName.set(e.name, (byName.get(e.name) ?? 0) + d);
  if (SCRIPT.has(e.name)) scripting += d;
  else if (RENDER.has(e.name)) rendering += d;
  else if (PAINT.has(e.name)) painting += d;

  if (e.name === 'RunTask' && d > 50) longTasks.push(+d.toFixed(1));
  if (e.name === 'UpdateLayoutTree') {
    styleRecalcs.count += 1;
    styleRecalcs.elements += e.args?.elementCount ?? 0;
  }

  // A forced synchronous layout is a Layout or UpdateLayoutTree the trace
  // marks as having been forced by script, with the stack frame that did it.
  if ((e.name === 'Layout' || e.name === 'UpdateLayoutTree') && e.args?.beginData?.stackTrace) {
    const top = e.args.beginData.stackTrace[0];
    if (top) {
      const site = `${top.functionName || '(anonymous)'} @ ${String(top.url).split('/').pop()}:${top.lineNumber}`;
      const rec = forcedLayouts.find((f) => f.site === site);
      if (rec) {
        rec.count += 1;
        rec.ms += d;
      } else forcedLayouts.push({ site, count: 1, ms: d });
    }
  }

  if (e.name === 'FunctionCall' && e.args?.data?.functionName) {
    const k = `${e.args.data.functionName} @ ${String(e.args.data.url ?? '')
      .split('/')
      .pop()}`;
    fnTotals.set(k, (fnTotals.get(k) ?? 0) + d);
  }
}

const report = {
  route,
  throttle: `${throttle}x`,
  frames: pageState,
  totals: {
    scriptingMs: +scripting.toFixed(1),
    renderingMs: +rendering.toFixed(1),
    paintingMs: +painting.toFixed(1),
  },
  longTasksOver50: longTasks.length,
  longTaskList: longTasks.sort((a, b) => b - a).slice(0, 8),
  forcedLayouts: forcedLayouts.sort((a, b) => b.count - a.count).slice(0, 8),
  topFunctions: [...fnTotals.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([k, v]) => `${k}: ${v.toFixed(1)}ms`),
  topTraceEvents: [...byName.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([k, v]) => `${k}: ${v.toFixed(1)}ms`),
  layers,
  rafCallsWhileOffScreen: offScreen,
};

writeFileSync(
  `${OUT}/${label}-${route.replace(/\//g, '_') || 'home'}-${throttle}x.json`,
  JSON.stringify(report, null, 2)
);

console.log(`\n=== ${route}  (CPU ${throttle}x) ===`);
console.log(
  `frames ${pageState.frames}  median ${pageState.median}ms  p95 ${pageState.p95}  p99 ${pageState.p99}  worst ${pageState.worst}`
);
console.log(
  `dropped >17.5ms: ${pageState.dropped} (${((pageState.dropped / pageState.frames) * 100).toFixed(1)}%)   >32ms: ${pageState.bad}`
);
console.log(
  `long tasks >50ms: ${longTasks.length}  ${longTasks.length ? longTasks.slice(0, 6).join(', ') : ''}`
);
console.log(
  `scripting ${report.totals.scriptingMs}ms  rendering ${report.totals.renderingMs}ms  painting ${report.totals.paintingMs}ms`
);
console.log(
  `rAF calls during scroll: ${pageState.rafCalls}   while off screen (1.2s): ${offScreen}`
);
console.log(`rAF schedulers: ${JSON.stringify(pageState.rafOwners)}`);
console.log(`elements with will-change: ${pageState.willChange}`);
console.log(
  `IntersectionObservers: ${pageState.io.instances} instances over ${pageState.io.targets} targets`
);
console.log(`listeners: ${JSON.stringify(pageState.listeners)}`);
console.log(`layers ${layers.count}  approx GPU ${layers.memoryMB}MB`);
if (forcedLayouts.length) {
  console.log('FORCED SYNCHRONOUS LAYOUTS:');
  for (const f of report.forcedLayouts)
    console.log(`  ${f.count}x  ${f.ms.toFixed(1)}ms  ${f.site}`);
} else {
  console.log('forced synchronous layouts: none detected in trace');
}
console.log(`style recalcs: ${styleRecalcs.count} events over ${styleRecalcs.elements} elements`);
console.log('top functions:', report.topFunctions.slice(0, 5).join(' | '));
