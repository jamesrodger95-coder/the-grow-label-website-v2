import fontkit from '@pdf-lib/fontkit';
import { PDFDocument, rgb, type PDFFont, type PDFPage, type RGB } from 'pdf-lib';

import {
  ASSESSMENT_GUARANTEE,
  CALCULATOR_MODULES,
  QUESTIONS,
  REPORT,
  answerLabel,
} from '@/content/calculator';
import {
  COEFFICIENTS,
  DEFAULTS,
  RECORD_THRESHOLD,
  WEEKS_PER_YEAR,
  count,
  money,
  percent,
  roundDownHundred,
  type Answers,
  type Estimate,
} from './model';

/**
 * The report.
 *
 * Generated in the browser, on request, and never on the critical path: this
 * module is behind a dynamic import in `ReportDownload`, and everything it
 * needs — including the two font files — is fetched only once somebody has
 * asked for the document.
 *
 * It is set in the site's own typeface, on the site's ground, in the site's
 * purple, because it is a sales asset that will be read next to the website and
 * a generic PDF would say more about us than the copy does. Everything else is
 * restraint: no tint panels behind body copy, no decoration, no chart that is
 * not carrying a number.
 *
 * The coefficients printed on the methodology pages come from `model.ts`
 * itself, so the document cannot state a rate the arithmetic did not use.
 */

export type ReportInput = {
  answers: Answers;
  estimate: Estimate;
  practiceName?: string;
  /** Reads a site-absolute asset path. See `AssetLoader`. */
  load: AssetLoader;
};

/* -------------------------------------------------------------------------- */
/* Page geometry and palette                                                  */
/* -------------------------------------------------------------------------- */

const PAGE_W = 595.28; // A4 portrait, in points.
const PAGE_H = 841.89;
const MARGIN = 54;
const CONTENT_W = PAGE_W - MARGIN * 2;

