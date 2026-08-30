// Restart the production server on a fixed port, waiting until it answers.
import { spawn, execSync } from 'node:child_process';

const port = process.argv[2] ?? '3112';

try {
  const out = execSync(
    `powershell -NoProfile -Command "Get-NetTCPConnection -LocalPort ${port} -State Listen -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique"`,
    { encoding: 'utf8' }
  ).trim();
  for (const pid of out.split(/\s+/).filter(Boolean)) {
    try {
      process.kill(Number(pid));
    } catch {
      /* already gone */
    }
  }
} catch {
  /* nothing listening */
}

const child = spawn('pnpm', ['start', '-p', port], {
  detached: true,
  stdio: 'ignore',
  shell: true,
});
child.unref();

const deadline = Date.now() + 60000;
while (Date.now() < deadline) {
  try {
    const res = await fetch(`http://localhost:${port}/`);
    if (res.ok) {
      console.log(`server ready on ${port}`);
      process.exit(0);
    }
  } catch {
    /* not up yet */
  }
  await new Promise((r) => setTimeout(r, 1000));
}
console.error('server did not become ready');
process.exit(1);
