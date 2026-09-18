/**
 * The revenue recovery calculator: every word of it.
 *
 * The arithmetic lives in `lib/calculator/model.ts` and none of it is repeated
 * here. Where a number appears in this file it is formatted from that file's
 * own bands, so a label and the coefficient behind it cannot drift apart.
 *
 * This tool sits before the paid assessment: it estimates, the assessment
 * measures. Every line below is written to keep that distinction visible, because
 * an estimate a reader mistakes for a measurement is the one way this becomes a
 * liability rather than a lead.
 */

import {
  RECORD_BANDS,
  VALUE_BANDS,
  bandLabel,
  countBandLabel,
  type Answers,
  type CallHandling,
  type CampaignRecency,
  type DeskBand,
  type LocationBand,
  type ModuleSlug,
  type NoShowBand,
  type PracticeType,
  type RecordBand,
  type ValueBand,
} from '@/lib/calculator/model';

export const CALCULATOR = {
  label: 'Revenue recovery calculator',
  title: 'Nine questions,',
  emphasis: 'and a conservative number.',
  lead: 'A modelled estimate of the revenue your practice is generating and not converting, built from nine answers about how your front desk runs. It takes under two minutes and gives you the figure before it asks for anything.',
  meta: 'Nine questions · under two minutes',
  /** Shown beside the progress indicator while the questions are open. */
  progressLabel: 'Question',
  of: 'of',
  /**
   * Four bands rather than a countdown. A number that ticks down by eleven
   * seconds a question is both distracting and a promise, and the page has
   * already promised under two minutes.
   */
  timeRemaining: (seconds: number) =>
    seconds > 75
      ? 'About 90 seconds left'
      : seconds > 45
        ? 'About a minute left'
        : seconds > 25
          ? 'Under a minute left'
          : 'Under 30 seconds left',
  back: 'Back',
  next: 'Continue',
  finish: 'See the estimate',
  restart: 'Start again',
  change: 'Change an answer',
  /** How the two entry points elsewhere on the site name this. */
  entry: 'Estimate what you are losing',
  entryHref: '/calculator',
} as const;

/* -------------------------------------------------------------------------- */
/* The nine questions                                                         */
/* -------------------------------------------------------------------------- */

export type Choice<T extends string> = {
  value: T;
  label: string;
  /** A short clarifier, shown under the option. Used sparingly. */
  note?: string;
};

export type ChoiceQuestionId = Exclude<keyof Answers, 'weeklyAppointments'>;

export type ChoiceQuestion = {
  kind: 'choice';
  id: ChoiceQuestionId;
  /** The question itself, as a person would ask it out loud. */
  title: string;
  help?: string;
  options: readonly Choice<string>[];
};

export type NumberQuestion = {
  kind: 'number';
  id: 'weeklyAppointments';
  title: string;
  help: string;
  placeholder: string;
  suffix: string;
  min: number;
  max: number;
  error: string;
};

export type Question = ChoiceQuestion | NumberQuestion;

const PRACTICE_OPTIONS: readonly Choice<PracticeType>[] = [
  { value: 'veterinary', label: 'Veterinary' },
  { value: 'dental', label: 'Dental' },
];

const LOCATION_OPTIONS: readonly Choice<LocationBand>[] = [
  { value: '1', label: 'One' },
  { value: '2-3', label: 'Two to three' },
  { value: '4-7', label: 'Four to seven' },
  { value: '8+', label: 'Eight or more' },
];

const RECORD_OPTIONS: readonly Choice<RecordBand>[] = (
  ['under-1500', '1500-4000', '4000-10000', '10000-plus'] as const
).map((value) => ({ value, label: countBandLabel(RECORD_BANDS[value]) }));

const VALUE_OPTIONS: readonly Choice<ValueBand>[] = (
  ['under-100', '100-200', '200-400', '400-800', '800-plus'] as const
).map((value) => ({ value, label: bandLabel(VALUE_BANDS[value]) }));

