/**
 * ILLUSTRATIVE CONTENT — the single place invented figures are allowed to live.
 *
 * ---------------------------------------------------------------------------
 * READ THIS BEFORE EDITING
 * ---------------------------------------------------------------------------
 * Every number, quotation, person and organisation in this file is fabricated.
 * None of it describes a real engagement, a real client or a real outcome. It
 * exists so the results, case-study and testimonial surfaces can be reviewed,
 * presented and signed off with finished content in them.
 *
 * Two rules keep that safe, and both are enforced by
 * `tests/unit/content-integrity.test.ts`:
 *
 *   1. No invented figure appears anywhere else in `src/`. If a number needs to
 *      be shown on a page, it is added here and imported.
 *   2. Every surface that renders anything from this file also renders its
 *      label — "Illustrative example" or "Placeholder case study" — visibly,
 *      next to the content, not in a footnote.
 *
 * ---------------------------------------------------------------------------
 * REPLACING THIS WITH REAL EVIDENCE
 * ---------------------------------------------------------------------------
 * When a client result is approved for publication:
 *
 *   - Replace the entry here, set `illustrative: false` on it, and supply
 *     `period` and `approved` (the date the client signed the wording off).
 *   - The label disappears on its own; no component changes.
 *   - Add the row to `docs/CLAIMS_REGISTER.md` with the evidence behind it.
 *
 * Do not part-replace an entry. A card with a real figure and an invented
 * quotation on it is worse than an entirely invented card, because nothing on
 * the page tells a reader which half is which.
 *
 * ---------------------------------------------------------------------------
 * WHAT IS NO LONGER HERE
 * ---------------------------------------------------------------------------
 * Written and video testimonials used to live in this file as fabricated
 * placeholders. They are now real, named, released clients and live in
 * `src/content/testimonials.ts`, which carries its own rules. What remains
 * here is the results worked example and the case studies, both of which are
 * still invented and still labelled on every surface that renders them.
 */

/* -------------------------------------------------------------------------- */
/* Labels                                                                     */
/* -------------------------------------------------------------------------- */

export const ILLUSTRATIVE = {
  /** The badge shown on any surface carrying a figure from this file. */
  tag: 'Illustrative example',
  /** The badge shown on a case-study card or page. */
  caseTag: 'Placeholder case study',
  /** The badge for a slot waiting on a media asset rather than on evidence. */
  mediaTag: 'Media to follow',
  /** The sentence shown beside the badge wherever there is room for one. */
  notice:
    'Figures shown here are modelled to demonstrate how a result is reported. They are not client results and no engagement described on this page has taken place.',
  /** The shorter form, for cards and tight strips. */
  shortNotice: 'Modelled figures, not client results.',
} as const;

/* -------------------------------------------------------------------------- */
/* Results — one illustrative engagement, reported at four stages             */
/* -------------------------------------------------------------------------- */

export type StageFigure = {
  stage: 'Estimated' | 'Booked' | 'Attended' | 'Collected';
  value: string;
  /** Bar width, kept proportional to `value` against the Estimated figure. */
  width: string;
  basis: string;
  hint: string;
  tone: string;
};

export type MetricTile = {
  id: string;
  value: string;
  unit?: string;
  label: string;
  basis: string;
  /** Which module the figure belongs to, for the reader who wants the route. */
  module: string;
  href: string;
};

/**
 * The engagement the figures below describe. Invented: a six-site veterinary
 * group over a full year. Stated on the page so the numbers are read as one
 * scenario rather than as a general claim.
 */
export const ILLUSTRATIVE_ENGAGEMENT = {
  subject: 'A six-site veterinary group',
  period: 'Twelve months, modelled',
  scope: 'Four modules live · one practice management system · one telephony estate',
} as const;

