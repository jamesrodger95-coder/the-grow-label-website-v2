#!/usr/bin/env node
/**
 * One command, every gate, in the order that fails fastest.
 *
 * Each step runs even if an earlier one failed, so a single run reports every
 * problem rather than only the first. The exit code is non-zero if any required
 * step failed.
 */
import { spawnSync } from 'node:child_process';

const only = process.argv.slice(2).filter((a) => !a.startsWith('-'));
const skipSlow = process.argv.includes('--fast');

/** @type {{name: string, cmd: string, args: string[], optional?: boolean, slow?: boolean}[]} */
const STEPS = [
  { name: 'format', cmd: 'pnpm', args: ['exec', 'prettier', '--check', '.'] },
  { name: 'lint', cmd: 'pnpm', args: ['exec', 'eslint', '.', '--max-warnings=0'] },
  { name: 'typecheck', cmd: 'pnpm', args: ['exec', 'tsc', '--noEmit'] },
  { name: 'test', cmd: 'pnpm', args: ['exec', 'vitest', 'run'] },
  { name: 'build', cmd: 'pnpm', args: ['exec', 'next', 'build'], slow: true },
  { name: 'e2e', cmd: 'pnpm', args: ['exec', 'playwright', 'test'], slow: true },
  { name: 'lighthouse', cmd: 'node', args: ['scripts/lighthouse.mjs'], slow: true },
  {
    name: 'audit',
    cmd: 'pnpm',
    args: ['audit', '--prod', '--audit-level', 'high'],
    optional: true,
  },
  { name: 'diff-check', cmd: 'git', args: ['diff', '--check'] },
];

const selected = STEPS.filter((s) => {
  if (only.length > 0) return only.includes(s.name);
  if (skipSlow && s.slow) return false;
  return true;
});

const results = [];
let failed = false;

for (const step of selected) {
  const started = Date.now();
  process.stdout.write(`\n[1m▸ ${step.name}[0m\n`);
  const run = spawnSync(step.cmd, step.args, { stdio: 'inherit', shell: true });
  const seconds = ((Date.now() - started) / 1000).toFixed(1);
  const ok = run.status === 0;
  if (!ok && !step.optional) failed = true;
  results.push({ name: step.name, ok, optional: Boolean(step.optional), seconds });
}

process.stdout.write('\n[1mQuality summary[0m\n');
for (const r of results) {
  const mark = r.ok ? '[32mPASS[0m' : r.optional ? '[33mWARN[0m' : '[31mFAIL[0m';
  process.stdout.write(`  ${mark}  ${r.name.padEnd(12)} ${r.seconds}s\n`);
}

process.exit(failed ? 1 : 0);
