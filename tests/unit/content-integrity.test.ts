import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { MODULES } from '@/content/modules';
import { INDUSTRIES } from '@/content/industries';
import { STAGE_DEFINITIONS } from '@/content/methodology';
import { VALUE_STAGES } from '@/content/site';

/**
 * Guards the editorial rules that the brief treats as non-negotiable. These are
 * cheap to run and catch the failure mode that matters most: a plausible but
 * unevidenced commercial claim slipping into published copy.
 */

function walk(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (/\.(ts|tsx)$/.test(full)) out.push(full);
  }
  return out;
}

const SOURCE_FILES = [...walk('src/content'), ...walk('src/app'), ...walk('src/components')];

function readAll(): { file: string; text: string }[] {
  return SOURCE_FILES.map((file) => ({ file, text: readFileSync(file, 'utf8') }));
}

const BANNED_PHRASES = [
  'unlock the power',
  'revolutioni',
  'cutting-edge',
  'cutting edge',
  'seamless',
  'game-changing',
  'game changing',
  'supercharge',
  'best-in-class',
  'world-class',
  'next-generation',
  'leverage our',
  'ai-powered',
  'ai powered',
  'powered by ai',
  'turnkey',
  'synergy',
  'paradigm',
];

describe('banned marketing language', () => {
  it('appears nowhere in the source', () => {
    const hits: string[] = [];
    for (const { file, text } of readAll()) {
      const lower = text.toLowerCase();
      for (const phrase of BANNED_PHRASES) {
        if (lower.includes(phrase)) hits.push(`${file}: "${phrase}"`);
      }
    }
    expect(hits).toEqual([]);
  });
});

/**
 * The editorial rule is not "never write the word benchmark" — several pages
 * exist precisely to rule these claims out. The rule is that the claim must not
 * be *asserted*. So a hit only counts when the sentence containing it carries no
 * negation.
 */