const DESK_OPTIONS: readonly Choice<DeskBand>[] = [
  { value: '1', label: 'One' },
  { value: '2-3', label: 'Two to three' },
  { value: '4-6', label: 'Four to six' },
  { value: '7-plus', label: 'Seven or more' },
];

const CALL_OPTIONS: readonly Choice<CallHandling>[] = [
  { value: 'voicemail', label: 'It goes to voicemail' },
  { value: 'answering-service', label: 'An answering service picks it up' },
  { value: 'try-again', label: 'Callers try again later' },
  { value: 'not-sure', label: 'Not sure' },
];

const NO_SHOW_OPTIONS: readonly Choice<NoShowBand>[] = [
  { value: 'under-5', label: 'Under 5%' },
  { value: '5-10', label: '5 to 10%' },
  { value: '10-20', label: '10 to 20%' },
  { value: 'over-20', label: 'Over 20%' },
  { value: 'not-sure', label: 'Not sure' },
];

const CAMPAIGN_OPTIONS: readonly Choice<CampaignRecency>[] = [
  { value: 'never', label: 'Never' },
  { value: 'over-12', label: 'Over twelve months ago' },
  { value: '6-12', label: 'In the last six to twelve months' },
  { value: 'under-6', label: 'In the last six months' },
];

/**
 * Nine, and no more.
 *
 * What is deliberately absent: the practice management system, the telephony
 * provider, the website platform. Every one of them would sharpen the estimate
 * and every one of them costs completions, and the assessment reads them from
 * the source anyway rather than from a dropdown.
 */
export const QUESTIONS: readonly Question[] = [
  {
    kind: 'choice',
    id: 'practice',
    title: 'What kind of practice do you run?',
    help: 'This sets the defaults behind every figure that follows.',
    options: PRACTICE_OPTIONS,
  },
  {
    kind: 'choice',
    id: 'locations',
    title: 'How many locations?',
    options: LOCATION_OPTIONS,
  },
  {
    kind: 'choice',
    id: 'records',
    title: 'How many active patient or client records across all locations?',
    help: 'Everyone on the books, not only the ones you have seen recently.',
    options: RECORD_OPTIONS,
  },
  {
    kind: 'number',
    id: 'weeklyAppointments',
    title: 'Appointments in a typical week, all locations combined?',
    help: 'A rough number is fine. This is the one answer the whole estimate is built on, so an approximate figure you believe beats an exact one you had to go and find.',
    placeholder: '240',
    suffix: 'appointments a week',
    min: 1,
    max: 20000,
    error: 'Enter roughly how many appointments a week, as a number.',
  },
  {
    kind: 'choice',
    id: 'value',
    title: 'What is a completed appointment worth on average?',
    help: 'Gross, before costs. We have opened on the usual band for your practice type — change it if it is wrong.',
    options: VALUE_OPTIONS,
  },
  {
    kind: 'choice',
    id: 'desk',
    title: 'How many people work reception or the front desk, across all locations?',
    options: DESK_OPTIONS,
  },
  {
    kind: 'choice',
    id: 'calls',
    title: 'How are calls handled when nobody can pick up?',
    help: 'Whatever happens most of the time. "Not sure" is a real answer and the model has a figure for it.',
    options: CALL_OPTIONS,
  },
  {
    kind: 'choice',
    id: 'noShows',
    title: 'Roughly what share of appointments are no-shows or late cancellations?',
    options: NO_SHOW_OPTIONS,
  },
  {
    kind: 'choice',
    id: 'campaign',
    title: 'When did you last run a campaign to bring back patients who had lapsed?',
    help: 'A deliberate campaign, not the reminders that go out automatically.',
    options: CAMPAIGN_OPTIONS,
  },
] as const;

/** Seconds a person needs per question. Used for the time-remaining line. */
export const SECONDS_PER_QUESTION = 10;

