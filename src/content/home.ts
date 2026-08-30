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
};

export const LEAKS: Leak[] = [
  {
    index: '01',
    title: 'Unanswered calls',
    detail: 'Rung out, abandoned in the queue, or arriving outside opening hours.',
    module: 'Answer',
  },
  {
    index: '02',
    title: 'Slow first response',
    detail: 'Enquiries and callback requests answered after the window in which people still book.',
    module: 'Respond',
  },
  {
    index: '03',
    title: 'Dormant records',
    detail: 'Clients and patients past their expected return interval, never contacted again.',
    module: 'Reactivate',
  },
  {
    index: '04',
    title: 'Late cancellations',
    detail: 'Slots released too close to the day to be refilled by hand.',
    module: 'Retain',
  },
  {
    index: '05',
    title: 'Non-attendance',
    detail: 'Booked appointments that were never confirmed and never arrived.',
    module: 'Retain',
  },
  {
    index: '06',
    title: 'Unused capacity',
    detail: 'Rooms, chairs and clinician hours running below the schedule they were staffed for.',
    module: 'Retain / Reactivate',
  },
];

export const DETECTION = {
  num: '§ 02 / 08',
  aside: 'Detection',
  title: 'Detection is the entire job.',
  titleEmphasis: 'Everything after it is follow-through.',
  body: [
    'Grow Label connects to the systems a practice already runs — the phone system, the enquiry channels, the practice management system — and reads the events they emit. A call that lasted eight seconds. A form submitted at 21:40. A recall due in March that is still open in September.',
    'Each of those becomes a tracked opportunity with an owner, a due time and a value estimate taken from your own fee schedule. Until an event is turned into a record with a deadline attached, nobody can be held to it and nothing can be measured.',
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
    'Grow Label does not need clinical records to do any of this. It needs event data: when contact happened, on which channel, against which record, and what happened next.',
} as const;

export const TIME_RETURNED = {
  num: '§ 06 / 08',
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
  num: '§ 07 / 08',
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
  num: '§ 08 / 08',
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
