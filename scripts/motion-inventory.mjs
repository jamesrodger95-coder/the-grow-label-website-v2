import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

/**
 * The animation inventory.
 *
 * Walks the stylesheets and reports every transition and animation with the
 * duration and easing token it uses, so a drift away from the one curve and
 * the three durations is visible as a table rather than as a code review.
 */
function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (/\.(css|tsx|ts)$/.test(full)) out.push(full);
  }
  return out;
}

// tokens.css DEFINES the scale, so its raw values are the source, not drift.
// The motion lab is a dev-only harness whose prose describes the system.
const SKIP = /tokens.css|motion-lab|MotionLab/;
const FILES = walk('src').filter((f) => !SKIP.test(f));

const DUR = /var\(--gl-dur-([a-z]+)\)/g;
const EASE = /var\(--gl-ease[a-z-]*\)/g;
const RAW_DUR = /(?<![-\w(])\d{2,5}ms(?!\s*\*)/g;
// `ease` is also the name of the smoothstep helper exported by useScene, so
// the CSS keyword only counts when it is being used as a timing function.
const RAW_EASE = /cubic-bezier\([^)]*\)|(?<![-\w])ease(-in|-out|-in-out)?(?=[\s,;'"`])/g;

const durations = new Map();
const easings = new Map();
const offSystem = [];

for (const file of FILES) {
  const text = readFileSync(file, 'utf8');
  // Strip comments so prose about durations is not counted as usage.
  const code = text.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');

  for (const m of code.matchAll(DUR)) durations.set(m[1], (durations.get(m[1]) ?? 0) + 1);
  for (const m of code.matchAll(EASE)) easings.set(m[0], (easings.get(m[0]) ?? 0) + 1);

  for (const m of code.matchAll(RAW_DUR)) {
    // A stagger step is a multiplier, not a duration, and is allowed.
    const line = code.slice(Math.max(0, m.index - 80), m.index + 40);
    if (/var\(--i|var\(--m|var\(--n|animation-delay|transition-delay/.test(line)) continue;
    offSystem.push(`${file}: raw duration ${m[0]}`);
  }
  for (const m of code.matchAll(RAW_EASE)) {
    if (/--gl-ease/.test(code.slice(Math.max(0, m.index - 40), m.index))) continue;
    offSystem.push(`${file}: raw easing ${m[0]}`);
  }
}

console.log('DURATIONS IN USE');
for (const [k, v] of [...durations].sort((a, b) => b[1] - a[1])) {
  console.log(`  --gl-dur-${k.padEnd(14)} ${v}`);
}
console.log('\nEASINGS IN USE');
for (const [k, v] of [...easings].sort((a, b) => b[1] - a[1])) {
  console.log(`  ${k.padEnd(22)} ${v}`);
}
console.log(`\nOFF-SYSTEM VALUES: ${offSystem.length}`);
for (const o of offSystem) console.log(`  ${o}`);

process.exitCode = offSystem.length > 0 ? 1 : 0;
