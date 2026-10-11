import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import * as studio from '@/content/studio';
import { WORK } from '@/content/studio';
import { normaliseProductUrl } from '@/lib/sample-schema';

/**
 * The /AI page's guards.
 *
 * The page shows work and nothing else, so the two things that can go wrong
 * are a piece going live without saying what it is or who it was for, and a
 * line of copy drifting into a result or an em dash.
 */

const WORK_DIR = join('public', 'ai', 'work');

function present(id: string, media: 'video' | 'image'): boolean {
  const exts = media === 'video' ? ['mp4', 'webm'] : ['webp', 'jpg', 'png'];
  return exts.some((ext) => existsSync(join(WORK_DIR, `${id}.${ext}`)));
}

/** Every string reachable from the module's exports. */
function strings(value: unknown, out: string[] = []): string[] {
  if (typeof value === 'string') out.push(value);
  else if (Array.isArray(value)) value.forEach((v) => strings(v, out));
  else if (value && typeof value === 'object') Object.values(value).forEach((v) => strings(v, out));
  return out;
}

describe('the /AI portfolio', () => {
  it('labels every piece whose file is present', () => {
    for (const entry of WORK) {
      if (!present(entry.id, entry.media)) continue;
      expect(entry.title, `${entry.id} needs a title`).toBeTruthy();
      expect(entry.credit, `${entry.id} needs a credit: client or concept`).toBeTruthy();
      if (entry.credit?.kind === 'client') {
        expect(entry.credit.brand.trim().length).toBeGreaterThan(1);
      }
    }
  });

  it('keeps ids unique and matching the file convention', () => {
    expect(new Set(WORK.map((w) => w.id)).size).toBe(WORK.length);
    for (const entry of WORK) expect(entry.id).toMatch(/^w\d{2}$/);
  });

  it('covers every treatment the page describes', () => {
    const treatments = new Set(WORK.map((w) => w.treatment));
    for (const item of studio.STUDIO_MAKE.items) {
      expect(item.treatments.some((t) => treatments.has(t))).toBe(true);
    }
  });
});

describe('the /AI copy', () => {
  const copy = strings(studio).join('\n');

  it('uses no em dashes', () => {
    expect(copy).not.toMatch(/—/);
  });

  it('asserts no result the work has not been shown to produce', () => {
    expect(copy).not.toMatch(/\d+(\.\d+)?\s*(%|x\b)/i);
    expect(copy.toLowerCase()).not.toMatch(/\b(roas|conversion rate|uplift|guarantee)/);
  });

  it('says plainly that the sample is free and needs no purchase', () => {
    expect(copy).toMatch(/no purchase required/i);
  });

  it('keeps the page source free of em dashes too', () => {
    for (const file of [
      'src/components/studio/Sections.tsx',
      'src/components/studio/SampleForm.tsx',
    ]) {
      const jsx = readFileSync(file, 'utf8').replace(/\/\*[\s\S]*?\*\/|\/\/.*$/gm, '');
      expect(jsx, file).not.toMatch(/—/);
    }
  });
});

describe('product URL normalisation', () => {
  it('adds https to a bare address', () => {
    expect(normaliseProductUrl('shop.example.com/p/1')).toBe('https://shop.example.com/p/1');
  });

  it('keeps a full address as it is', () => {
    expect(normaliseProductUrl('http://example.co.uk/x?y=1')).toBe('http://example.co.uk/x?y=1');
  });

  it('refuses anything that is not a web address', () => {
    expect(normaliseProductUrl('')).toBeNull();
    expect(normaliseProductUrl('not a url')).toBeNull();
    expect(normaliseProductUrl('localhost/thing')).toBeNull();
    expect(normaliseProductUrl('javascript:alert(1)')).toBeNull();
    expect(normaliseProductUrl('ftp://example.com/file')).toBeNull();
  });
});