/** Straight from tokens.css. Any change there belongs here too. */
function hex(value: string): RGB {
  const n = parseInt(value.replace('#', ''), 16);
  return rgb(((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255);
}

const INK = hex('#0c0c0e');
const GRAPHITE = hex('#33333a');
const SLATE = hex('#5a5a62');
const EDGE = hex('#dedbd5');
const MIST = hex('#eae8e3');
const WHITE = hex('#fbfaf8');
const PAPER = hex('#f4f3f0');
const PURPLE = hex('#4a3ac4');
const PURPLE_DEEP = hex('#33268f');
const PURPLE_QUIET = hex('#f3f1fd');

/** The four value stages, in their ramp. Opaque equivalents of the tokens. */
const STAGE_COLOURS = [hex('#c7c1ee'), hex('#9a8fe0'), hex('#6f60d0'), hex('#4a3ac4')];

type Fonts = { regular: PDFFont; semi: PDFFont };

/* -------------------------------------------------------------------------- */
/* Typography helpers                                                         */
/* -------------------------------------------------------------------------- */

/**
 * pdf-lib places text on a baseline measured from the bottom of the page.
 * Every call site here thinks in distance from the top, so the conversion
 * happens once, in these two helpers, and nowhere else.
 */
function baseline(topY: number, size: number): number {
  return PAGE_H - topY - size * 0.82;
}

function wrap(text: string, font: PDFFont, size: number, maxWidth: number): string[] {
  const out: string[] = [];
  for (const paragraph of text.split('\n')) {
    let line = '';
    for (const word of paragraph.split(/\s+/).filter(Boolean)) {
      const candidate = line ? `${line} ${word}` : word;
      if (font.widthOfTextAtSize(candidate, size) <= maxWidth) {
        line = candidate;
      } else {
        if (line) out.push(line);
        line = word;
      }
    }
    out.push(line);
  }
  return out;
}

/**
 * Letter-spacing, which pdf-lib does not have.
 *
 * The site's labels are uppercase and tracked out; without the tracking they
 * read as shouting rather than as a label. Inserting a hair space between the
 * glyphs looks like the cheap way to do that and is not one: U+200A is outside
 * the subset embedded here, so every gap came out of the renderer as a .notdef
 * box. Each glyph is placed instead, which is what a PDF text run actually
 * offers.
 *
 * Returns the width drawn, so a caller can place something after it.
 */
function drawTracked(
  page: PDFPage,
  content: string,
  options: { x: number; topY: number; size: number; font: PDFFont; color: RGB; tracking?: number }
): number {
  const { x, topY, size, font, color, tracking = 0.1 } = options;
  const y = baseline(topY, size);
  let cursor = x;
  for (const glyph of content.toUpperCase()) {
    page.drawText(glyph, { x: cursor, y, size, font, color });
    cursor += font.widthOfTextAtSize(glyph, size) + size * tracking;
  }
  return cursor - x - size * tracking;
}

type TextOptions = {
  size?: number;
  font?: PDFFont;
  color?: RGB;
  width?: number;
  leading?: number;
  x?: number;
};

/** Where content has to stop, leaving the footer its band. */
const BOTTOM = PAGE_H - MARGIN - 44;

/** A cursor over one page, measured from the top. */
class Sheet {
  readonly page: PDFPage;
  y: number;

  readonly doc: PDFDocument;
  readonly fonts: Fonts;
  readonly pageNumber: number;
  /** Opens the next page. Held here so a section can run past one. */
  readonly nextSheet: () => Sheet;

  // Fields are declared rather than written as constructor parameter
  // properties: this module is imported straight from `scripts/report.mjs`,
  // and Node's type stripping does not support that syntax.
  constructor(
    doc: PDFDocument,
    fonts: Fonts,
    pageNumber: number,
    nextSheet: () => Sheet,
    ground: RGB = WHITE
  ) {
    this.doc = doc;
    this.fonts = fonts;
    this.pageNumber = pageNumber;
    this.nextSheet = nextSheet;
    this.page = doc.addPage([PAGE_W, PAGE_H]);
    this.page.drawRectangle({ x: 0, y: 0, width: PAGE_W, height: PAGE_H, color: ground });
    this.y = MARGIN + 18;
  }

  /**
   * Makes room, or turns the page.
   *
   * A section's length depends on the answers — a long band label or a "not
   * sure" default can add a line to several rows at once — so no section can
   * be laid out on the assumption that it fits. Every long run of rows asks
   * for the space it is about to use, and gets either this page or the next.
   */
  ensure(space: number): Sheet {
    if (this.y + space <= BOTTOM) return this;
    this.footer();
    return this.nextSheet();
  }

  text(content: string, options: TextOptions = {}): this {
    const size = options.size ?? 10;
    const font = options.font ?? this.fonts.regular;
    const width = options.width ?? CONTENT_W;
    const leading = options.leading ?? size * 1.55;
    const x = options.x ?? MARGIN;
    for (const line of wrap(content, font, size, width)) {
      this.page.drawText(line, {
        x,
        y: baseline(this.y, size),
        size,
        font,
        color: options.color ?? GRAPHITE,
      });
      this.y += leading;
    }
    return this;
  }

  /** An uppercase, tracked label, in the register the site's `.label` uses. */
  label(content: string, color: RGB = PURPLE): this {
    const size = 7.5;
    drawTracked(this.page, content, {
      x: MARGIN,
      topY: this.y,
      size,
      font: this.fonts.semi,
      color,
    });
    this.y += size * 2.1;
    return this;
  }

  heading(content: string, size = 21): this {
    return this.text(content, { size, font: this.fonts.semi, color: INK, leading: size * 1.18 });
  }

  body(content: string, color: RGB = GRAPHITE): this {
    return this.text(content, { size: 9.6, color, leading: 15 });
  }

  gap(amount = 14): this {
    this.y += amount;
    return this;
  }

  rule(color: RGB = EDGE): this {
    this.page.drawRectangle({
      x: MARGIN,
      y: PAGE_H - this.y,
      width: CONTENT_W,
      height: 0.75,
      color,
    });
    this.y += 1;
    return this;
  }

  /** A two-column key/detail row, the shape the site uses for a ledger row. */
  row(key: string, detail: string, keyWidth = 150): this {
    const top = this.y;
    const keyLines = wrap(key, this.fonts.semi, 9, keyWidth - 14);
    keyLines.forEach((line, i) => {
      this.page.drawText(line, {
        x: MARGIN,
        y: baseline(top + i * 13, 9),
        size: 9,
        font: this.fonts.semi,
        color: INK,
      });
    });
    const detailLines = wrap(detail, this.fonts.regular, 9, CONTENT_W - keyWidth);
    detailLines.forEach((line, i) => {
      this.page.drawText(line, {
        x: MARGIN + keyWidth,
        y: baseline(top + i * 13, 9),
        size: 9,
        font: this.fonts.regular,
        color: GRAPHITE,
      });
    });
    this.y = top + Math.max(keyLines.length, detailLines.length) * 13 + 7;
    return this;
  }

  /** A bulleted line. The mark is a rule, not a glyph, so it sits on the grid. */
  bullet(content: string): this {
    const top = this.y;
    this.page.drawRectangle({
      x: MARGIN + 1,
      y: PAGE_H - top - 6,
      width: 5,
      height: 1,
      color: PURPLE,
    });
    this.text(content, { size: 9.3, x: MARGIN + 16, width: CONTENT_W - 16, leading: 14 });
    this.y = Math.max(this.y, top + 14) + 3;
    return this;
  }

  footer(): this {
    const size = 7;
    this.page.drawRectangle({
      x: MARGIN,
      y: MARGIN + 22,
      width: CONTENT_W,
      height: 0.5,
      color: EDGE,
    });
    this.page.drawText(REPORT.footer, {
      x: MARGIN,
      y: MARGIN + 8,
      size,
      font: this.fonts.regular,
      color: SLATE,
    });
    const label = String(this.pageNumber);
    this.page.drawText(label, {
      x: PAGE_W - MARGIN - this.fonts.semi.widthOfTextAtSize(label, size),
      y: MARGIN + 8,
      size,
      font: this.fonts.semi,
      color: SLATE,
    });
    return this;
  }
}

/* -------------------------------------------------------------------------- */
/* Assets                                                                     */
/* -------------------------------------------------------------------------- */

/**
 * How the report reaches its fonts and the mark.
 *
 * Injected rather than assumed, because this no longer runs in a browser. The
 * report is a team-side artefact now: `scripts/report.mjs` passes a loader
 * that reads straight from `public/`. A caller in a browser would pass one
 * built on `fetch`, and nothing else about the document would change.
 */
export type AssetLoader = (path: string) => Promise<ArrayBuffer>;

/** Paths are site-absolute — "/fonts/…" — whatever the loader does with them. */
const FONT_REGULAR = '/fonts/schibsted-grotesk-400.ttf';
const FONT_SEMI = '/fonts/schibsted-grotesk-600.ttf';
const MARK = '/logo-mark.png';

/* -------------------------------------------------------------------------- */
/* The document                                                               */
/* -------------------------------------------------------------------------- */

export async function buildReport({
  answers,
  estimate,
  practiceName,
  load,
}: ReportInput): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  doc.registerFontkit(fontkit);

  const [regularBytes, semiBytes] = await Promise.all([load(FONT_REGULAR), load(FONT_SEMI)]);
  const fonts: Fonts = {
    regular: await doc.embedFont(regularBytes, { subset: true }),
    semi: await doc.embedFont(semiBytes, { subset: true }),
  };

  doc.setTitle(`${REPORT.coverTitle}${practiceName ? ` — ${practiceName}` : ''}`);
  doc.setAuthor('Grow Label');
  doc.setSubject(REPORT.coverSubtitle);
  doc.setCreator('Grow Label');
  doc.setProducer('Grow Label');

  const date = new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date());

  let pageNumber = 0;
  const sheet = (ground?: RGB): Sheet =>
    new Sheet(doc, fonts, (pageNumber += 1), () => sheet(ground), ground);

  await cover(sheet(WHITE), { practiceName, date, load });
  headline(sheet(), estimate);
  inputs(sheet(), answers);
  for (const mod of CALCULATOR_MODULES) {
    moduleSheet(sheet(), mod, estimate, answers);
  }
  diagram(sheet(), fonts);
  next(sheet());
  methodology(sheet(), answers, estimate);

  return doc.save();
}