/** The label a given answer should show in a summary or a report table. */
export function answerLabel(id: keyof Answers, value: string | number): string {
  const question = QUESTIONS.find((q) => q.id === id);
  if (!question) return String(value);
  if (question.kind === 'number') return `${value} a week`;
  return question.options.find((o) => o.value === value)?.label ?? String(value);
}

/* -------------------------------------------------------------------------- */
/* The result screen                                                          */
/* -------------------------------------------------------------------------- */

export const RESULT = {
  eyebrow: 'Your estimate',
  headlineLabel: 'At least',
  headlineSuffix: 'a year',
  rangeLabel: (upper: string) => `Modelled range: up to ${upper} a year on the same answers.`,
  lead: 'This is a modelled estimate built from your nine answers, not a measurement of your practice. It is deliberately set at the low end of what the model produces, because the assessment that follows has to be able to beat it.',
  hoursLabel: 'Front-desk hours a year',
  hoursNote:
    'Time currently spent returning missed calls, chasing no-shows and working a dormant list by hand.',
  breakdownTitle: 'Where the estimate comes from',
  breakdownNote:
    'Each row is the top of that module’s own range. They sum to the upper figure above; the headline holds at sixty per cent of it.',
  thresholdWarning:
    'Under about 1,500 active records the reactivation arithmetic is working on a list too small to behave like one. The estimate still stands, but treat the Reactivate row as the softest of the four.',
  disclaimer:
    'No figure here is a forecast, a commitment or a result. It is arithmetic applied to nine answers, and every coefficient behind it is printed in the report.',
  reportTitle: 'The full report',
  reportLead:
    'Nine pages: how each module applies to the answers you gave, the inputs that produced each figure, what an assessment measures, and every coefficient used with the reasoning behind it.',
  reportCta: 'Email me the report',
  reportDownload: 'Download the report',
  reportPreparing: 'Preparing the report…',
  reportReady:
    'Your report has downloaded. It carries the same figures as this page and shows all of the working.',
  emailLabel: 'Work email',
  emailError: 'Enter a valid work email address.',
  nameLabel: 'Practice name',
  nameHelp: 'Optional. It goes on the cover of the report.',
  privacy:
    'We use your email to send the report and to follow up once. No client, patient or clinical information is collected by this tool.',
  unconfigured:
    'This deployment has nowhere to send your details, so nothing was sent and nothing was stored. The report is yours either way — it is built in your browser.',
  failed:
    'Your details could not be sent, so nothing was stored. The report is still yours: it is built in your browser, not on our server.',
  assessmentCta: 'Request the assessment that measures it',
} as const;

/* -------------------------------------------------------------------------- */
/* The modules, as this tool describes them                                   */
/* -------------------------------------------------------------------------- */

/**
 * Written for a practice owner rather than a technical buyer, and written here
 * rather than pulled from `content/modules.ts` so the report reads as one
 * document instead of an assembly of page copy.
 *
 * `connects` describes what the module plugs into operationally. No vendor is
 * named anywhere in this file: naming one would be a claimed integration, and
 * the claims register blocks those until they are live and permitted.
 */
export type CalculatorModule = {
  slug: ModuleSlug;
  name: string;
  /** The one-line job, on screen and in the report. */
  job: string;
  /** The leak, phrased so it reads as this practice's leak. */
  leak: string;
  /** Which derived inputs produced the figure. Values are filled at render. */
  drivers: readonly string[];
  connects: string;
  dashboard: string;
};

