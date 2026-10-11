import 'server-only';

import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { WORK, type WorkEntry } from '@/content/studio';

/**
 * What media the /AI page actually has, read from public/ at build time.
 *
 * Media is dropped in, not wired up, exactly as the team portraits and the
 * testimonial recordings are: a file that is present is used, and one that is
 * absent leaves a reserved frame. There is no flag and no list to keep in step
 * with the folder. docs/media/studio.md says what to name things.
 */

const PUBLIC = join(process.cwd(), 'public');
const REEL_DIR = join(PUBLIC, 'ai', 'reel');
const WORK_DIR = join(PUBLIC, 'ai', 'work');

/** Reel tiles the hero is composed for. Fewer clips than this are cycled. */
export const REEL_TILES = 36;

/**
 * Shapes the reel falls back to when a filename does not state one. Mixed on
 * purpose: the wall is meant to read as many different pieces of work.
 */
const FALLBACK_RATIOS = [9 / 16, 1, 4 / 5, 16 / 9, 3 / 4, 1, 9 / 16, 4 / 5, 16 / 9];

/** `-9x16`, `_4x5`, `1x1` and so on, anywhere in the stem. */
const RATIO_IN_NAME = /(?:^|[-_ .])(\d{1,2})x(\d{1,2})(?=$|[-_ .])/i;

export type ReelTile =
  | { kind: 'clip'; src: string; poster?: string; ratio: number }
  | { kind: 'slot'; ratio: number; number: string; shape: string };

export function ratioFromName(stem: string): number | undefined {
  const m = RATIO_IN_NAME.exec(stem);
  if (!m) return undefined;
  const w = Number(m[1]);
  const h = Number(m[2]);
  return w > 0 && h > 0 ? w / h : undefined;
}

function ratioLabel(ratio: number): string {
  const known: [number, string][] = [
    [9 / 16, '9:16'],
    [3 / 4, '3:4'],
    [4 / 5, '4:5'],
    [1, '1:1'],
    [16 / 9, '16:9'],
  ];
  return known.reduce((a, b) => (Math.abs(b[0] - ratio) < Math.abs(a[0] - ratio) ? b : a))[1];
}

/**
 * Every clip in public/ai/reel, in filename order, then cycled to fill the
 * wall. With no clips at all the wall is made of reserved frames instead, each
 * numbered, so it is obvious what is missing and where it goes.
 */
export function reelTiles(): { tiles: ReelTile[]; live: boolean } {
  const names = existsSync(REEL_DIR)
    ? readdirSync(REEL_DIR)
        .filter((f) => /\.(mp4|webm)$/i.test(f) && !f.startsWith('.'))
        .sort()
    : [];

  if (names.length === 0) {
    const tiles: ReelTile[] = Array.from({ length: REEL_TILES }, (_, i) => {
      const ratio = FALLBACK_RATIOS[i % FALLBACK_RATIOS.length]!;
      return {
        kind: 'slot',
        ratio,
        number: String(i + 1).padStart(2, '0'),
        shape: ratioLabel(ratio),
      };
    });
    return { tiles, live: false };
  }

  const clips = names.map((name, i) => {
    const stem = name.replace(/\.[^.]+$/, '');
    const poster = ['jpg', 'webp', 'png']
      .map((ext) => `${stem}.${ext}`)
      .find((file) => existsSync(join(REEL_DIR, file)));
    return {
      kind: 'clip' as const,
      src: `/ai/reel/${name}`,
      poster: poster ? `/ai/reel/${poster}` : undefined,
      ratio: ratioFromName(stem) ?? FALLBACK_RATIOS[i % FALLBACK_RATIOS.length]!,
    };
  });

  const count = Math.max(REEL_TILES, clips.length);
  return { tiles: Array.from({ length: count }, (_, i) => clips[i % clips.length]!), live: true };
}

export type WorkItem = WorkEntry & {
  /** Present only when the file is in public/ai/work/. */
  src?: string;
  poster?: string;
};

function firstExisting(stem: string, exts: string[]): string | undefined {
  const hit = exts.map((ext) => `${stem}.${ext}`).find((f) => existsSync(join(WORK_DIR, f)));
  return hit ? `/ai/work/${hit}` : undefined;
}

/** The portfolio manifest, with each entry's file resolved if it exists. */
export function workItems(): WorkItem[] {
  return WORK.map((entry) => {
    if (entry.media === 'video') {
      const src = firstExisting(entry.id, ['mp4', 'webm']);
      return {
        ...entry,
        src,
        poster: src ? firstExisting(entry.id, ['jpg', 'webp', 'png']) : undefined,
      };
    }
    return { ...entry, src: firstExisting(entry.id, ['webp', 'jpg', 'png']) };
  });
}