/* --- 1. Cover ------------------------------------------------------------- */

async function cover(
  s: Sheet,
  meta: { practiceName?: string; date: string; load: AssetLoader }
): Promise<void> {
  // A single field of rules behind the title: the site's own recovery field,
  // reduced to what a printed page can carry without becoming decoration.
  for (let i = 0; i < 9; i += 1) {
    s.page.drawRectangle({
      x: MARGIN,
      y: PAGE_H - 250 - i * 9,
      width: CONTENT_W,
      height: 0.6,
      color: i < 4 ? MIST : PAPER,
    });
  }

  try {
    const mark = await s.doc.embedPng(await meta.load(MARK));
    const width = 34;
    s.page.drawImage(mark, {
      x: MARGIN,
      y: PAGE_H - MARGIN - width * (mark.height / mark.width),
      width,
      height: width * (mark.height / mark.width),
    });
  } catch {
    // The mark is not load-bearing. A missing file leaves a clean cover.
  }

  s.y = 150;
  s.label('Grow Label');
  s.y = 176;
  s.heading(REPORT.coverTitle, 33);
  s.gap(6);
  s.text(REPORT.coverSubtitle, { size: 11.5, color: SLATE, width: 340 });

  s.y = 320;
  s.rule();
  s.gap(18);
  if (meta.practiceName) {
    s.row(REPORT.preparedFor, meta.practiceName, 120);
  }
  s.row(REPORT.preparedOn, meta.date, 120);
  s.row('Basis', 'Nine answers, modelled. Not a measurement.', 120);

  s.y = PAGE_H - MARGIN - 120;
  s.text(
    'This document states every coefficient behind its own figures. Nothing in it has been read from your systems, and no figure in it is a commitment.',
    { size: 9, color: SLATE, width: 330, leading: 14 }
  );
  s.footer();
}

