/**
 * Measurement methodology. This page is the commercial spine of the site: it is
 * where the four value stages are defined and where the limits of the claim are
 * stated in plain language.
 */

export const METHOD_HEAD = {
  label: 'Measurement',
  title: 'How value is measured,',
  emphasis: 'and what it does not mean.',
  lead: 'Grow Label reports recovered value at four separate stages and never collapses them into a single figure. This page defines each stage, the confidence attached to it, and the things this measurement cannot tell you.',
  strip: [
    { key: 'Stages', detail: 'Estimated · Booked · Attended · Collected' },
    { key: 'Promotion rule', detail: 'A system record, never an inference' },
    { key: 'Attribution', detail: 'Attributed · assisted · disputed · excluded' },
    { key: 'Restatements', detail: 'Shown as restatements, with the previous figure retained' },
  ],
};

export type StageDefinition = {
  index: string;
  name: string;
  confidence: string;
  promotedBy: string;
  body: string;
  caution: string;
};

export const STAGE_DEFINITIONS: StageDefinition[] = [
  {
    index: '01',
    name: 'Estimated value',
    confidence: 'Modelled',
    promotedBy: 'Detection of a source event',
    body: 'The value of an opportunity at the moment it was detected, priced from the practice’s own published fee schedule and the appointment type the contact most likely needs.',
    caution:
      'This is a forecast. It should never be described as revenue, and it should never be added to a figure from a later stage.',
  },
  {
    index: '02',
    name: 'Booked value',
    confidence: 'System record',
    promotedBy: 'An appointment record linked to the source event',
    body: 'An appointment exists in the practice management system, and its identifier is stored against the opportunity that produced it.',
    caution:
      'A booking is not attendance. Booked value moves back out of this stage if the appointment is later cancelled.',
  },
  {
    index: '03',
    name: 'Attended value',
    confidence: 'System record',
    promotedBy: 'An attendance status in the source system',
    body: 'The appointment took place and was marked as attended in your own system. Non-attendance and cancellation are reflected here rather than quietly dropped.',
    caution:
      'Attendance is not payment. Attended value includes work that has been done and not yet paid for.',
  },
  {
    index: '04',
    name: 'Collected value',
    confidence: 'Ledger',
    promotedBy: 'A payment recorded against the practice ledger',
    body: 'Payment is recorded in your ledger against the treatment that followed the opportunity. This is the only stage that should ever be described as revenue.',
    caution:
      'Collected value is gross. It is not margin, not profit, and not net of the cost of delivering the work.',
  },
];

export type Term = {
  term: string;
  meta: string;
  body: string;
};

export const TERMS: Term[] = [
  {
    term: 'Attribution status',
    meta: 'Attributed · assisted · disputed · excluded',
    body: 'Every opportunity carries a status. “Attributed” means the recovery action was the proximate cause of the booking. “Assisted” means it contributed alongside something else. “Disputed” is set by you when you disagree, and the item stays visible in the record with the dispute attached rather than disappearing from the total. “Excluded” removes it from reporting entirely, with a reason.',
  },
  {
    term: 'Data confidence',
    meta: 'Modelled · system record · ledger',
    body: 'Each figure carries the basis on which it is asserted. A modelled figure comes from a price list and an assumption. A system-record figure comes from a row in your practice management system. A ledger figure comes from a payment. These are never averaged, blended or presented as equivalent.',
  },
  {
    term: 'Source-event traceability',
    meta: 'Every figure opens into an event',
    body: 'No number appears in reporting without the event that produced it: the call, the enquiry, or the record that triggered the action, with its timestamp and channel. If an event cannot be linked, the opportunity is not counted.',
  },
  {
    term: 'Duplicate prevention',
    meta: 'Identity and interval rules',
    body: 'The same person contacting twice on two channels, or a record appearing on two lists in the same week, is one opportunity. Matching uses identity rules plus a time window, both of which are written down and available to you. Where a match is uncertain, the item is held rather than double-counted.',
  },
  {
    term: 'Corrections and restatements',
    meta: 'Prior figure retained',
    body: 'When a figure changes after it has been reported — a cancelled appointment, a refunded payment, a disputed attribution — the change is shown as a restatement. The previous value, the new value, the date and the reason are all retained. Reports are not silently rewritten.',
  },
  {
    term: 'Reporting period and cut-off',
    meta: 'Stated on every report',
    body: 'Because value moves between stages over time, a figure only means something with a period and a cut-off attached. Every report states the window it covers, the date it was produced, and how items that straddle the boundary are handled.',
  },
];

export const CANNOT_CLAIM = {
  title: 'What Grow Label',
  emphasis: 'cannot credibly claim.',
  lead: 'Stated here rather than buried, because a measurement framework that only lists its strengths is a marketing document.',
  items: [
    {
      index: '01',
      title: 'That recovered value is incremental profit',
      detail:
        'Collected value is gross and takes no account of the cost of delivering the work, the cost of the platform, or capacity that would have been filled by something else.',
    },
    {
      index: '02',
      title: 'That attribution proves causation',
      detail:
        'Attribution is a model applied to a sequence of events. Some of the people contacted would have booked anyway. That is why “assisted” exists as a status and why disputes stay in the record.',
    },
    {
      index: '03',
      title: 'That an estimate is a forecast of collection',
      detail:
        'Estimated value describes the size of an opportunity, not the likelihood of it converting. The relationship between the two is specific to a practice and is only observable after the fact.',
    },
    {
      index: '04',
      title: 'That an industry benchmark applies to you',
      detail:
        'No benchmark, average or comparison figure appears anywhere on this site. Sector-wide numbers describe a distribution, not a practice, and are frequently used to imply a promise.',
    },
    {
      index: '05',
      title: 'That a result is guaranteed',
      detail:
        'Recovery depends on demand that already exists in your data, on capacity being available to absorb it, and on your team acting on escalations. No guarantee is offered anywhere in this system.',
    },
  ],
};

/**
 * The five questions any buyer should put to a provider in this category,
 * including Grow Label. They live in the content layer because they are the
 * strongest thing on the platform page and must stay greppable.
 */
export const AUDIT_QUESTIONS: string[] = [
  'Which of the four stages does your headline figure describe?',
  'What promotes an item from one stage to the next — a record, or an inference?',
  'What happens to a figure when the appointment behind it is later cancelled?',
  'Can I open any number and see the source event that produced it?',
  'How do you decide that two contacts are the same opportunity?',
];