export const ILLUSTRATIVE_STAGES: StageFigure[] = [
  {
    stage: 'Estimated',
    value: '$486,200',
    width: '100%',
    basis: 'Modelled from the group’s own fee schedule',
    hint: 'Opportunity detected',
    tone: 'var(--gl-stage-1)',
  },
  {
    stage: 'Booked',
    value: '$312,400',
    width: '64%',
    basis: 'Appointment records in the practice management system',
    hint: 'A date exists',
    tone: 'var(--gl-stage-2)',
  },
  {
    stage: 'Attended',
    value: '$268,900',
    width: '55%',
    basis: 'Attendance status in the practice management system',
    hint: 'The appointment happened',
    tone: 'var(--gl-stage-3)',
  },
  {
    stage: 'Collected',
    value: '$221,700',
    width: '46%',
    basis: 'Payments recorded against the group ledger',
    hint: 'The only figure that is revenue',
    tone: 'var(--gl-stage-4)',
  },
];

/**
 * The operational figures underneath the money. Deliberately varied in shape —
 * counts, medians, depths and hours — because a column of identically framed
 * percentages is the tell of an invented results section.
 */
export const ILLUSTRATIVE_METRICS: MetricTile[] = [
  {
    id: 'missed-calls',
    value: '3,184',
    label: 'Missed calls answered',
    basis: 'Calls that rang out, abandoned in queue or arrived out of hours, answered instead.',
    module: 'Answer',
    href: '/modules/answer',
  },
  {
    id: 'response-time',
    value: '9 min',
    label: 'Median first response',
    basis: 'Across web and message enquiries, against 6h 40m at the start of the window.',
    module: 'Respond',
    href: '/modules/respond',
  },
  {
    id: 'reactivation',
    value: '1,470',
    label: 'Dormant records worked',
    basis: 'Clients past their expected return interval, contacted to a stop rule. 388 returned.',
    module: 'Reactivate',
    href: '/modules/reactivate',
  },
  {
    id: 'recalls',
    value: '92%',
    label: 'Recall list depth reached',
    basis: 'How far the overdue wellness and vaccination list was worked each cycle, from 54%.',
    module: 'Reactivate',
    href: '/modules/reactivate',
  },
  {
    id: 'backfill',
    value: '612',
    label: 'Released slots refilled',
    basis: 'Consult and theatre capacity offered and filled inside the horizon it could still be.',
    module: 'Retain',
    href: '/modules/retain',
  },
  {
    id: 'no-shows',
    value: '7.9%',
    label: 'Non-attendance rate',
    basis: 'Booked appointments not attended, against 11.4% in the same period a year earlier.',
    module: 'Retain',
    href: '/modules/retain',
  },
  {
    id: 'hours',
    value: '71 hrs',
    label: 'Front-desk hours returned',
    basis: 'Per month across six sites: call-backs, confirmations, list work and report assembly.',
    module: 'All four',
    href: '/modules',
  },
  {
    id: 'roi',
    value: '4.6:1',
    label: 'Collected value to platform fee',
    basis: 'Collected value only. Gross, before the cost of delivering the recovered work.',
    module: 'Reporting',
    href: '/platform#value-stages',
  },
];

/**
 * The one line under the figures.
 *
 * Deliberately short. The previous version ran to three sentences and ended on
 * "there is no engagement behind them", which read as an apology for the
 * section rather than a note on it — and a results section that apologises for
 * itself is not a results section. This says what the numbers are, what they
 * are not, and what a real one carries instead. Nothing more.
 */
export const ILLUSTRATIVE_RESULTS_NOTE =
  'A worked example of the reporting, using the engagement stated above. A client’s own report carries its period, its cut-off date and a link to every event behind each figure.';

/* -------------------------------------------------------------------------- */
/* Case studies                                                               */
/* -------------------------------------------------------------------------- */

export type CaseStudy = {
  slug: string;
  /** True while the study is fabricated. Drives the badge on every surface. */
  illustrative: boolean;
  sector: 'Veterinary' | 'Dental';
  sectorSlug: 'veterinary' | 'dental';
  /** The shape of the organisation, e.g. "Six sites · 14 vets". */
  shape: string;
  title: string;
  summary: string;
  chips: string[];
  period: string;
  /** Two hues drive the card artwork so the set differs at a glance. */
  hue: number;
  /** The headline pair shown on the card. */
  headline: { value: string; label: string }[];
  profile: { key: string; detail: string }[];
  situation: string[];
  found: { key: string; detail: string }[];
  changed: { key: string; detail: string }[];
  stages: { stage: string; value: string; basis: string }[];
  metrics: { value: string; label: string; basis: string }[];
  quote: { text: string; name: string; role: string; org: string };
  caveats: string[];
};

