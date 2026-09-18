/**
 * The revenue recovery model.
 *
 * Pure arithmetic, no dependencies, no copy. Every coefficient in this file is
 * tuned to under-promise: the estimate it produces becomes the anchor for a
 * paid assessment, and an estimate the assessment cannot beat is worse than no
 * estimate at all. Do not raise a coefficient, and do not round anything up.
 *
 * The coefficients are exported rather than inlined because the report prints
 * them on its methodology page. There is one source for the working and the
 * statement of the working, so the two cannot drift apart.
 *
 * Deliberately free of any validation library and of any React import: this
 * runs in the browser, inside a client component, and pulling zod in behind it
 * would put the whole validator in the bundle. See the note on
 * `lib/contact-fields` in CLAUDE.md — same rule, same reason.
 */

export type PracticeType = 'veterinary' | 'dental';
export type LocationBand = '1' | '2-3' | '4-7' | '8+';
export type RecordBand = 'under-1500' | '1500-4000' | '4000-10000' | '10000-plus';
export type ValueBand = 'under-100' | '100-200' | '200-400' | '400-800' | '800-plus';
export type DeskBand = '1' | '2-3' | '4-6' | '7-plus';
export type CallHandling = 'voicemail' | 'answering-service' | 'try-again' | 'not-sure';
export type NoShowBand = 'under-5' | '5-10' | '10-20' | 'over-20' | 'not-sure';
export type CampaignRecency = 'never' | 'over-12' | '6-12' | 'under-6';

export type ModuleSlug = 'answer' | 'respond' | 'retain' | 'reactivate';

export type Answers = {
  practice: PracticeType;
  locations: LocationBand;
  records: RecordBand;
  /** Appointments in a typical week, all locations combined. */
  weeklyAppointments: number;
  value: ValueBand;
  desk: DeskBand;
  calls: CallHandling;
  noShows: NoShowBand;
  campaign: CampaignRecency;
};

/* -------------------------------------------------------------------------- */
/* Bands                                                                      */
/* -------------------------------------------------------------------------- */

/**
 * A band is stored as its bounds, never as a label.
 *
 * Two reasons. The representative value is derived by one rule — midpoint,
 * except an open-topped band which takes its lower bound — so no band can
 * quietly acquire a more generous figure than its neighbours. And the label a
 * reader sees is formatted from the same bounds, so a band cannot say one
 * thing on screen and mean another in the arithmetic.
 */
export type Band = { min: number; max?: number };

/** Midpoint of a closed band; the lower bound of an open-topped one. */
export function representative(band: Band): number {
  return band.max === undefined ? band.min : (band.min + band.max) / 2;
}

export const RECORD_BANDS: Record<RecordBand, Band> = {
  'under-1500': { min: 0, max: 1500 },
  '1500-4000': { min: 1500, max: 4000 },
  '4000-10000': { min: 4000, max: 10000 },
  '10000-plus': { min: 10000 },
};

export const VALUE_BANDS: Record<ValueBand, Band> = {
  'under-100': { min: 0, max: 100 },
  '100-200': { min: 100, max: 200 },
  '200-400': { min: 200, max: 400 },
  '400-800': { min: 400, max: 800 },
  '800-plus': { min: 800 },
};

/**
 * Below this many active records the reactivation arithmetic is working on a
 * list too small to behave like a list. The estimate is still shown — refusing
 * to answer is worse than answering with a caveat — and the report says so.
 */
export const RECORD_THRESHOLD = 1500;

/* -------------------------------------------------------------------------- */
/* Coefficients                                                               */
/* -------------------------------------------------------------------------- */

/** Trading weeks in a year. Four weeks are given back to closures and holiday. */
export const WEEKS_PER_YEAR = 48;

/**
 * Defaults by practice type, used wherever an answer is "not sure" and for the
 * appointment value the questions open on.
 */
export const DEFAULTS: Record<
  PracticeType,
  { noShowRate: number; lapseRate: number; value: ValueBand }
> = {
  dental: { noShowRate: 0.15, lapseRate: 0.3, value: '200-400' },
  veterinary: { noShowRate: 0.12, lapseRate: 0.35, value: '100-200' },
};

