/**
 * Homepage copy. The eight numbered beats follow the commercial narrative:
 * loss -> where it happens -> detection -> the four modules -> the four value
 * stages -> returned time -> evidence -> two sectors -> the ask.
 */

export const HERO = {
  eyebrow: 'Revenue recovery for veterinary & dental groups',
  /** Line breaks are a design decision, so the headline is authored as lines. */
  titleLines: ['Recover the revenue', 'you already earned.'],
  lead: 'Grow Label watches every call, enquiry, recall and open treatment plan your practice generates — then works the ones that were missed and reports what came back at four separate stages, so the number survives a board meeting.',
  modulesNote: 'Four modules, one recovery system',
  columnLabel: 'A working day',
  columnNote:
    'Every open slot in a working schedule is demand that already existed and did not arrive.',
} as const;

export type Leak = {
  index: string;
  title: string;
  detail: string;
  module: string;
  /** The module page that owns this loss, so a row is a path and not a label. */
  href: string;
};

/**
 * The six losses split at the only line that matters commercially: demand that
 * never became a booking, and bookings that never became attendance. The two
 * halves are worked by different modules and measured at different stages, so
 * the grouping is structural rather than decorative.
 */
export type LeakGroup = {
  id: string;
  title: string;
  note: string;
  leaks: Leak[];
};

export const LEAK_GROUPS: LeakGroup[] = [
  {
    id: 'before',
    title: 'Demand that never became a booking',
    note: 'Contact the practice paid to generate, which nobody was able to work in time.',
    leaks: [
      {
        index: '01',
        title: 'Unanswered calls',
        detail: 'Rung out, abandoned in the queue, or arriving outside opening hours.',
        module: 'Answer',
        href: '/modules/answer',
      },
      {
        index: '02',
        title: 'Slow first response',
        detail:
          'Enquiries and callback requests answered after the window in which people still book.',
        module: 'Respond',
        href: '/modules/respond',
      },
      {
        index: '03',
        title: 'Dormant records',
        detail: 'Clients and patients past their expected return interval, never contacted again.',
        module: 'Reactivate',
        href: '/modules/reactivate',
      },
    ],
  },
  {
    id: 'after',
    title: 'Bookings that never became attendance',
    note: 'Capacity that was committed, then quietly released with nothing put back into it.',
    leaks: [
      {
        index: '04',
        title: 'Late cancellations',
        detail: 'Slots released too close to the day to be refilled by hand.',
        module: 'Retain',
        href: '/modules/retain',
      },
      {
        index: '05',
        title: 'Non-attendance',
        detail: 'Booked appointments that were never confirmed and never arrived.',
        module: 'Retain',
        href: '/modules/retain',
      },
      {
        index: '06',
        title: 'Unused capacity',
        detail:
          'Rooms, chairs and clinician hours running below the schedule they were staffed for.',
        module: 'Retain',
        href: '/modules/retain',
      },
    ],
  },
];

/** Flat view, for anything that needs the six in order. */
export const LEAKS: Leak[] = LEAK_GROUPS.flatMap((group) => group.leaks);

export const LEAKS_SECTION = {
  eyebrow: 'Where it goes',
  titleLines: ['A busy practice and a leaking', 'one look identical.'],
  aside: 'Six points of loss',
  lead: 'Every one of these is demand the practice has already paid to generate. None of them appears on a profit and loss statement, because the transaction never happened — which is exactly why they persist.',
} as const;

/**
 * A single tracked opportunity, from the raw signal to the action taken.
 *
 * These are illustrations of the record shape, not client data. Nothing here
 * states an outcome the business has achieved: the stage names are the same
 * four the whole site uses, and no value is quoted, because a value only exists
 * once it has been priced against a real fee schedule.
 */
export type PipelineStep = {
  id: string;
  module: string;
  event: { channel: string; detail: string; stamp: string };
  opportunity: { ref: string; owner: string; due: string };
  action: { did: string; stage: string };
};

export const PIPELINE: PipelineStep[] = [
  {
    id: 'call',
    module: 'Answer',
    event: {
      channel: 'Inbound call',
      detail: 'Eight seconds, abandoned in the queue',
      stamp: '21:40 · Tue',
    },
    opportunity: { ref: 'OPP-4417', owner: 'Front desk', due: 'Within 15 minutes' },
    action: { did: 'Call returned, appointment made', stage: 'Booked' },
  },
  {
    id: 'form',
    module: 'Respond',
    event: {
      channel: 'Web enquiry',
      detail: 'New client form, no reply sent',
      stamp: '21:47 · Tue',
    },
    opportunity: { ref: 'OPP-4418', owner: 'Reception', due: 'Within 5 minutes of opening' },
    action: { did: 'First response sent, slot held', stage: 'Booked' },
  },
  {
    id: 'recall',
    module: 'Reactivate',
    event: {
      channel: 'Recall record',
      detail: 'Due in March, still open in September',
      stamp: '187 days · overdue',
    },
    opportunity: { ref: 'OPP-4419', owner: 'Recall list', due: 'This week' },
    action: { did: 'Contacted and scheduled', stage: 'Attended' },
  },
  {
    id: 'release',
    module: 'Retain',
    event: {
      channel: 'Schedule change',
      detail: 'Chair released at 48 hours notice',
      stamp: '14:05 · Thu',
    },
    opportunity: { ref: 'OPP-4420', owner: 'Schedule', due: 'Within 2 hours' },
    action: { did: 'Refilled from the waiting list', stage: 'Attended' },
  },
];

