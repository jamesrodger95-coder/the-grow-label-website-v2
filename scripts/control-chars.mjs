import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Finds stray control characters in source.
 *
 * A shell heredoc will silently turn `\b` in a regex into a literal backspace
 * (0x08) and drop the backslash from `\s` and `\d`. The result compiles, lints
 * and passes — it just matches nothing. This is cheap insurance against that
 * happening again unnoticed.
 *
 * ESC (0x1b) is allowed: `scripts/quality.mjs` uses raw ANSI colour codes in
 * its terminal output, which is a legitimate use.
 */
const SKIP = new Set(['node_modules', '.next', '.git', 'artifacts', 'coverage', '.vercel']);
const EXT = /\.(ts|tsx|css|md|mjs|json)$/;

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    if (SKIP.has(entry)) continue;
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (EXT.test(full)) out.push(full);
  }
  return out;
}

/** Everything below 0x20 except tab, LF, CR and ESC, plus DEL. */
const CONTROL = new RegExp('[\\x00-\\x08\\x0b\\x0c\\x0e-\\x1a\\x1c-\\x1f\\x7f]');

const hits = [];
for (const file of walk('.')) {
  readFileSync(file, 'utf8')
    .split(/\r?\n/)
    .forEach((line, i) => {
      if (!CONTROL.test(line)) return;
      const codes = [...line]
        .filter((c) => CONTROL.test(c))
        .map((c) => `0x${c.charCodeAt(0).toString(16).padStart(2, '0')}`);
      hits.push(`${file}:${i + 1}  ${codes.join(' ')}  ${line.trim().slice(0, 90)}`);
    });
}

console.log(
  hits.length ? `control characters found:\n${hits.join('\n')}` : 'no control characters'
);
process.exit(hits.length ? 1 : 0);