export const COEFFICIENTS = {
  /** Calls a practice takes for every appointment it completes. */
  callsPerAppointment: 2.5,
  /** Share of calls that go unanswered, by what happens when nobody picks up. */
  missedRate: {
    voicemail: 0.22,
    'answering-service': 0.12,
    'try-again': 0.2,
    'not-sure': 0.18,
  } satisfies Record<CallHandling, number>,
  /** Share of missed calls that were calling to book rather than to ask. */
  bookingIntent: 0.35,
  /** Share of those a recovery system gets back. Held well under half. */
  recoverableShare: 0.4,
  /** Web and form enquiries, as a share of completed appointments. */
  enquiryRate: 0.08,
  /** Assumed baseline conversion on an enquiry. Not asked, to keep to nine. */
  currentConversion: 0.2,
  /** Conversion after a first response inside the window. Capped below best case. */
  improvedConversion: 0.32,
  /** Share of no-shows and late cancellations a recovery system prevents. */
  noShowReduction: 0.2,
  /** No-show rate assumed where the answer is "not sure", by practice type. */
  noShowRate: {
    'under-5': 0.05,
    '5-10': 0.075,
    '10-20': 0.15,
    'over-20': 0.2,
  } satisfies Record<Exclude<NoShowBand, 'not-sure'>, number>,
  /** How much of a dormant list is still addressable, by when it was last worked. */
  campaignFactor: {
    never: 1.0,
    'over-12': 0.85,
    '6-12': 0.55,
    'under-6': 0.3,
  } satisfies Record<CampaignRecency, number>,
  /** Share of a dormant list that returns to the chair or the consulting room. */
  recoveryRate: 0.12,
  /** The headline is this share of the modelled total. The rest is the range. */
  headlineShare: 0.6,
  /** Minutes of front-desk time each unit of recovered work costs today. */
  minutes: { missedCall: 3, noShow: 5, dormantRecord: 2 },
} as const;

/* -------------------------------------------------------------------------- */
/* The estimate                                                               */
/* -------------------------------------------------------------------------- */

export type ModuleEstimate = {
  slug: ModuleSlug;
  /** Annual, in whole currency units, before the headline share is applied. */
  value: number;
};

export type Estimate = {
  /** Derived inputs, kept so the report can show its working. */
  appointmentsPerYear: number;
  appointmentValue: number;
  activeRecords: number;
  callVolume: number;
  missedCalls: number;
  webEnquiries: number;
  noShows: number;
  dormant: number;
  /** The rates that were applied, after "not sure" was resolved to a default. */
  missedRate: number;
  noShowRate: number;
  lapseRate: number;
  campaignFactor: number;
  /** Per module, annual, unrounded. */
  modules: ModuleEstimate[];
  /** Sum of the four modules. */
  total: number;
  /** The figure shown large: `total` at the headline share, rounded down. */
  headline: number;
  /** The top of the range: `total`, rounded down. */
  upper: number;
  /** Front-desk hours a year currently spent on work the modules absorb. */
  hoursReturned: number;
  /** True when the record count sits under the threshold the model works above. */
  belowRecordThreshold: boolean;
};

/** Rounds down to the nearest thousand. There is no rounding up in this file. */
export function roundDownThousand(value: number): number {
  return Math.max(0, Math.floor(value / 1000) * 1000);
}

/** Rounds a module row down to the nearest hundred, for the same reason. */
export function roundDownHundred(value: number): number {
  return Math.max(0, Math.floor(value / 100) * 100);
}

/**
 * The spine of the model. A rough weekly appointment count is enough, so the
 * input is cleaned rather than rejected: anything unparseable is zero, and a
 * zero produces a zero estimate rather than a NaN on the page.
 */
export function appointmentsPerYear(weekly: number): number {
  if (!Number.isFinite(weekly) || weekly <= 0) return 0;
  return weekly * WEEKS_PER_YEAR;
}