/* --- 2. The headline ------------------------------------------------------ */

function headline(s: Sheet, estimate: Estimate): void {
  s.label('The estimate');
  s.heading(REPORT.headlineTitle, 21);
  s.gap(24);

  // The figure, sat on its own baseline with the qualifier above it.
  s.text('AT LEAST', { size: 8, font: s.fonts.semi, color: PURPLE, leading: 13 });
  s.gap(2);
  const figure = money(estimate.headline);
  s.page.drawText(figure, {
    x: MARGIN,
    y: baseline(s.y, 46),
    size: 46,
    font: s.fonts.semi,
    color: INK,
  });
  s.page.drawText('a year', {
    x: MARGIN + s.fonts.semi.widthOfTextAtSize(figure, 46) + 10,
    y: baseline(s.y, 46),
    size: 12,
    font: s.fonts.regular,
    color: SLATE,
  });
  s.y += 62;
  s.text(`Modelled range: up to ${money(estimate.upper)} a year on the same answers.`, {
    size: 9,
    color: SLATE,
    leading: 14,
  });

  s.gap(22);
  s.rule();
  s.gap(20);

  for (const paragraph of REPORT.headlineBody) {
    s.body(paragraph);
    s.gap(9);
  }

  s.gap(14);
  s.rule(MIST);
  s.gap(18);
  s.label(REPORT.hoursTitle, GRAPHITE);
  s.page.drawText(count(estimate.hoursReturned), {
    x: MARGIN,
    y: baseline(s.y, 26),
    size: 26,
    font: s.fonts.semi,
    color: PURPLE,
  });
  s.page.drawText('front-desk hours a year', {
    x: MARGIN + s.fonts.semi.widthOfTextAtSize(count(estimate.hoursReturned), 26) + 9,
    y: baseline(s.y, 26),
    size: 10,
    font: s.fonts.regular,
    color: GRAPHITE,
  });
  s.y += 38;
  s.body(REPORT.hoursBody, SLATE);

  if (estimate.belowRecordThreshold) {
    s.gap(16);
    s.page.drawRectangle({
      x: MARGIN,
      y: PAGE_H - s.y - 44,
      width: CONTENT_W,
      height: 44,
      color: PURPLE_QUIET,
    });
    s.y += 12;
    s.text(
      `Your record count sits under ${count(RECORD_THRESHOLD)}. The reactivation figure is the softest of the four at that size, and the report says so again where it appears.`,
      { size: 8.6, color: PURPLE_DEEP, width: CONTENT_W - 24, x: MARGIN + 12, leading: 12.5 }
    );
    s.y += 12;
  }

  s.footer();
}