export const CALCULATOR_MODULES: readonly CalculatorModule[] = [
  {
    slug: 'answer',
    name: 'Answer',
    job: 'Picks up the calls your desk cannot get to.',
    leak: 'Calls that ring out, sit in a queue or arrive out of hours. A call nobody answers creates no record anywhere, so this is the only loss on the list that never appears in a management report.',
    drivers: [
      'Calls a year, at 2.5 for every completed appointment',
      'The share of them that goes unanswered, from how you handle an overflow',
      'The share of those callers who were ringing to book',
    ],
    connects:
      'Your phone system and your appointment diary. It sits behind the number you already publish and books into the diary you already keep; nobody is asked to dial differently.',
    dashboard:
      'Calls answered that would otherwise have rung out, what each caller wanted, and the appointments booked from them — counted only where the appointment exists in your system.',
  },
  {
    slug: 'respond',
    name: 'Respond',
    job: 'Answers a new enquiry while the person is still deciding.',
    leak: 'Web forms, messages and callback requests answered hours after they arrive. The enquiry is not lost, it is answered late, by which point it has usually been answered somewhere else first.',
    drivers: [
      'Enquiries a year, at 8 for every 100 completed appointments',
      'An assumed baseline conversion of 20%',
      'A conversion after fast response of 32%, capped below best case',
    ],
    connects:
      'The forms on your website, your shared inbox and your messaging channels. It reads what arrives and responds inside the window in which people still book.',
    dashboard:
      'Time to first response by channel and by hour, and the enquiries that became appointments — again, only where the appointment exists in your system.',
  },
  {
    slug: 'retain',
    name: 'Retain',
    job: 'Protects a schedule that is already full.',
    leak: 'No-shows and late cancellations. The appointment was made, the slot was held, and nothing arrived — so the practice paid for the capacity twice and collected nothing.',
    drivers: [
      'Appointments a year',
      'Your own no-show rate, or the default for your practice type',
      'A 20% reduction, set under the range this is usually worked at',
    ],
    connects:
      'Your appointment diary and your patient contact channels. It works the confirmation, the reminder and the gap that opens when one is declined.',
    dashboard:
      'No-shows and late cancellations by site, by day and by clinician, and the slots that were refilled after one.',
  },
  {
    slug: 'reactivate',
    name: 'Reactivate',
    job: 'Works the records that stopped moving.',
    leak: 'Patients and clients who have not been back and are not booked. They are already on your books, already know you, and cost nothing to acquire a second time.',
    drivers: [
      'Active records, from the band you chose',
      'The share of them assumed dormant for your practice type',
      'How recently you last worked that list, and a 12% return rate',
    ],
    connects:
      'Your records system and your contact channels. It segments the dormant list and works it in batches you approve, at a pace your desk can absorb.',
    dashboard:
      'The dormant list by how long since last visit, who was contacted, who replied, and who booked.',
  },
] as const;

/* -------------------------------------------------------------------------- */
/* The report                                                                 */
/* -------------------------------------------------------------------------- */