export function estimate(answers: Answers): Estimate {
  const defaults = DEFAULTS[answers.practice];

  const perYear = appointmentsPerYear(answers.weeklyAppointments);
  const appointmentValue = representative(VALUE_BANDS[answers.value]);
  const activeRecords = representative(RECORD_BANDS[answers.records]);

  const missedRate = COEFFICIENTS.missedRate[answers.calls];
  const noShowRate =
    answers.noShows === 'not-sure' ? defaults.noShowRate : COEFFICIENTS.noShowRate[answers.noShows];
  const lapseRate = defaults.lapseRate;
  const campaignFactor = COEFFICIENTS.campaignFactor[answers.campaign];

  // --- Module 1 — ANSWER: calls nobody could pick up ----------------------
  const callVolume = perYear * COEFFICIENTS.callsPerAppointment;
  const missedCalls = callVolume * missedRate;
  const answerValue =
    missedCalls * COEFFICIENTS.bookingIntent * COEFFICIENTS.recoverableShare * appointmentValue;

  // --- Module 2 — RESPOND: first response on an enquiry -------------------
  const webEnquiries = perYear * COEFFICIENTS.enquiryRate;
  const respondValue =
    webEnquiries *
    (COEFFICIENTS.improvedConversion - COEFFICIENTS.currentConversion) *
    appointmentValue;

  // --- Module 3 — RETAIN: no-shows and late cancellations -----------------
  const noShows = perYear * noShowRate;
  const retainValue = noShows * COEFFICIENTS.noShowReduction * appointmentValue;

  // --- Module 4 — REACTIVATE: records that stopped moving -----------------
  const dormant = activeRecords * lapseRate;
  const reactivateValue = dormant * campaignFactor * COEFFICIENTS.recoveryRate * appointmentValue;

  const modules: ModuleEstimate[] = [
    { slug: 'answer', value: answerValue },
    { slug: 'respond', value: respondValue },
    { slug: 'retain', value: retainValue },
    { slug: 'reactivate', value: reactivateValue },
  ];

  const total = modules.reduce((sum, m) => sum + m.value, 0);

  // Hours are counted against the work as it stands today, so the dormant list
  // is the whole list rather than the share a campaign would reach.
  const minutes =
    missedCalls * COEFFICIENTS.minutes.missedCall +
    noShows * COEFFICIENTS.minutes.noShow +
    dormant * COEFFICIENTS.minutes.dormantRecord;

  return {
    appointmentsPerYear: perYear,
    appointmentValue,
    activeRecords,
    callVolume,
    missedCalls,
    webEnquiries,
    noShows,
    dormant,
    missedRate,
    noShowRate,
    lapseRate,
    campaignFactor,
    modules,
    total,
    headline: roundDownThousand(total * COEFFICIENTS.headlineShare),
    upper: roundDownThousand(total),
    hoursReturned: Math.floor(minutes / 60),
    belowRecordThreshold: RECORD_BANDS[answers.records].min < RECORD_THRESHOLD,
  };
}

/* -------------------------------------------------------------------------- */
/* Formatting                                                                 */
/* -------------------------------------------------------------------------- */

/**
 * One money formatter, used by the screen and by the report.
 *
 * The symbol is produced by `Intl` rather than written into a template, which
 * is what lets a band label and the arithmetic behind it come from the same
 * pair of numbers.
 */
const MONEY = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

export function money(value: number): string {
  return MONEY.format(Math.round(value));
}

const COUNT = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 });

export function count(value: number): string {
  return COUNT.format(Math.round(value));
}

export function percent(value: number): string {
  return `${Number((value * 100).toFixed(1))}%`;
}

/** "under $100", "$100–200", "$800+" — formatted from the bounds themselves. */
export function bandLabel(band: Band): string {
  if (band.max === undefined) return `${money(band.min)}+`;
  if (band.min === 0) return `under ${money(band.max)}`;
  return `${money(band.min)}–${money(band.max)}`;
}

/** "under 1,500", "1,500–4,000", "10,000+" for a plain count band. */
export function countBandLabel(band: Band): string {
  if (band.max === undefined) return `${count(band.min)}+`;
  if (band.min === 0) return `under ${count(band.max)}`;
  return `${count(band.min)}–${count(band.max)}`;
}