export const DETECTION = {
  eyebrow: 'Detection',
  titleLines: ['Detection is the whole job.', 'The rest is follow-through.'],
  aside: 'Event · opportunity · action',
  body: [
    'Grow Label connects to the systems a practice already runs — the phone system, the enquiry channels, the practice management system — and reads the events they emit. A call that lasted eight seconds. A form submitted at 21:40. A recall due in March that is still open in September.',
    'On its own an event is just a line in a log. Grow Label turns each one into a tracked opportunity with an owner, a due time and a value estimated from your own fee schedule — because until something has a deadline and a name against it, nobody can be held to it and nothing can be counted.',
  ],
  reads: [
    { key: 'Contact events', detail: 'When contact happened, on which channel, and how it ended.' },
    {
      key: 'Schedule state',
      detail: 'What is booked, what is open, and what has just been released.',
    },
    { key: 'Interval data', detail: 'Recalls, plan status and expected return dates.' },
    { key: 'Your own prices', detail: 'The published fee schedule, used only to estimate value.' },
  ],
  boundary:
    'None of this requires clinical records. It requires event data: when contact happened, on which channel, against which record, and what happened next.',
} as const;

export const TIME_RETURNED = {
  aside: 'The second return',
  title: 'The second return is hours back',
  titleEmphasis: 'at the front desk.',
  lead: 'Recovered revenue is the headline. The reason operations directors keep the system is that a list of recurring manual jobs stops landing on the same four people.',
  items: [
    {
      index: '01',
      title: 'Returning missed calls',
      detail: 'Worked from the event log rather than from whoever remembered the phone ringing.',
    },
    {
      index: '02',
      title: 'Sending and chasing confirmations',
      detail: 'Run on a schedule, with the responses recorded against the appointment.',
    },
    {
      index: '03',
      title: 'Working the recall list',
      detail: 'Sequenced continuously to a stop rule, instead of in occasional bursts.',
    },
    {
      index: '04',
      title: 'Offering released slots',
      detail: 'Matched and offered in a defined order while the gap is still fillable.',
    },
    {
      index: '05',
      title: 'Assembling the report',
      detail: 'Produced from the source events, not rebuilt in a spreadsheet each month.',
    },
  ],
} as const;

export const EVIDENCE = {
  aside: 'Evidence',
  title: 'Every figure opens into',
  titleEmphasis: 'the event that produced it.',
  lead: 'A recovery number you cannot take apart is a number you cannot defend in a board meeting. Each of these is a property of the record, not a report you request.',
  items: [
    {
      index: '01',
      title: 'Source-event traceability',
      detail:
        'Every opportunity links to the specific call, enquiry or record that created it, with its timestamp.',
    },
    {
      index: '02',
      title: 'Attribution status',
      detail:
        'Attributed, assisted, disputed or excluded. You can change it, and the change is recorded.',
    },
    {
      index: '03',
      title: 'Data confidence',
      detail:
        'Each stage carries the basis for its figure: modelled, system record, or ledger. They are never averaged together.',
    },
    {
      index: '04',
      title: 'Duplicate prevention',
      detail:
        'The same person contacting twice on two channels is one opportunity. The rules that decide this are written down.',
    },
    {
      index: '05',
      title: 'Corrections',
      detail:
        'Restated figures are shown as restatements, with the previous value and the reason retained.',
    },
  ],
} as const;

export const SECTORS = {
  aside: 'Two operating pictures',
  title: 'Veterinary and dental lose money',
  titleEmphasis: 'in different places.',
  lead: 'The recovery system is the same. The workflows, the intervals and the language are not, so the two sectors are treated as two products rather than one page with the noun swapped.',
} as const;

export const CLOSING = {
  title: 'Start with an assessment,',
  titleEmphasis: 'not a contract.',
  body: [
    'A revenue-recovery assessment reads a defined window of your own operational data and returns a written view of where demand is being lost, what it is worth at estimated value, and which modules would address it.',
    'You keep the analysis whether or not you go further. Nothing is installed and nothing is changed in your systems to produce it.',
  ],
  points: [
    'A scoping call to agree the window and the data in scope.',
    'A written assessment, with figures separated by value stage.',
    'A clear statement of what the data cannot tell us.',
  ],
} as const;