export const REPORT = {
  filename: 'grow-label-revenue-recovery-estimate.pdf',
  coverTitle: 'Revenue Recovery Estimate',
  coverSubtitle: 'A modelled estimate from nine answers',
  preparedFor: 'Prepared for',
  preparedOn: 'Prepared',
  headlineTitle: 'Recoverable revenue, modelled',
  headlineBody: [
    'This figure is a modelled estimate. It was produced by applying a fixed set of coefficients to the nine answers given, and it is not a measurement of your practice: nothing in it has been read from your systems, and no part of it has been observed.',
    'It is stated as "at least" on purpose. The model holds the headline at sixty per cent of what its own arithmetic produces, and rounds down at every stage, because this number exists to be beaten by the assessment that follows rather than to be defended.',
    'The paid revenue assessment is the measurement. It reads a defined window of your own contact and scheduling data and reports what was actually lost, priced from your own fee schedule.',
  ],
  hoursTitle: 'And the time it costs today',
  hoursBody:
    'Alongside the revenue, an estimate of the front-desk hours a year currently spent returning missed calls, chasing no-shows and working a lapsed list by hand. Owners who argue with a revenue figure rarely argue with the hours.',
  inputsTitle: 'The answers this was built from',
  inputsBody:
    'Nine inputs, exactly as given. If any line here is wrong the figure is wrong with it, and the fastest way to a better estimate is to correct the line and run it again.',
  modulesTitle: 'The four modules, against your answers',
  connectsLabel: 'What it works with',
  dashboardLabel: 'What you would see reported',
  driversLabel: 'What produced this figure',
  leakLabel: 'The leak',
  estimateLabel: 'Estimated a year',
  diagramTitle: 'How the four connect',
  diagramBody:
    'Each module works a different loss and none of them shares a definition with another, so nothing is counted twice. What they produce lands in one recovery layer, and that layer reports at four separate stages — estimated, booked, attended and collected. Only the last of those is revenue.',
  diagramFooter:
    'A figure is promoted from one stage to the next only on a record in your own system, never on an outcome we inferred.',
  nextTitle: 'What happens next',
  nextBody:
    'The revenue assessment is the paid engagement this estimate points at. It is a measurement exercise, deliberately not a pilot, and it commits neither side to anything beyond it.',
  nextSteps: [
    {
      key: 'What it measures',
      detail:
        'Where demand was lost across a defined historical window — by channel, by site and by hour — using your definitions, and the value of it priced from your own fee schedule.',
    },
    {
      key: 'What it needs',
      detail:
        'A read-only export of contact and scheduling data for the window, and your fee schedule. No clinical records, no treatment notes, and nothing is installed or changed in your systems.',
    },
    {
      key: 'How long it takes',
      detail:
        'A scoping call to agree the window and the definitions, then the written analysis back inside three weeks of the data arriving.',
    },
    {
      key: 'What you keep',
      detail:
        'The written analysis, whether or not you go further. It is yours, including the parts that say a loss is smaller than this estimate suggested.',
    },
  ],
  methodologyTitle: 'Methodology and limits',
  methodologyBody: [
    'Everything below is the whole of the working. Nobody else shows theirs, which is the reason this page exists: a number you can audit is worth more than a number you cannot, even when the auditable one is smaller.',
    'The coefficients are fixed. They are not tuned per practice, they are not drawn from your sector, and they do not adjust to make a result look better. Each one is set at or below the conservative end of the range the operation is usually worked at.',
  ],
  limitsTitle: 'What this estimate is not',
  limits: [
    'It is not a measurement. No part of it has been read from your systems.',
    'It is not a forecast. It describes the size of an opportunity, not the likelihood of collecting it.',
    'It is not revenue. Recovered value becomes revenue only once it is collected, and it is gross rather than margin.',
    'It is not a benchmark, and it is not a comparison against other practices. No published average describes a specific practice.',
    'It is not a commitment. Actual recoverable revenue varies by practice, and no figure in this document is promised.',
  ],
  coefficientsTitle: 'Every coefficient used',
  basisTitle: 'Where the ranges come from',
  basisBody:
    'Each coefficient above is set at or beneath the conservative end of the range the underlying operation is commonly worked at, and several are set well beneath it. Where a range is wide, the model takes the bottom of it. Where an input was answered "not sure", the model takes the default for the practice type rather than the most favourable option.',
  footer: 'Grow Label · Revenue recovery for veterinary and dental groups',
} as const;

/**
 * The commercial terms of the assessment, as the report states them.
 *
 * REVIEW BEFORE PUBLISHING. This is a commercial commitment, not a description
 * of designed behaviour, and it is the one statement in this feature that
 * cannot be checked against anything else in the repository — there is no
 * engagement letter here to check it against. The wording below is the
 * conservative form of what was asked for; confirm it against the contract that
 * will actually be signed, and keep the row in docs/CLAIMS_REGISTER.md current.
 */
export const ASSESSMENT_GUARANTEE = {
  title: 'The guarantee',
  body: 'If the assessment does not identify recoverable revenue worth at least what the assessment cost, the fee is returned in full. You keep the written analysis either way. The guarantee covers the assessment fee and nothing beyond it: no result from any module is guaranteed, and no figure in this report is promised.',
} as const;
