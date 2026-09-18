import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, sep } from 'node:path';
import { describe, expect, it } from 'vitest';
import { MODULES } from '@/content/modules';
import { INDUSTRIES } from '@/content/industries';
import { STAGE_DEFINITIONS } from '@/content/methodology';
import { PRIMARY_NAV, VALUE_STAGES } from '@/content/site';
import { TEAM, VIDEO_SECTION } from '@/content/proof';
import {
  CASE_STUDIES,
  ILLUSTRATIVE,
  ILLUSTRATIVE_METRICS,
  ILLUSTRATIVE_STAGES,
} from '@/content/illustrative';
import { TESTIMONIALS, VIDEO_TESTIMONIALS } from '@/content/testimonials';
import { FAQ_GROUPS, SECTOR_FAQ } from '@/content/faq';

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

/**
 * The one file allowed to hold an invented figure, quotation or organisation.
 * Everything rendered from it carries a visible illustrative label; the tests
 * below enforce both halves of that arrangement.
 */
const FIXTURE = join('src', 'content', 'illustrative.ts');

/**
 * Real, attributed, released client testimonials, including the figures they
 * quote. A separate file from the fixture on purpose: the fixture's rule is
 * "everything in here is invented and must be labelled", and this file's rule
 * is the opposite one. Its own guard is `describe('client testimonials')`
 * below.
 */
const CLIENT_EVIDENCE = join('src', 'content', 'testimonials.ts');

/**
 * WHAT THIS FILE NO LONGER GUARDS, AND WHY
 *
 * Two assertions were removed at the owner's direction when the revenue
 * recovery calculator was built, because the calculator cannot exist under
 * either of them:
 *
 *   1. CURRENCY CONTAINMENT. A test asserted that no `$`-prefixed figure
 *      appeared in published source outside `illustrative.ts` and
 *      `testimonials.ts`. The calculator prices bands, formats a modelled
 *      estimate and prints a coefficient table, all at runtime. The intent
 *      behind the rule is met a different way there: `lib/calculator/model.ts`
 *      derives every label from the same bounds the arithmetic uses, so no
 *      figure is inlined into a component and none is unreviewed. It is a
 *      convention now rather than a gate — the gate is gone.
 *
 *   2. THE GUARANTEE GREP. `\bguarantee(d|s)?\b` used to fail unless the
 *      sentence around it carried a negation. The assessment carries a
 *      guarantee and the report states it, so the pattern was dropped from the
 *      claims test below. The published limitation on `/platform` and `/terms`
 *      — that no RESULT is guaranteed — is unaffected and still true; nothing
 *      enforces it automatically any more.
 *
 * Everything else here is intact: the four value stages, the real team, the
 * attribution and qualifier rules on the released client testimonials, the
 * typography constraints and the navigation guards.
 */

function readAll(): { file: string; text: string }[] {
  return SOURCE_FILES.map((file) => ({ file, text: readFileSync(file, 'utf8') }));
}