export const CASE_STUDIES: CaseStudy[] = [
  /* ---------------------------------------------------------------- vet 01 */
  {
    slug: 'after-hours-demand-veterinary-group',
    illustrative: true,
    sector: 'Veterinary',
    sectorSlug: 'veterinary',
    shape: 'Six sites · one shared phone number',
    title: 'After-hours demand across a six-site veterinary group',
    summary:
      'A third of the group’s inbound contact arrived when no site was open. None of it reached a system anybody reported on.',
    chips: ['Answer', 'Respond', 'Multi-site'],
    period: 'Twelve months, modelled',
    hue: 248,
    headline: [
      { value: '3,184', label: 'calls answered that would have rung out' },
      { value: '$312,400', label: 'booked value from recovered contact' },
    ],
    profile: [
      { key: 'Shape', detail: 'Six sites, one shared number, overflow routed by site' },
      {
        key: 'Systems read',
        detail: 'Telephony estate, practice management system, web enquiries',
      },
      { key: 'Modules live', detail: 'Answer, then Respond from month three' },
      { key: 'Reporting', detail: 'Estimated, booked, attended and collected, by site' },
    ],
    situation: [
      'The group knew its call volume and knew its booking count. It had never put the two together, because the phone system and the practice management system produced separate reports and nobody owned the gap between them.',
      'An unanswered call creates no record in a practice management system. It leaves one line in a telephony log, in a column most owners have never opened. So the loss was consistently described at management meetings as a staffing pressure rather than as demand arriving and leaving.',
    ],
    found: [
      {
        key: 'The loss had a timetable',
        detail:
          'Unanswered calls clustered against the same three windows every week: the hour before opening, the middle of the theatre list, and the forty minutes after the last consult.',
      },
      {
        key: 'Weekends were a third of it',
        detail:
          'Saturday and Sunday contact went to an answerphone that produced no worklist. Around one in four of those callers rang a different practice on the Monday.',
      },
      {
        key: 'Repeat attempts were being counted as volume',
        detail:
          'The same number calling three times in an hour looked like three enquiries in the telephony report and one abandoned owner in reality.',
      },
    ],
    changed: [
      {
        key: 'Every call now produces a record',
        detail:
          'Answered inside the approved booking scope, or captured with the reason for the call and queued to a named owner. The desk starts the day with a list instead of a guess.',
      },
      {
        key: 'Out-of-hours contact is worked at opening',
        detail:
          'Overnight and weekend contact is sequenced by how long it has been waiting, so the oldest enquiry is not the last one anybody reaches.',
      },
      {
        key: 'Clinical urgency leaves immediately',
        detail:
          'Anything that sounds urgent is routed to the group’s own emergency route, unanswered, on every channel and at every hour.',
      },
    ],
    stages: [
      { stage: 'Estimated', value: '$486,200', basis: 'Modelled from the group’s fee schedule' },
      { stage: 'Booked', value: '$312,400', basis: 'Appointment records linked to a source call' },
      { stage: 'Attended', value: '$268,900', basis: 'Attendance status in the practice system' },
      { stage: 'Collected', value: '$221,700', basis: 'Payments against the group ledger' },
    ],
    metrics: [
      {
        value: '3,184',
        label: 'Calls answered that would have rung out',
        basis: 'Counted against the telephony event, with a transcript attached to each.',
      },
      {
        value: '31%',
        label: 'Of inbound contact arrived out of hours',
        basis: 'Across twelve months, measured by arrival time rather than by call length.',
      },
      {
        value: '9 min',
        label: 'Median first response on out-of-hours enquiries',
        basis: 'From arrival to first substantive reply, not to an automated acknowledgement.',
      },
      {
        value: '71 hrs',
        label: 'Front-desk hours returned each month',
        basis: 'Call-backs and message triage that no longer start the morning at the desk.',
      },
    ],
    quote: {
      text: 'We were not short of demand. We were short of a record that demand had arrived. The first month of this was mostly a management conversation about the rota, and it started with a list we had never had before.',
      name: 'Rachel Odume',
      role: 'Group Operations Director',
      org: 'Ashcroft Veterinary Group',
    },
    caveats: [
      'Collected value is gross. It takes no account of the cost of delivering the recovered work, or of capacity that would have been filled by something else.',
      'Attribution is a model applied to a sequence of events. Some of these owners would have called back without any contact from us.',
    ],
  },

  /* ---------------------------------------------------------------- vet 02 */
  {
    slug: 'wellness-recalls-veterinary',
    illustrative: true,
    sector: 'Veterinary',
    sectorSlug: 'veterinary',
    shape: 'Three sites · one practice management system',
    title: 'Wellness plans and vaccination recalls that lapsed quietly',
    summary:
      'The recall list was generated reliably every month and worked to a different depth every month. Nobody could say where it stopped.',
    chips: ['Reactivate', 'Recall', 'Back book'],
    period: 'Nine months, modelled',
    hue: 262,
    headline: [
      { value: '1,470', label: 'dormant records worked to a stop rule' },
      { value: '92%', label: 'recall list depth reached each cycle' },
    ],
    profile: [
      { key: 'Shape', detail: 'Three sites, nine vets, one shared recall list' },
      { key: 'Systems read', detail: 'Practice management system, plan status, suppression flags' },
      { key: 'Modules live', detail: 'Reactivate' },
      { key: 'Reporting', detail: 'Estimated, booked, attended and collected, by record type' },
    ],
    situation: [
      'The list was never the problem. It was produced accurately every month, sorted by due date, and worked from the top by whoever had a quiet half hour. What varied was how far down it anybody got.',
      'Because there was no record of where the work stopped, the same records at the top were contacted repeatedly and the same records at the bottom were never contacted at all. The practice could report how many calls it made and could not report how much of the list it had covered.',
    ],
    found: [
      {
        key: 'The list was three lists',
        detail:
          'Records past a wellness interval, plans that had stopped being paid, and vaccinations overdue by more than a season. Different intent, different sequence, merged into one spreadsheet.',
      },
      {
        key: 'Depth stopped at about half',
        detail:
          'Across the preceding six cycles the list was worked to roughly 54% before the next one was generated. The remainder was not deferred; it was replaced.',
      },
      {
        key: 'Contact volume was uncapped',
        detail:
          'Records near the top had been approached six or seven times in a year, which is how a practice annoys the clients it most wants back.',
      },
    ],
    changed: [
      {
        key: 'One sequence per list, with a stop rule',
        detail:
          'A fixed number of attempts across approved channels, then a close with a recorded reason. A record is either brought back or set down deliberately.',
      },
      {
        key: 'Depth became a reported number',
        detail:
          'How far the list was worked is now a figure on the monthly report, alongside how many bookings came out of it.',
      },
      {
        key: 'Intervals stayed clinical',
        detail:
          'Which records are due, and when, remains the practice’s decision. Reactivate reads the due date; it never sets one and never advises on one.',
      },
    ],
    stages: [
      { stage: 'Estimated', value: '$164,900', basis: 'Modelled from the practice fee schedule' },
      { stage: 'Booked', value: '$98,300', basis: 'Appointments linked to a worked record' },
      { stage: 'Attended', value: '$81,600', basis: 'Attendance status in the practice system' },
      { stage: 'Collected', value: '$70,400', basis: 'Payments against the practice ledger' },
    ],
    metrics: [
      {
        value: '1,470',
        label: 'Dormant records worked',
        basis: 'Past their expected return interval, contacted inside the agreed attempt cap.',
      },
      {
        value: '388',
        label: 'Records that returned',
        basis: 'An appointment exists in the practice management system against the record.',
      },
      {
        value: '92%',
        label: 'List depth reached per cycle',
        basis: 'Measured against 54% across the six cycles before the module went live.',
      },
      {
        value: '0',
        label: 'Contacts sent to a suppressed record',
        basis: 'Suppression is applied across every module, immediately and without exception.',
      },
    ],
    quote: {
      text: 'The number I could never produce was how much of the list we had actually covered. We could tell you how many calls we made. That is not the same thing, and the difference turned out to be about half the list.',
      name: 'Alan Brackley',
      role: 'Practice Manager',
      org: 'Halewood Veterinary Centre',
    },
    caveats: [
      'Some of these clients were due to return and would have booked without contact. That is why assisted attribution exists as a separate status.',
      'Recall intervals are set by the practice as a clinical decision. Nothing here evaluates whether an interval is correct.',
    ],
  },

  /* ---------------------------------------------------------------- vet 03 */
  {
    slug: 'released-capacity-veterinary',
    illustrative: true,
    sector: 'Veterinary',
    sectorSlug: 'veterinary',
    shape: 'Four sites · consult and theatre capacity',
    title: 'Consult and theatre time released on the day',
    summary:
      'Cancellations were being recorded as cancellations. The unused hour behind each one was not being recorded at all.',
    chips: ['Retain', 'Backfill', 'Capacity'],
    period: 'Six months, modelled',
    hue: 234,
    headline: [
      { value: '612', label: 'released slots refilled inside their horizon' },
      { value: '7.9%', label: 'non-attendance rate, from 11.4%' },
    ],
    profile: [
      { key: 'Shape', detail: 'Four sites, consult rooms and two theatre lists' },
      { key: 'Systems read', detail: 'Appointment book, cancellation events, waiting demand' },
      { key: 'Modules live', detail: 'Retain' },
      {
        key: 'Reporting',
        detail: 'Estimated, booked, attended and collected, by appointment type',
      },
    ],
    situation: [
      'A slot released at nine in the morning for a two o’clock appointment is a specific, small job with a short window: work out who could take it, contact them in a channel they read, and confirm before the time passes. Every step is minor. Together they take longer than the quiet moment available to do them in.',
      'So the work was deferred until the gap was no longer fillable, and the loss was recorded as a cancellation rather than as unused capacity. Those are different problems with different owners.',
    ],
    found: [
      {
        key: 'The horizon differed by appointment type',
        detail:
          'A routine consult could be refilled the same morning. A theatre slot generally could not, and treating both as one queue meant the fillable ones aged behind the unfillable ones.',
      },
      {
        key: 'Confirmations were inconsistent',
        detail:
          'Confirmation messages went out when somebody remembered, which made non-attendance look random when it was mostly unconfirmed.',
      },
      {
        key: 'Waiting demand was not written down',
        detail:
          'Who would take an earlier slot lived in the heads of two receptionists at two of the four sites.',
      },
    ],
    changed: [
      {
        key: 'Released capacity became a queue with a deadline',
        detail:
          'Each appointment type carries the horizon in which it can still realistically be filled, and offers go out in a defined order inside it.',
      },
      {
        key: 'Confirmations run on a schedule',
        detail:
          'Sent, chased and recorded against the appointment, so an unconfirmed booking is visible before the day rather than after it.',
      },
      {
        key: 'Clinical suitability stayed at the practice',
        detail:
          'Which appointment types may be offered to whom is a whitelist the practice sets. Anything outside it is routed to a person with the context attached.',
      },
    ],
    stages: [
      { stage: 'Estimated', value: '$207,500', basis: 'Modelled from the group’s fee schedule' },
      { stage: 'Booked', value: '$141,800', basis: 'Refilled appointments linked to a release' },
      { stage: 'Attended', value: '$124,300', basis: 'Attendance status in the practice system' },
      { stage: 'Collected', value: '$109,600', basis: 'Payments against the group ledger' },
    ],
    metrics: [
      {
        value: '612',
        label: 'Released slots refilled',
        basis: 'Offered and filled inside the horizon agreed for that appointment type.',
      },
      {
        value: '2h 10m',
        label: 'Median time from release to offer',
        basis: 'From the cancellation event to the first offer reaching a suitable client.',
      },
      {
        value: '7.9%',
        label: 'Non-attendance rate',
        basis: 'Against 11.4% in the equivalent period a year earlier, same sites.',
      },
      {
        value: '38 hrs',
        label: 'Clinician hours put back into use',
        basis: 'Consult and theatre time refilled that had previously been released and left open.',
      },
    ],
    quote: {
      text: 'We had a cancellation rate we could quote and an empty-room number we could not. Once the empty room had a price on it the conversation about who refills it took about ten minutes.',
      name: 'Sofia Renshaw',
      role: 'Head of Operations',
      org: 'Northbank Veterinary Partners',
    },
    caveats: [
      'A refilled slot is not always incremental. Some of these clients would have been seen later in the same month.',
      'Non-attendance is affected by many things at once. Nothing here isolates the effect of confirmations from everything else that changed.',
    ],
  },

  /* ------------------------------------------------------------- dental 01 */
  {
    slug: 'accepted-unscheduled-treatment-dental',
    illustrative: true,
    sector: 'Dental',
    sectorSlug: 'dental',
    shape: 'Single site · five providers',
    title: 'Treatment accepted in the chair and never given a date',
    summary:
      'The highest-intent demand in the practice was sitting in the plan list, agreed, priced and unscheduled.',
    chips: ['Retain', 'Chair time', 'Acceptance'],
    period: 'Nine months, modelled',
    hue: 268,
    headline: [
      { value: '$184,600', label: 'accepted and unscheduled at the start' },
      { value: '419', label: 'plans given a date' },
    ],
    profile: [
      { key: 'Shape', detail: 'One practice, five providers, two hygienists' },
      { key: 'Systems read', detail: 'Plan scheduling status, appointment book, consent state' },
      { key: 'Modules live', detail: 'Retain, with Reactivate on plans older than six months' },
      { key: 'Reporting', detail: 'Estimated, booked, attended and collected, by provider' },
    ],
    situation: [
      'Treatment was discussed, the patient agreed, and then the appointment was not made before they left. The plan sat in the system as an accepted, unscheduled item — qualified, priced and entirely unworked.',
      'Nobody owned the list. It was visible to anyone who went looking for it, which in practice meant it was reviewed when a quiet week made somebody curious.',
    ],
    found: [
      {
        key: 'Acceptance was not the problem',
        detail:
          'Plans were being accepted at a healthy rate. The distance between accepted and attended was where the value was going, and it was different for every provider.',
      },
      {
        key: 'Age mattered more than value',
        detail:
          'A plan given a date inside a week behaved very differently from one approached at ninety days, regardless of what it was worth.',
      },
      {
        key: 'The list had no stop rule',
        detail:
          'Where it was worked at all, patients were contacted until somebody felt uncomfortable continuing rather than until an agreed limit was reached.',
      },
    ],
    changed: [
      {
        key: 'Unscheduled plans became a tracked queue',
        detail:
          'Each accepted plan carries an owner, an age and a due time, and appears on a worklist rather than in a report nobody opens.',
      },
      {
        key: 'Provider view, same four stages',
        detail:
          'Acceptance-to-attendance is reported per provider on identical definitions, which is the only way that comparison means anything.',
      },
      {
        key: 'Plan content is never read',
        detail:
          'Only whether an accepted plan has an appointment attached. What the treatment is stays clinical and stays in the practice.',
      },
    ],
    stages: [
      {
        stage: 'Estimated',
        value: '$184,600',
        basis: 'Accepted plan value from the practice’s own pricing',
      },
      { stage: 'Booked', value: '$126,900', basis: 'Plans with an appointment attached' },
      { stage: 'Attended', value: '$104,200', basis: 'Attendance status in the practice system' },
      { stage: 'Collected', value: '$92,800', basis: 'Payments against the practice ledger' },
    ],
    metrics: [
      {
        value: '419',
        label: 'Accepted plans given a date',
        basis: 'An appointment exists against the plan in the practice management system.',
      },
      {
        value: '11 days',
        label: 'Median age at first contact',
        basis: 'Down from 63 days, measured from acceptance to the first scheduling approach.',
      },
      {
        value: '3',
        label: 'Contact attempts per plan, capped',
        basis: 'Then a close with a recorded reason. The cap is set by the practice.',
      },
      {
        value: '26 hrs',
        label: 'Reception hours returned each month',
        basis: 'Plan-list review and manual follow-up that no longer sits at the front desk.',
      },
    ],
    quote: {
      text: 'Every one of these people had already said yes. We were spending on marketing to find new patients while the ones who had agreed to treatment were ageing in a list nobody owned.',
      name: 'Tom Fairweather',
      role: 'Principal Dentist',
      org: 'Bellwether Dental Care',
    },
    caveats: [
      'A plan given a date is not revenue. Only the collected figure is, and it is gross.',
      'Provider comparisons reflect case mix as much as behaviour. The reporting shows the distance; it does not explain it.',
    ],
  },

  /* ------------------------------------------------------------- dental 02 */
  {
    slug: 'hygiene-recall-depth-dental',
    illustrative: true,
    sector: 'Dental',
    sectorSlug: 'dental',
    shape: 'Four practices · shared recall policy',
    title: 'How far down the hygiene list the practice actually gets',
    summary:
      'Where the list stops being worked is where the revenue stops. That line was moving every week and nobody was measuring it.',
    chips: ['Reactivate', 'Recall', 'Group view'],
    period: 'Twelve months, modelled',
    hue: 240,
    headline: [
      { value: '88%', label: 'recall list depth reached per cycle' },
      { value: '$118,400', label: 'collected value from recall work' },
    ],
    profile: [
      { key: 'Shape', detail: 'Four practices under one group recall policy' },
      { key: 'Systems read', detail: 'Recall due dates, interval rules, consent and suppression' },
      { key: 'Modules live', detail: 'Reactivate' },
      { key: 'Reporting', detail: 'Estimated, booked, attended and collected, by practice' },
    ],
    situation: [
      'Hygiene runs on fixed intervals and the list is generated reliably. It is then worked as far down as the day allows, which is a different depth in a busy week than in a quiet one.',
      'Across four practices on the same policy, the variation between sites was larger than the variation between months at any one site — and none of it appeared in the group report.',
    ],
    found: [
      {
        key: 'Depth varied by practice, not by demand',
        detail:
          'The two busiest reception desks reached the shallowest depth. The correlation was with desk load, not with patient behaviour.',
      },
      {
        key: 'Overdue records aged out of the list',
        detail:
          'Once a record passed a certain age it stopped appearing at the top of any sort, and was effectively never worked again.',
      },
      {
        key: 'Channel choice was per-receptionist',
        detail:
          'Some patients were phoned, some were texted, some were emailed, and there was no record of which had been tried.',
      },
    ],
    changed: [
      {
        key: 'One sequence, four practices',
        detail:
          'The same channels, the same attempt cap and the same stop rule everywhere, so the depth figure compares across sites.',
      },
      {
        key: 'Aged records get their own pass',
        detail:
          'Records past the point where a standard recall makes sense are worked as a separate, lower-frequency sequence rather than falling off the bottom.',
      },
      {
        key: 'Consent state leads every contact',
        detail:
          'Suppression and channel permissions are read before anything is sent, on every attempt, across every practice.',
      },
    ],
    stages: [
      {
        stage: 'Estimated',
        value: '$241,300',
        basis: 'Modelled from the group’s published prices',
      },
      {
        stage: 'Booked',
        value: '$157,200',
        basis: 'Hygiene appointments linked to a worked record',
      },
      { stage: 'Attended', value: '$133,900', basis: 'Attendance status in each practice system' },
      { stage: 'Collected', value: '$118,400', basis: 'Payments against the practice ledgers' },
    ],
    metrics: [
      {
        value: '88%',
        label: 'List depth reached per cycle',
        basis: 'Group mean, against a range of 39% to 71% before the module went live.',
      },
      {
        value: '2,940',
        label: 'Overdue records contacted',
        basis: 'Inside the attempt cap, across approved channels only.',
      },
      {
        value: '17 pts',
        label: 'Spread between best and worst practice',
        basis: 'Depth reached, best site to worst. It was 32 points at the start of the window.',
      },
      {
        value: '4',
        label: 'Practices on one set of definitions',
        basis: 'The reason the comparison above is worth putting in front of a board.',
      },
    ],
    quote: {
      text: 'We had four practices reporting recall performance four different ways, all of them honestly. Putting them on one definition changed the management conversation more than the recovered value did.',
      name: 'Priya Nandakumar',
      role: 'Finance Director',
      org: 'Kingsmoor Dental Partners',
    },
    caveats: [
      'Depth is a measure of coverage, not of quality. A list worked deeply and badly is worse than one worked shallowly and well.',
      'No comparison here is against any practice outside the group. No industry average or benchmark is used anywhere.',
    ],
  },

  /* ------------------------------------------------------------- dental 03 */
  {
    slug: 'new-patient-response-time-dental',
    illustrative: true,
    sector: 'Dental',
    sectorSlug: 'dental',
    shape: 'Two sites · private and plan mix',
    title: 'New-patient enquiries answered the following morning',
    summary:
      'High-value enquiries were arriving in the evening and being replied to at half past nine the next day, by which time the decision had moved on.',
    chips: ['Respond', 'Answer', 'New patients'],
    period: 'Six months, modelled',
    hue: 254,
    headline: [
      { value: '9 min', label: 'median first response, from 6h 40m' },
      { value: '$96,300', label: 'collected value from recovered enquiries' },
    ],
    profile: [
      { key: 'Shape', detail: 'Two sites, mixed private and plan patients' },
      { key: 'Systems read', detail: 'Web forms, message channels, telephony, appointment book' },
      { key: 'Modules live', detail: 'Respond, with Answer on the main line' },
      { key: 'Reporting', detail: 'Estimated, booked, attended and collected, by channel' },
    ],
    situation: [
      'Enquiries for higher-value treatment arrived through a web form, mostly between seven and ten in the evening. They were read the next morning and answered somewhere in the middle of it.',
      'The practice had a response-time target. It had no measurement of the actual interval, because the clock was being started when somebody opened the message rather than when the patient sent it.',
    ],
    found: [
      {
        key: 'The clock was being started in the wrong place',
        detail:
          'Measured from arrival rather than from first read, the median first response was 6h 40m and the worst day of the week was Monday.',
      },
      {
        key: 'An acknowledgement is not a response',
        detail:
          'Automated confirmations were counted internally as replies, which made the reported number roughly forty times better than the real one.',
      },
      {
        key: 'Evening arrivals were the highest value',
        detail:
          'The enquiries most likely to be for larger treatment were also the ones most likely to wait overnight.',
      },
    ],
    changed: [
      {
        key: 'First response inside the window that still converts',
        detail:
          'Enquiries are answered substantively, in the channel they arrived on, with a real slot offered rather than a promise to call back.',
      },
      {
        key: 'The interval is measured from arrival',
        detail:
          'Arrival to first substantive reply, per channel, per site, per hour. Acknowledgements are excluded from the figure.',
      },
      {
        key: 'Anything clinical routes to the practice',
        detail:
          'A question about symptoms, suitability or treatment is handed to a person immediately and unanswered. No module offers an opinion.',
      },
    ],
    stages: [
      { stage: 'Estimated', value: '$198,700', basis: 'Modelled from the practice fee schedule' },
      { stage: 'Booked', value: '$124,500', basis: 'Appointments linked to a source enquiry' },
      { stage: 'Attended', value: '$107,100', basis: 'Attendance status in the practice system' },
      { stage: 'Collected', value: '$96,300', basis: 'Payments against the practice ledger' },
    ],
    metrics: [
      {
        value: '9 min',
        label: 'Median first response',
        basis: 'Arrival to first substantive reply, against 6h 40m at the start of the window.',
      },
      {
        value: '1,106',
        label: 'Enquiries answered outside desk hours',
        basis: 'Arriving between closing and opening, across both sites.',
      },
      {
        value: '64%',
        label: 'Of enquiries arrived after 17:00',
        basis: 'By arrival timestamp, across web form and message channels.',
      },
      {
        value: '0',
        label: 'Clinical questions answered by a module',
        basis:
          'Every one routed to the practice, unanswered. This is a hard boundary, not a target.',
      },
    ],
    quote: {
      text: 'Our reported response time was under a minute and our real one was most of a working day. Both numbers were produced honestly. Only one of them was measuring the thing the patient experiences.',
      name: 'Mark Ellery',
      role: 'Managing Partner',
      org: 'Verity Dental Group',
    },
    caveats: [
      'Faster replies coincided with a change to the enquiry form. Nothing here separates the two effects.',
      'Estimated value describes the size of an opportunity, not the likelihood of it converting.',
    ],
  },
];

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return CASE_STUDIES.find((study) => study.slug === slug);
}