/* --- 3. Their inputs ------------------------------------------------------ */

function inputs(sheet: Sheet, answers: Answers): void {
  let s = sheet;
  s.label('Your answers');
  s.heading(REPORT.inputsTitle, 21);
  s.gap(12);
  s.body(REPORT.inputsBody);
  s.gap(20);
  s.rule();
  s.gap(14);

  QUESTIONS.forEach((question, i) => {
    s = s.ensure(42);
    const value = answers[question.id];
    s.row(
      `${String(i + 1).padStart(2, '0')}  ${question.title}`,
      answerLabel(question.id, value as string | number),
      300
    );
  });

  s = s.ensure(120);
  s.gap(10);
  s.rule(MIST);
  s.gap(14);
  s.label('Derived from those answers', GRAPHITE);
  const derived = estimateDerivations(answers);
  for (const [key, detail] of derived) {
    s = s.ensure(42);
    s.row(key, detail, 220);
  }

  s.footer();
}

/** The intermediate figures, so a reader can follow the arithmetic forward. */
function estimateDerivations(answers: Answers): [string, string][] {
  const defaults = DEFAULTS[answers.practice];
  return [
    ['Trading weeks a year', String(WEEKS_PER_YEAR)],
    [
      'Assumed dormant share',
      `${percent(defaults.lapseRate)} of active records, the default for ${answers.practice} practices`,
    ],
    [
      'No-show rate applied',
      answers.noShows === 'not-sure'
        ? `${percent(defaults.noShowRate)}, the default where the answer was "not sure"`
        : `${percent(COEFFICIENTS.noShowRate[answers.noShows])}, from the band you chose`,
    ],
  ];
}

/* --- 4 to 7. One module per page ------------------------------------------ */

function moduleSheet(
  sheet: Sheet,
  mod: (typeof CALCULATOR_MODULES)[number],
  estimate: Estimate,
  answers: Answers
): void {
  let s = sheet;
  const value = roundDownHundred(estimate.modules.find((m) => m.slug === mod.slug)?.value ?? 0);

  s.label(`Module — ${mod.name}`);
  s.heading(mod.job, 21);
  s.gap(20);

  // The figure block.
  s.page.drawRectangle({
    x: MARGIN,
    y: PAGE_H - s.y - 62,
    width: CONTENT_W,
    height: 62,
    color: PAPER,
  });
  s.page.drawRectangle({
    x: MARGIN,
    y: PAGE_H - s.y - 62,
    width: 2.5,
    height: 62,
    color: PURPLE,
  });
  drawTracked(s.page, REPORT.estimateLabel, {
    x: MARGIN + 18,
    topY: s.y + 14,
    size: 7.5,
    font: s.fonts.semi,
    color: SLATE,
  });
  s.page.drawText(money(value), {
    x: MARGIN + 18,
    y: baseline(s.y + 26, 24),
    size: 24,
    font: s.fonts.semi,
    color: INK,
  });
  s.y += 62 + 24;

  s.label(REPORT.leakLabel, GRAPHITE);
  s.body(mod.leak);
  s.gap(18);

  s.label(REPORT.driversLabel, GRAPHITE);
  for (const driver of driversFor(mod.slug, estimate, answers)) {
    s = s.ensure(46);
    s.bullet(driver);
  }
  s.gap(16);

  s = s.ensure(180);
  s.rule(MIST);
  s.gap(16);
  s.label(REPORT.connectsLabel, GRAPHITE);
  s.body(mod.connects);
  s.gap(16);

  s.label(REPORT.dashboardLabel, GRAPHITE);
  s.body(mod.dashboard);

  if (mod.slug === 'reactivate' && estimate.belowRecordThreshold) {
    s.gap(16);
    s.body(
      `Read this figure with more caution than the other three: under ${count(RECORD_THRESHOLD)} active records a dormant list is too small to behave like a list, and a campaign against it behaves more like a set of individual conversations.`,
      SLATE
    );
  }

  s.footer();
}