/** Everything except the illustrative fixture. */
function readAllExceptFixture(): { file: string; text: string }[] {
  return readAll().filter(({ file }) => file !== FIXTURE);
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
  it('asserts no percentage uplift, ROI or benchmark', () => {
    // The guarantee pattern that used to sit in this list was removed at the
    // owner's direction; see the note at the top of the file.
    const patterns = [
      /\b\d+(\.\d+)?\s*%\s*(more|uplift|increase|growth|improvement|higher|better)/i,
      /\b\d+(\.\d+)?\s*x\s+(more|return|roi|revenue|faster|better)/i,
      /\b(average|typical|clients?|practices?)\s+(see|saw|recover|report)\b/i,
      /\bindustry (average|benchmark|standard)\b/i,
    ];
    const hits: string[] = [];
    for (const { file, text } of readAll()) {
      for (const hit of assertedHits(text, patterns)) hits.push(`${file}: ${hit}`);
    }
    expect(hits).toEqual([]);
  });

  it('names no client anywhere', () => {
    const patterns = [/\btrusted by\b/i, /\bour clients include\b/i, /\bas used by\b/i];
    const hits: string[] = [];
    for (const { file, text } of readAll()) {
      for (const hit of assertedHits(text, patterns)) hits.push(`${file}: ${hit}`);
    }
    expect(hits).toEqual([]);
  });

  /**
   * The on-page badges are gone.
   *
   * They were the second half of a two-part arrangement: invented content was
   * allowed on the site as long as every surface rendering it said so. The
   * badges have been removed at the owner's direction, so the containment half
   * is now carrying the whole load and the tests below tighten around it —
   * every figure stays inside a reviewed content file, the fabricated studies
   * stay out of the index and out of the sitemap, and `illustrative` stays
   * true on every entry so those two guards keep working.
   *
   * If a study is ever presented as real evidence, `illustrative` is what has
   * to change, and changing it is what puts the study into the sitemap. That
   * is the decision point, and it is one line.
   */
  it('keeps the labels available even though no surface renders one', () => {
    expect(ILLUSTRATIVE.tag.toLowerCase()).toContain('illustrative');
    expect(ILLUSTRATIVE.caseTag.toLowerCase()).toContain('placeholder');
    expect(ILLUSTRATIVE.notice.toLowerCase()).toContain('not client results');
  });

  it('still routes every fixture figure through a reviewed content file', () => {
    const consumers = readAllExceptFixture().filter(({ text }) =>
      /from '@\/content\/illustrative'/.test(text)
    );
    expect(consumers.length).toBeGreaterThan(3);
    // Nothing imports the fixture except pages and the sitemap — no component
    // may reach around it to define a figure of its own.
    for (const { file } of consumers) {
      expect(file.startsWith(`src${sep}app`) || file.startsWith(`src${sep}components`)).toBe(true);
    }
  });

  it('flags every fabricated entry as illustrative', () => {
    expect(CASE_STUDIES.length).toBeGreaterThan(0);
    for (const entry of CASE_STUDIES) {
      expect(entry.illustrative).toBe(true);
    }
  });

  /**
   * A published result means nothing without the period it covers. Every
   * fixture figure therefore travels with one, and the stated engagement is on
   * the page beside the numbers rather than in a footnote.
   */
  it('gives every set of figures a stated period and basis', () => {
    for (const stage of ILLUSTRATIVE_STAGES) {
      expect(stage.value).toMatch(/^\$[\d,]+$/);
      expect(stage.basis.length).toBeGreaterThan(20);
    }
    expect(ILLUSTRATIVE_STAGES.map((s) => s.stage)).toEqual([
      'Estimated',
      'Booked',
      'Attended',
      'Collected',
    ]);

    for (const metric of ILLUSTRATIVE_METRICS) {
      expect(metric.basis.length).toBeGreaterThan(20);
      expect(metric.href.startsWith('/')).toBe(true);
    }

    for (const study of CASE_STUDIES) {
      expect(study.period.toLowerCase()).toMatch(/month|week|year/);
      expect(study.stages.map((s) => s.stage)).toEqual([
        'Estimated',
        'Booked',
        'Attended',
        'Collected',
      ]);
      // A study that only lists what worked is a marketing document.
      expect(study.caveats.length).toBeGreaterThan(1);
    }
  });

  /** Case-study figures never repeat between studies. */
  it('varies the figures rather than reusing one set', () => {
    const collected = CASE_STUDIES.map((s) => s.stages[3]?.value);
    expect(new Set(collected).size).toBe(CASE_STUDIES.length);
  });

  /**
   * The team is real colleagues, so the guard runs the opposite way to the one
   * on the fixture: every member must be a named person with a reserved
   * portrait path, and none of them may carry a placeholder string where a
   * name should be. Inventing a colleague is not the same kind of placeholder
   * as inventing an example, and this is what stops one becoming the other.
   */
  it('names a real person for every member of the team', () => {
    expect(TEAM.members.length).toBeGreaterThan(0);
    for (const member of TEAM.members) {
      expect(member.name.length).toBeGreaterThan(2);
      // Two words at minimum, so "TBC" or "Name to follow" cannot pass as one.
      expect(member.name.trim().split(/\s+/).length).toBeGreaterThanOrEqual(2);
      expect(member.name.toLowerCase()).not.toMatch(/follow|tbc|placeholder|pending/);
      expect(member.role.length).toBeGreaterThan(2);
      expect(member.intro.length).toBeGreaterThan(40);
      // The portrait slot is reserved whether or not the file exists yet, and
      // the filename is derived from the id so the README stays true.
      expect(member.photo).toBe(`/team/${member.id}.jpg`);
    }
    expect(new Set(TEAM.members.map((m) => m.id)).size).toBe(TEAM.members.length);
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

/**
 * Real client testimonials carry the opposite obligations to the fixture.
 *
 * The fixture's danger is that something invented is read as evidence. This
 * file's danger is the reverse: that a real, named outcome is quietly turned
 * into a general claim — an average, a rate, a "clients typically". These
 * tests hold the line between "this named person recovered this, over this
 * period" and "this is what you will get".
 */
describe('client testimonials', () => {
  it('attributes every quotation to a named person and a role', () => {
    expect(TESTIMONIALS.length).toBeGreaterThanOrEqual(4);
    for (const item of TESTIMONIALS) {
      expect(item.name.trim().split(/\s+/).length).toBeGreaterThanOrEqual(2);
      expect(item.role.length).toBeGreaterThan(2);
      expect(item.quote.length).toBeGreaterThan(40);
      // An unattributed testimonial carrying a real claim is the one thing
      // worse than an invented one, because nothing on the card is checkable.
      expect(item.name.toLowerCase()).not.toMatch(/anonymous|a client|withheld/);
    }
    expect(new Set(TESTIMONIALS.map((t) => t.quote)).size).toBe(TESTIMONIALS.length);
    expect(new Set(TESTIMONIALS.map((t) => t.id)).size).toBe(TESTIMONIALS.length);
  });

  it('gives every video figure a qualifier, a basis and a recording', () => {
    expect(VIDEO_TESTIMONIALS.length).toBeGreaterThan(0);
    for (const item of VIDEO_TESTIMONIALS) {
      expect(item.name.trim().split(/\s+/).length).toBeGreaterThanOrEqual(2);
      // A recovery figure with nothing attached is not a result. The qualifier
      // carries the window, or the count where the client reported one instead
      // of a window, and is a separate field precisely so a redesign cannot
      // drop it. The verb that completes the title is separate for the same
      // reason: "$9,000" alone says nothing about what happened to it.
      expect(item.qualifier.length).toBeGreaterThan(2);
      expect(item.outcome.length).toBeGreaterThan(2);
      expect(item.detail.length).toBeGreaterThan(20);
      expect(item.video).toMatch(/^\/testimonials\/[a-z-]+\.mp4$/);
    }
    expect(new Set(VIDEO_TESTIMONIALS.map((v) => v.video)).size).toBe(VIDEO_TESTIMONIALS.length);
  });

  /**
   * A conversion is never silent. There is no converted figure on the site at
   * present — the one there used to be went when the three video figures were
   * restated in the currency the clients reported them in — so this passes on
   * an empty set. It exists for the next one: publish a figure in a currency
   * it was not reported in and the rate, the working and both pegs have to be
   * in the content file's own header before this goes green again.
   */
  it('shows its working for any converted figure', () => {
    const source = readFileSync(CLIENT_EVIDENCE, 'utf8');
    const converted = VIDEO_TESTIMONIALS.filter((v) =>
      /\b(SAR|AED|DHS)\b/.test(`${v.figure} ${v.detail}`)
    );
    for (const item of converted) {
      // The arithmetic belongs in the file header, in full, with the peg named.
      expect(source).toMatch(/÷\s*[\d.]+\s*=/);
      expect(source).toMatch(new RegExp(`${item.name.split(' ').pop()}`));
    }
  });

  /**
   * The figures are six named outcomes, not a rate. This catches the sentence
   * that would turn them into one, in the file itself and in the copy that
   * frames the section.
   */
  it('never generalises a named outcome into an expectation', () => {
    const text = [
      readFileSync(CLIENT_EVIDENCE, 'utf8'),
      readFileSync(join('src', 'content', 'proof.ts'), 'utf8'),
    ].join('\n');
    const patterns = [
      /\b(typical|typically|on average|average of|expect to recover|you will recover)\b/i,
      /\bclients? (typically|usually|generally)\b/i,
      /\bup to [£$]\s?\d/i,
    ];
    expect(assertedHits(text, patterns)).toEqual([]);
  });

  /** The section framing has to say, in the page's own words, what these are. */
  it('states on the page that no result is typical', () => {
    expect(VIDEO_SECTION.foot.toLowerCase()).toMatch(/not (an )?average|no result is typical/);
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

  it('are defined consistently wherever the stages are published', () => {
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

describe('navigation', () => {
  /**
   * Methodology and Insights were nav items that asked the reader to guess.
   * The methodology content now lives on the platform page, beside the
   * reporting it governs.
   */
  it('offers no destination the reader has to decode', () => {
    const labels = PRIMARY_NAV.map((link) => link.label);
    expect(labels).not.toContain('Methodology');
    expect(labels).not.toContain('Insights');
    expect(labels).toEqual([
      'Platform',
      'Modules',
      'Veterinary',
      'Dental',
      'Results',
      'Case studies',
      'About',
    ]);
  });

  it('points every primary item at a route or an anchor that exists', () => {
    const routes = new Set([
      '/platform',
      '/modules',
      '/industries/veterinary',
      '/industries/dental',
      '/case-studies',
      '/about',
    ]);
    const anchors = new Set(['results']);
    for (const link of PRIMARY_NAV) {
      if (link.href.startsWith('/#')) {
        expect(anchors.has(link.href.slice(2))).toBe(true);
      } else {
        expect(routes.has(link.href)).toBe(true);
      }
    }
  });

  /**
   * An anchored nav item needs the id it names to be rendered on the homepage —
   * rendered, not merely present in a file. The case-study section is commented
   * out of `page.tsx` while the studies are placeholders, so `#case-studies` is
   * no longer an anchor anywhere and the nav item points at the page instead.
   * This reads the route file so that stays true.
   */
  it('renders the ids the anchored nav items point at', () => {
    const page = readFileSync(join('src', 'app', 'page.tsx'), 'utf8');
    const mounted = ['Results', 'Team'].filter((name) =>
      new RegExp(`^\\s*<${name} />`, 'm').test(page)
    );
    expect(mounted).toEqual(['Results', 'Team']);

    const homeSources = ['src/components/home/Results.tsx', 'src/components/home/Team.tsx']
      .map((file) => readFileSync(file, 'utf8'))
      .join('\n');
    expect(homeSources).toContain('id="results"');
    expect(homeSources).toContain('id="team"');

    for (const link of PRIMARY_NAV.filter((l) => l.href.startsWith('/#'))) {
      expect(homeSources).toContain(`id="${link.href.slice(2)}"`);
    }
  });
});

describe('frequently asked questions', () => {
  it('answers the commercial questions rather than avoiding them', () => {
    const all = FAQ_GROUPS.flatMap((g) => g.items);
    expect(all.length).toBeGreaterThanOrEqual(8);

    const questions = all.map((item) => item.q.toLowerCase()).join(' ');
    // The two that are usually deferred to a proposal.
    expect(questions).toMatch(/cost|priced/);
    expect(questions).toMatch(/minimum term|term\b/);

    for (const item of all) {
      expect(item.q.endsWith('?')).toBe(true);
      expect(item.a.join(' ').length).toBeGreaterThan(80);
    }
  });

  it('carries a distinct set for each sector', () => {
    const vet = SECTOR_FAQ.veterinary.map((i) => i.q);
    const dental = SECTOR_FAQ.dental.map((i) => i.q);
    expect(vet.length).toBeGreaterThanOrEqual(3);
    expect(dental.length).toBeGreaterThanOrEqual(3);
    expect(vet.filter((q) => dental.includes(q))).toEqual([]);
  });

  it('restates the clinical boundary rather than softening it', () => {
    const text = [...FAQ_GROUPS.flatMap((g) => g.items), ...SECTOR_FAQ.veterinary]
      .flatMap((item) => item.a)
      .join(' ')
      .toLowerCase();
    expect(text).toMatch(/triages?, assesses?, advises?|no module triages/);
  });
});

describe('case studies', () => {
  it('covers both sectors and links each card to a page that exists', () => {
    const sectors = new Set(CASE_STUDIES.map((s) => s.sector));
    expect([...sectors].sort()).toEqual(['Dental', 'Veterinary']);

    for (const study of CASE_STUDIES) {
      expect(study.slug).toMatch(/^[a-z0-9-]+$/);
      expect(['veterinary', 'dental']).toContain(study.sectorSlug);
      expect(study.headline.length).toBe(2);
      expect(study.metrics.length).toBeGreaterThanOrEqual(3);
    }
    expect(new Set(CASE_STUDIES.map((s) => s.slug)).size).toBe(CASE_STUDIES.length);
  });

  /** A fabricated study must not be indexed as though it were evidence. */
  it('keeps placeholder studies out of the index and the sitemap', () => {
    const page = readFileSync(join('src', 'app', 'case-studies', '[slug]', 'page.tsx'), 'utf8');
    expect(page).toMatch(/robots:\s*study\.illustrative/);

    const sitemap = readFileSync(join('src', 'app', 'sitemap.ts'), 'utf8');
    expect(sitemap).toMatch(/filter\(\(s\) => !s\.illustrative\)/);
  });
});

describe('template artefacts', () => {
  /**
   * "SECTOR 01 / 02" and "§ 03 / 06" told the reader which numbered part of a
   * template they had landed on. Nothing on the site is a numbered sequence
   * except the four value stages, which are numbered because the order is the
   * meaning.
   */
  it('shows no section counter in any rendered string', () => {
    const hits: string[] = [];
    for (const { file, text } of readAll()) {
      // Ignore code comments; only rendered strings matter.
      const rendered = text.replace(/\{\/\*[\s\S]*?\*\/\}/g, '').replace(/\/\*[\s\S]*?\*\//g, '');
      for (const match of rendered.matchAll(/§\s*\d+|\bSector \d+\s*\/|\d+\s*\/\s*0\d\b/gi)) {
        hits.push(`${file}: ${match[0]}`);
      }
    }
    expect(hits).toEqual([]);
  });
});
