/**
 * Contrast ratios for the ink sets, so a "faint" colour is chosen against a
 * number rather than by eye. Every token that ever carries text must clear 4.5.
 */
function channel(v) {
  const s = v / 255;
  return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
}

function luminance(hex) {
  const n = hex.replace('#', '');
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(n.slice(i, i + 2), 16));
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

function ratio(a, b) {
  const [x, y] = [luminance(a), luminance(b)].sort((m, n) => n - m);
  return (x + 0.05) / (y + 0.05);
}

/** Flatten a white overlay at `alpha` onto `bg`, the way the dark ink set works. */
function over(alpha, bg) {
  const n = bg.replace('#', '');
  const mix = [0, 2, 4]
    .map((i) => Math.round(alpha * 251 + (1 - alpha) * parseInt(n.slice(i, i + 2), 16)))
    .map((v) => v.toString(16).padStart(2, '0'))
    .join('');
  return `#${mix}`;
}

const LIGHT = { white: '#fbfaf8', paper: '#f4f3f0', mist: '#eae8e3' };
const DARK = { ink: '#0c0c0e', graphite: '#17171b' };

console.log('--- ink on light grounds ---');
for (const [name, fg] of Object.entries({
  ink: '#0c0c0e',
  graphite: '#33333a',
  slate: '#6c6c75',
  'slate-soft': '#8f8f98',
  'slate-quiet': '#6f6f78',
  purple: '#4a3ac4',
})) {
  const row = Object.entries(LIGHT)
    .map(([bg, hex]) => `${bg} ${ratio(fg, hex).toFixed(2)}`)
    .join('   ');
  console.log(`  ${name.padEnd(12)} ${row}`);
}

console.log('\n--- white at alpha on dark grounds ---');
for (const alpha of [0.4, 0.5, 0.55, 0.62, 0.78]) {
  const row = Object.entries(DARK)
    .map(([bg, hex]) => `${bg} ${ratio(over(alpha, hex), hex).toFixed(2)}`)
    .join('   ');
  console.log(`  ${String(alpha).padEnd(12)} ${row}`);
}