/**
 * The two or three inputs that produced a module's figure, with this
 * practice's own numbers in them rather than the generic description.
 */
function driversFor(
  slug: (typeof CALCULATOR_MODULES)[number]['slug'],
  e: Estimate,
  answers: Answers
): string[] {
  switch (slug) {
    case 'answer':
      return [
        `${count(e.callVolume)} calls a year, at ${COEFFICIENTS.callsPerAppointment} for every one of your ${count(e.appointmentsPerYear)} appointments.`,
        `${percent(e.missedRate)} of them assumed to go unanswered, from how your practice handles a call nobody can pick up — about ${count(e.missedCalls)} calls.`,
        `${percent(COEFFICIENTS.bookingIntent)} of those callers were ringing to book, and ${percent(COEFFICIENTS.recoverableShare)} of those are treated as recoverable, at ${money(e.appointmentValue)} an appointment.`,
      ];
    case 'respond':
      return [
        `${count(e.webEnquiries)} web and form enquiries a year, at ${percent(COEFFICIENTS.enquiryRate)} of your appointment volume.`,
        `A baseline conversion of ${percent(COEFFICIENTS.currentConversion)}, improving to ${percent(COEFFICIENTS.improvedConversion)} once a first response lands inside the window people still book in.`,
        `The difference between those two, at ${money(e.appointmentValue)} an appointment.`,
      ];
    case 'retain':
      return [
        `${count(e.noShows)} no-shows and late cancellations a year, at the ${percent(e.noShowRate)} rate ${answers.noShows === 'not-sure' ? 'assumed for your practice type' : 'you gave'}.`,
        `A ${percent(COEFFICIENTS.noShowReduction)} reduction in them, set beneath the range this work is usually held to.`,
        `Each recovered slot at ${money(e.appointmentValue)}.`,
      ];
    case 'reactivate':
      return [
        `${count(e.activeRecords)} active records, of which ${percent(e.lapseRate)} — about ${count(e.dormant)} — are assumed dormant.`,
        `${percent(e.campaignFactor)} of that list still addressable, from when you last worked it deliberately.`,
        `A ${percent(COEFFICIENTS.recoveryRate)} return rate, at ${money(e.appointmentValue)} an appointment.`,
      ];
  }
}

/* --- 8. How the four connect ---------------------------------------------- */