const NEGATIONS =
  /\b(no|not|never|none|nothing|neither|nor|cannot|can't|without|rather than|instead of|refuse|avoid|does not|do not|is not|are not)\b/i;

/**
 * The window a negation may live in. Normally the sentence, but a claim being
 * denied is often split across sibling fields of one object entry — a `title`
 * naming the claim and a `detail` refusing it — so the enclosing entry counts
 * too when it is close enough to be the same thought.
 */
function contextAround(text: string, index: number): string {
  const sentenceStart = Math.max(0, text.lastIndexOf('.', index - 1) + 1);
  const dot = text.indexOf('.', index);
  const sentenceEnd = dot === -1 ? text.length : dot + 1;
  const sentence = text.slice(sentenceStart, sentenceEnd);

  const braceStart = text.lastIndexOf('{', index);
  const braceEnd = text.indexOf('}', index);
  if (braceStart === -1 || braceEnd === -1) return sentence;
  if (index - braceStart > 600 || braceEnd - index > 600) return sentence;
  return `${sentence} ${text.slice(braceStart, braceEnd + 1)}`;
}

function assertedHits(text: string, patterns: RegExp[]): string[] {
  const found: string[] = [];
  for (const pattern of patterns) {
    const rx = new RegExp(pattern.source, pattern.flags.includes('g') ? pattern.flags : `${pattern.flags}g`);
    for (const match of text.matchAll(rx)) {
      if (match.index === undefined) continue;
      if (NEGATIONS.test(contextAround(text, match.index))) continue;
      found.push(match[0]);
    }
  }
  return found;
}

describe('unevidenced commercial claims', () => {
  it('asserts no percentage uplift, ROI, benchmark or guarantee', () => {
    const patterns = [
      /\b\d+(\.\d+)?\s*%\s*(more|uplift|increase|growth|improvement|higher|better)/i,
      /\b\d+(\.\d+)?\s*x\s+(more|return|roi|revenue|faster|better)/i,
      /\b(average|typical|clients?|practices?)\s+(see|saw|recover|report)\b/i,
      /\bguarantee(d|s)?\b/i,
      /\bindustry (average|benchmark|standard)\b/i,
    ];
    const hits: string[] = [];
    for (const { file, text } of readAll()) {
      for (const hit of assertedHits(text, patterns)) hits.push(`${file}: ${hit}`);
    }
    expect(hits).toEqual([]);
  });

  it('names no client, logo, testimonial or case study', () => {
    const patterns = [
      /\btestimonial/i,
      /\bcase stud(y|ies)/i,
      /\btrusted by\b/i,
      /\bour clients include\b/i,
      /\bas used by\b/i,
    ];
    const hits: string[] = [];
    for (const { file, text } of readAll()) {
      for (const hit of assertedHits(text, patterns)) hits.push(`${file}: ${hit}`);
    }
    expect(hits).toEqual([]);
  });

  it('still catches an asserted claim if one is introduced', () => {
    const offending = 'Clients recover 40% more revenue. Results are guaranteed.';
    const patterns = [
      /\b\d+(\.\d+)?\s*%\s*(more|uplift|increase)/i,
      /\bguarantee(d|s)?\b/i,
      /\b(clients?)\s+(recover)\b/i,
    ];
    expect(assertedHits(offending, patterns).length).toBeGreaterThan(0);
    // ...and that the same words are allowed when they are being denied.
    expect(
      assertedHits('No result is guaranteed and no industry average is published.', patterns)
    ).toEqual([]);
  });
});

describe('value stages', () => {
  it('are always four, in order, and each carries a confidence basis', () => {
    expect(VALUE_STAGES.map((s) => s.name)).toEqual([
      'Estimated',
      'Booked',
      'Attended',
      'Collected',
    ]);
    for (const stage of VALUE_STAGES) {
      expect(stage.confidence.length).toBeGreaterThan(0);
      expect(stage.definition.length).toBeGreaterThan(20);
    }
  });

  it('are defined consistently on the methodology page', () => {
    expect(STAGE_DEFINITIONS).toHaveLength(4);
    expect(STAGE_DEFINITIONS.map((s) => s.name)).toEqual([
      'Estimated value',
      'Booked value',
      'Attended value',
      'Collected value',
    ]);
    for (const stage of STAGE_DEFINITIONS) {
      expect(stage.caution.length).toBeGreaterThan(20);
      expect(stage.promotedBy.length).toBeGreaterThan(5);
    }
  });

  it('describes only collected value as revenue', () => {
    const collected = STAGE_DEFINITIONS.find((s) => s.name === 'Collected value');
    expect(collected?.body.toLowerCase()).toContain('revenue');
    for (const stage of STAGE_DEFINITIONS.filter((s) => s.name !== 'Collected value')) {
      expect(stage.body.toLowerCase()).not.toContain('is revenue');
    }
  });
});

describe('module definitions', () => {
  it('cover every required part of the module page template', () => {
    expect(MODULES).toHaveLength(4);
    for (const module of MODULES) {
      expect(module.problem.body.length).toBeGreaterThan(0);
      expect(module.monitors.length).toBeGreaterThan(2);
      expect(module.actions.length).toBeGreaterThan(2);
      expect(module.clientControls.length).toBeGreaterThan(2);
      expect(module.escalation.length).toBeGreaterThan(2);
      expect(module.stages).toHaveLength(4);
      expect(module.dataRequired.length).toBeGreaterThan(1);
      expect(module.dataNotRequired.length).toBeGreaterThan(0);
      expect(module.evidence.length).toBeGreaterThan(1);
      expect(module.outcome.length).toBeGreaterThan(0);
      expect(module.cta.href).toBe('/contact');
    }
  });

  it('maps every module against all four value stages', () => {
    const names = VALUE_STAGES.map((s) => s.name);
    for (const module of MODULES) {
      expect(module.stages.map((s) => s.stage)).toEqual(names);
    }
  });

  it('states a data boundary that excludes clinical records', () => {
    for (const module of MODULES) {
      const excluded = module.dataNotRequired.join(' ').toLowerCase();
      expect(excluded).toMatch(/clinical|treatment|notes|record/);
    }
  });
});

describe('industry pages', () => {
  it('are genuinely different, not mirrored', () => {
    expect(INDUSTRIES).toHaveLength(2);
    const [vet, dental] = INDUSTRIES;
    expect(vet && dental).toBeTruthy();
    if (!vet || !dental) return;

    // Distinct signature devices.
    expect(vet.feature.kind).not.toBe(dental.feature.kind);

    // No workflow title is shared between the two sectors.
    const vetTitles = new Set(vet.workflows.map((w) => w.title.toLowerCase()));
    const shared = dental.workflows.filter((w) => vetTitles.has(w.title.toLowerCase()));
    expect(shared).toEqual([]);

    // Distinct thesis copy.
    expect(vet.thesis.body[0]).not.toBe(dental.thesis.body[0]);
  });

  it('states a no-clinical-claim boundary on both', () => {
    for (const industry of INDUSTRIES) {
      expect(industry.boundaries.join(' ').toLowerCase()).toContain('clinical');
      expect(industry.workflows.length).toBeGreaterThanOrEqual(6);
    }
  });
});

describe('typography constraints', () => {
  it('does not load Inter or Poppins', () => {
    const fonts = readFileSync('src/app/fonts.ts', 'utf8');
    expect(fonts).not.toMatch(/\bInter\b/);
    expect(fonts).not.toMatch(/\bPoppins\b/);
  });
});
