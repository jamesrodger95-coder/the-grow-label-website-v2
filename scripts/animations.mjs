import { chromium } from '@playwright/test';

const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await context.newPage();
await page.goto(process.argv[2] ?? 'http://127.0.0.1:3112/', { waitUntil: 'load' });
await page.waitForTimeout(1200);

const info = await page.evaluate(() => {
  const running = document.getAnimations().map((a) => {
    const t = a.effect?.target;
    return {
      name: a.animationName ?? '(transition)',
      cls: t ? (t.className || '').toString().split(' ')[0] : '?',
      infinite: a.effect?.getTiming?.().iterations === Infinity,
      playState: a.playState,
      onScreen: t
        ? (() => {
            const r = t.getBoundingClientRect();
            return r.bottom > 0 && r.top < window.innerHeight;
          })()
        : false,
    };
  });
  const byName = {};
  for (const a of running) {
    const k = `${a.name} .${a.cls}${a.infinite ? ' [INFINITE]' : ''}`;
    byName[k] = byName[k] ?? { count: 0, offScreen: 0 };
    byName[k].count += 1;
    if (!a.onScreen) byName[k].offScreen += 1;
  }
  return {
    total: running.length,
    paused: running.filter((a) => a.playState === 'paused').length,
    // The number that actually matters: animations burning frames for content
    // nobody can see.
    runningOffScreen: running.filter((a) => !a.onScreen && a.playState === 'running').length,
    infinite: running.filter((a) => a.infinite).length,
    infiniteOffScreen: running.filter((a) => a.infinite && !a.onScreen).length,
    byName,
  };
});

console.log(`animations: ${info.total} total, ${info.paused} paused`);
console.log(`STILL RUNNING WHILE OFF SCREEN: ${info.runningOffScreen}`);
console.log(
  `infinite: ${info.infinite}   of which currently off screen: ${info.infiniteOffScreen}`
);
for (const [k, v] of Object.entries(info.byName).sort((a, b) => b[1].count - a[1].count)) {
  console.log(`  ${String(v.count).padStart(3)}  (${v.offScreen} off-screen)  ${k}`);
}
await browser.close();