function diagram(s: Sheet, fonts: Fonts): void {
  s.label('The system');
  s.heading(REPORT.diagramTitle, 21);
  s.gap(12);
  s.body(REPORT.diagramBody);
  s.gap(30);

  const top = s.y;
  const boxW = (CONTENT_W - 3 * 12) / 4;
  // Three lines of description plus the name, with the last line clear of
  // the border: at 54 the third line sat on it.
  const boxH = 66;

  CALCULATOR_MODULES.forEach((mod, i) => {
    const x = MARGIN + i * (boxW + 12);
    s.page.drawRectangle({
      x,
      y: PAGE_H - top - boxH,
      width: boxW,
      height: boxH,
      color: WHITE,
      borderColor: EDGE,
      borderWidth: 0.75,
    });
    drawTracked(s.page, mod.name, {
      x: x + 12,
      topY: top + 14,
      size: 8,
      font: fonts.semi,
      color: PURPLE,
    });
    for (const [j, line] of wrap(mod.job, fonts.regular, 7.4, boxW - 24)
      .slice(0, 3)
      .entries()) {
      s.page.drawText(line, {
        x: x + 12,
        y: baseline(top + 28 + j * 9.5, 7.4),
        size: 7.4,
        font: fonts.regular,
        color: SLATE,
      });
    }
    // The feed into the layer below.
    s.page.drawRectangle({
      x: x + boxW / 2 - 0.4,
      y: PAGE_H - top - boxH - 26,
      width: 0.8,
      height: 26,
      color: EDGE,
    });
  });

  const layerY = top + boxH + 26;
  s.page.drawRectangle({
    x: MARGIN,
    y: PAGE_H - layerY - 40,
    width: CONTENT_W,
    height: 40,
    color: INK,
  });
  drawTracked(s.page, 'One recovery layer', {
    x: MARGIN + 16,
    topY: layerY + 15,
    size: 8.5,
    font: fonts.semi,
    color: WHITE,
  });
  s.page.drawText('One record per opportunity, linked to the event that produced it.', {
    x: MARGIN + 150,
    y: baseline(layerY + 15, 8.5),
    size: 8.5,
    font: fonts.regular,
    color: hex('#ab9fee'),
  });

  // The four stages, in the ramp.
  const stagesY = layerY + 40 + 26;
  s.page.drawRectangle({
    x: MARGIN + CONTENT_W / 2 - 0.4,
    y: PAGE_H - stagesY,
    width: 0.8,
    height: 26,
    color: EDGE,
  });

  const stages = ['Estimated', 'Booked', 'Attended', 'Collected'];
  const stageW = (CONTENT_W - 3 * 10) / 4;
  stages.forEach((stage, i) => {
    const x = MARGIN + i * (stageW + 10);
    // The name sits above its bar with a full line between them; at the
    // original offsets the bar ran through the baseline and read as an
    // underline rather than as a stage.
    s.page.drawText(stage, {
      x,
      y: baseline(stagesY + 8, 8.5),
      size: 8.5,
      font: fonts.semi,
      color: i === 3 ? INK : GRAPHITE,
    });
    s.page.drawRectangle({
      x,
      y: PAGE_H - stagesY - 34,
      width: stageW,
      height: 6,
      color: STAGE_COLOURS[i] ?? PURPLE,
    });
  });

  s.y = stagesY + 58;
  s.body(REPORT.diagramFooter, SLATE);
  s.gap(10);
  s.body(
    'Only collected value is revenue. The other three are stages on the way to it, and this report never adds them together.',
    SLATE
  );

  s.footer();
}

/* --- 9. What happens next -------------------------------------------------- */

function next(sheet: Sheet): void {
  let s = sheet;
  s.label('Next');
  s.heading(REPORT.nextTitle, 21);
  s.gap(12);
  s.body(REPORT.nextBody);
  s.gap(22);
  s.rule();
  s.gap(16);

  for (const step of REPORT.nextSteps) {
    s = s.ensure(58);
    s.row(step.key, step.detail, 150);
    s.gap(4);
  }

  // The guarantee panel is a fixed block and is never split across a page.
  s = s.ensure(190);
  s.gap(14);
  s.page.drawRectangle({
    x: MARGIN,
    y: PAGE_H - s.y - 104,
    width: CONTENT_W,
    height: 104,
    color: PURPLE_QUIET,
  });
  s.page.drawRectangle({
    x: MARGIN,
    y: PAGE_H - s.y - 104,
    width: 2.5,
    height: 104,
    color: PURPLE,
  });
  const boxTop = s.y;
  s.y += 18;
  drawTracked(s.page, ASSESSMENT_GUARANTEE.title, {
    x: MARGIN + 18,
    topY: s.y,
    size: 8,
    font: s.fonts.semi,
    color: PURPLE_DEEP,
  });
  s.y += 14;
  s.text(ASSESSMENT_GUARANTEE.body, {
    size: 9.2,
    color: GRAPHITE,
    x: MARGIN + 18,
    width: CONTENT_W - 36,
    leading: 14,
  });
  s.y = boxTop + 104 + 26;

  s.rule(MIST);
  s.gap(16);
  s.label('To start', GRAPHITE);
  s.body(
    'Request an assessment at thegrowlabel.com/contact. The first step is a scoping call to agree the window and the definitions; nothing is installed and nothing in your systems changes.'
  );

  s.footer();
}

/* --- 10. Methodology and limits ------------------------------------------- */

