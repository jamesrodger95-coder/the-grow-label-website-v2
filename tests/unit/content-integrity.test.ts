import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { MODULES } from '@/content/modules';
import { INDUSTRIES } from '@/content/industries';
import { STAGE_DEFINITIONS } from '@/content/methodology';
import { VALUE_STAGES } from '@/content/site';
import {
  CASE_STUDIES,
  PLACEHOLDER_NOTE,
  RESULTS,
  TEAM,
  TESTIMONIALS,
  VIDEO_TESTIMONIALS,
} from '@/content/proof';

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
    const rx = new RegExp(
      pattern.source,
      pattern.flags.includes('g') ? pattern.flags : `${pattern.flags}g`
    );
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

  /**
   * The site now has testimonial, case-study and team sections, so the rule is
   * no longer "never write the word". It is that every one of those slots is an
   * unmistakable placeholder: no real person, organisation or engagement is
   * named anywhere until one is evidenced and approved.
   */
  it('names no client, and every proof slot stays a labelled placeholder', () => {
    const patterns = [/trusted by/i, /our clients include/i, /as used by/i];
    const hits: string[] = [];
    for (const { file, text } of readAll()) {
      for (const hit of assertedHits(text, patterns)) hits.push(`${file}: ${hit}`);
    }
    expect(hits).toEqual([]);

    const attributed = [...TESTIMONIALS, ...VIDEO_TESTIMONIALS];
    expect(attributed.length).toBeGreaterThan(0);
    for (const entry of attributed) {
      expect(entry.name).toBe('Name to be confirmed');
      expect(entry.org).toBe('Client organisation');
    }

    expect(TEAM.members.length).toBeGreaterThan(0);
    for (const member of TEAM.members) {
      expect(member.name).toBe('Name to be confirmed');
      expect(member.intro.toLowerCase()).toContain('placeholder');
    }

    for (const quote of TESTIMONIALS) {
      expect(quote.quote.toLowerCase()).toContain('placeholder');
    }
  });

  /**
   * Results carry no figure at all. The reserved slot is the point: a number
   * added here without a reporting period would be an invented client result.
   */
  it('publishes no result figure', () => {
    for (const card of RESULTS.cards) {
      expect(Object.keys(card)).not.toContain('value');
      expect(JSON.stringify(card)).not.toMatch(/[£$]s?d/);
    }
    expect(RESULTS.note.toLowerCase()).toContain('reporting period');
    expect(PLACEHOLDER_NOTE.toLowerCase()).toContain('placeholder');
  });

  /** Case studies are shaped, not claimed: no outcome figure on a card. */
  it('states no outcome on a case study card', () => {
    for (const study of CASE_STUDIES) {
      expect(`${study.title} ${study.summary}`).not.toMatch(/d+(.d+)?s*%|[£$]s?d/);
    }
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
    for (const mod of MODULES) {
      expect(mod.problem.body.length).toBeGreaterThan(0);
      expect(mod.monitors.length).toBeGreaterThan(2);
      expect(mod.actions.length).toBeGreaterThan(2);
      expect(mod.clientControls.length).toBeGreaterThan(2);
      expect(mod.escalation.length).toBeGreaterThan(2);
      expect(mod.stages).toHaveLength(4);
      expect(mod.dataRequired.length).toBeGreaterThan(1);
      expect(mod.dataNotRequired.length).toBeGreaterThan(0);
      expect(mod.evidence.length).toBeGreaterThan(1);
      expect(mod.outcome.length).toBeGreaterThan(0);
      expect(mod.cta.href).toBe('/contact');
    }
  });

  it('maps every module against all four value stages', () => {
    const names = VALUE_STAGES.map((s) => s.name);
    for (const mod of MODULES) {
      expect(mod.stages.map((s) => s.stage)).toEqual(names);
    }
  });

  it('states a data boundary that excludes clinical records', () => {
    for (const mod of MODULES) {
      const excluded = mod.dataNotRequired.join(' ').toLowerCase();
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
  /**
   * The families every AI-authored site reaches for. Naming them in a test is
   * the only thing that reliably keeps them out.
   */
  it('loads none of the default-looking families', () => {
    const sources = [
      readFileSync('src/app/fonts.ts', 'utf8'),
      readFileSync('src/styles/tokens.css', 'utf8'),
    ].join('\n');
    const banned = [/\bInter\b/, /\bPoppins\b/, /\bGeist\b/, /\bManrope\b/, /\bDM[ _]Sans\b/];
    for (const family of banned) {
      expect(sources).not.toMatch(family);
    }
  });

  /**
   * Hierarchy comes from weight, size and tracking, not from a second family.
   * The display, sans and mono tokens still exist so component CSS reads by
   * role rather than by family — but every one of them resolves to the same
   * face, and a second import would break this.
   */
  it('resolves every type role to one family', () => {
    const tokens = readFileSync('src/styles/tokens.css', 'utf8');
    const roles = [...tokens.matchAll(/--gl-font-([\w-]+):\s*([^;]+);/g)];
    expect(roles.length).toBeGreaterThan(0);
    for (const match of roles) {
      const role = match[1] ?? '';
      const value = (match[2] ?? '').trim();
      expect(`${role}: ${value}`).toBe(`${role}: var(--gl-font)`);
    }
  });
});
