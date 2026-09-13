import { execFileSync } from 'node:child_process';
import { readdirSync, statSync, existsSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Derive a poster still from the first frame of every testimonial recording.
 *
 * Why this exists rather than a hand-made cover image:
 *
 *   - `preload="metadata"` is a hint, and Chrome answers it on files this short
 *     by fetching the whole thing. Measured: 10 MB of video pulled on every
 *     homepage load before anyone pressed play. `preload="none"` fetches zero
 *     but leaves a black rectangle.
 *   - A poster fixes the black rectangle, and the *right* poster is frame zero
 *     of the recording itself — about 30 KB for the same picture the browser
 *     would otherwise have downloaded 3.3 MB to show, and because it is the
 *     first frame the cut to live video on play is invisible.
 *
 * Also enforces faststart, which is the other half of the same problem: with
 * the index at the end of the file the browser cannot show anything or report
 * a duration until it has pulled most of the file. `-c copy` means the remux
 * is lossless — a container reorder, not a re-encode.
 *
 * Run after adding or replacing a recording:
 *
 *   pnpm posters
 *
 * Requires ffmpeg on PATH. Safe to re-run; it overwrites.
 */

const DIR = join('public', 'testimonials');

function ff(args) {
  return execFileSync('ffmpeg', ['-v', 'error', ...args], { stdio: ['ignore', 'pipe', 'pipe'] });
}

/** True when the `moov` atom is near the head, i.e. the file is faststart. */
function isFaststart(file) {
  const head = execFileSync('node', [
    '-e',
    `const fs=require('fs');const b=Buffer.alloc(65536);const fd=fs.openSync(${JSON.stringify(file)},'r');fs.readSync(fd,b,0,65536,0);fs.closeSync(fd);process.stdout.write(String(b.indexOf('moov')));`,
  ]).toString();
  const at = Number(head);
  return at >= 0 && at < 65536;
}

if (!existsSync(DIR)) {
  console.log(`${DIR} does not exist; nothing to do.`);
  process.exit(0);
}

const videos = readdirSync(DIR).filter((f) => f.endsWith('.mp4'));
if (videos.length === 0) {
  console.log('No recordings found.');
  process.exit(0);
}

let remuxed = 0;
for (const name of videos) {
  const file = join(DIR, name);

  if (!isFaststart(file)) {
    // Write beside the original and swap, so a failure leaves the original.
    const tmp = join(DIR, `.${name}.faststart.mp4`);
    ff(['-i', file, '-c', 'copy', '-movflags', '+faststart', '-y', tmp]);
    execFileSync('node', [
      '-e',
      `require('fs').renameSync(${JSON.stringify(tmp)}, ${JSON.stringify(file)})`,
    ]);
    remuxed += 1;
    console.log(`  remuxed for faststart  ${name}`);
  }

  const poster = join(DIR, name.replace(/\.mp4$/, '.jpg'));
  ff(['-i', file, '-ss', '0', '-frames:v', '1', '-vf', 'scale=1280:-2', '-q:v', '6', '-y', poster]);
  const kb = (statSync(poster).size / 1024).toFixed(0);
  console.log(`  poster ${kb.padStart(4)} KB      ${name.replace(/\.mp4$/, '.jpg')}`);
}

console.log(
  `\n${videos.length} recording(s), ${videos.length} poster(s)` +
    (remuxed ? `, ${remuxed} remuxed for faststart` : ', all already faststart')
);