function methodology(sheet: Sheet, answers: Answers, estimate: Estimate): void {
  let s = sheet;
  s.label('Methodology');
  s.heading(REPORT.methodologyTitle, 21);
  s.gap(12);
  for (const paragraph of REPORT.methodologyBody) {
    s.body(paragraph);
    s.gap(8);
  }

  s.gap(12);
  s.rule();
  s.gap(14);
  s.label(REPORT.coefficientsTitle, GRAPHITE);

  // Sixteen rows, most of them two lines and some three depending on the
  // answers. They run onto a second page, which is what `ensure` is for.
  for (const [key, detail] of coefficientRows(answers, estimate)) {
    s = s.ensure(46);
    s.row(key, detail, 210);
  }

  s = s.ensure(120);
  s.gap(10);
  s.rule(MIST);
  s.gap(14);
  s.label(REPORT.basisTitle, GRAPHITE);
  s.body(REPORT.basisBody);

  s = s.ensure(60 + REPORT.limits.length * 30);
  s.gap(18);
  s.label(REPORT.limitsTitle, GRAPHITE);
  for (const limit of REPORT.limits) {
    s = s.ensure(34);
    s.bullet(limit);
  }

  s.footer();
}

/** Printed from the model's own constants, so the two cannot disagree. */
function coefficientRows(answers: Answers, estimate: Estimate): [string, string][] {
  const defaults = DEFAULTS[answers.practice];
  return [
    ['Trading weeks a year', `${WEEKS_PER_YEAR}. Four weeks given back to closures and holiday.`],
    [
      'Calls per appointment',
      `${COEFFICIENTS.callsPerAppointment}. Applied to your appointment volume to reach call volume.`,
    ],
    [
      'Missed call rate',
      `${percent(estimate.missedRate)}, from how your practice handles a call nobody can pick up. The four rates are ${Object.values(COEFFICIENTS.missedRate).map(percent).join(', ')}.`,
    ],
    [
      'Booking intent',
      `${percent(COEFFICIENTS.bookingIntent)} of missed callers were ringing to book rather than to ask.`,
    ],
    [
      'Recoverable share',
      `${percent(COEFFICIENTS.recoverableShare)} of those are treated as recoverable. Held well under half deliberately.`,
    ],
    [
      'Enquiry rate',
      `${percent(COEFFICIENTS.enquiryRate)} of appointment volume arrives as a web or form enquiry.`,
    ],
    [
      'Enquiry conversion',
      `${percent(COEFFICIENTS.currentConversion)} assumed today, ${percent(COEFFICIENTS.improvedConversion)} after a fast first response. The improved figure is capped below best case, and response time is not asked for — it would be a tenth question.`,
    ],
    [
      'No-show rate',
      `${percent(estimate.noShowRate)}. ${answers.noShows === 'not-sure' ? `Default for ${answers.practice} practices, used because the answer was "not sure".` : 'The midpoint of the band you chose.'}`,
    ],
    [
      'No-show reduction',
      `${percent(COEFFICIENTS.noShowReduction)} of them prevented. Set under the range this work is usually held to.`,
    ],
    [
      'Dormant share',
      `${percent(defaults.lapseRate)} of active records, the default for ${answers.practice} practices.`,
    ],
    [
      'Campaign factor',
      `${percent(estimate.campaignFactor)}, from when you last worked the lapsed list. The four factors are ${Object.values(COEFFICIENTS.campaignFactor).map(percent).join(', ')}.`,
    ],
    [
      'Reactivation rate',
      `${percent(COEFFICIENTS.recoveryRate)} of the addressable dormant list returns. Set beneath the range this is usually worked at.`,
    ],
    [
      'Appointment value',
      `${money(estimate.appointmentValue)}. The midpoint of the band you chose, or its lower bound where the band is open-topped.`,
    ],
    [
      'Active records',
      `${count(estimate.activeRecords)}. Same rule: the midpoint of the band, or its lower bound where it is open-topped.`,
    ],
    [
      'Headline share',
      `${percent(COEFFICIENTS.headlineShare)} of the modelled total. The headline is deliberately the low end of the range, and every figure is rounded down.`,
    ],
    [
      'Front-desk minutes',
      `${COEFFICIENTS.minutes.missedCall} minutes per missed call returned, ${COEFFICIENTS.minutes.noShow} per no-show chased, ${COEFFICIENTS.minutes.dormantRecord} per dormant record worked by hand.`,
    ],
  ];
}
