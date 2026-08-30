/**
 * Copy for the platform, about and insights routes, plus the contact journey.
 */

import { AUDIT_QUESTIONS } from '@/content/methodology';

export const PLATFORM = {
  label: 'Platform',
  title: 'One system,',
  emphasis: 'four points of contact with the schedule.',
  lead: 'Grow Label reads the events your systems already produce, turns the ones that represent lost demand into tracked opportunities, works them under rules you set, and reports the result at four separate stages.',
  strip: [
    { key: 'Reads', detail: 'Telephony, enquiry channels, appointment book, interval data' },
    { key: 'Produces', detail: 'Tracked opportunities with an owner, a due time and a value' },
    { key: 'Acts through', detail: 'Four modules, each with a defined ceiling' },
    { key: 'Reports at', detail: 'Estimated · Booked · Attended · Collected' },
  ],
  architecture: {
    aside: 'Architecture',
    title: 'Event, opportunity, action,',
    emphasis: 'record.',
    lead: 'Four layers, in one direction. Nothing skips a layer, which is why every figure can be opened back into the event that caused it.',
    layers: [
      {
        index: '01',
        title: 'Event layer',
        detail:
          'Reads what your systems already emit: call detail records, enquiry submissions, appointment changes, recall due dates. Read-only, and scoped to scheduling and contact.',
        artefact: 'A timestamped event with a channel and a subject.',
      },
      {
        index: '02',
        title: 'Opportunity layer',
        detail:
          'Turns qualifying events into tracked opportunities. Applies duplicate rules, attaches an estimated value from your fee schedule, and assigns a due time.',
        artefact: 'An opportunity with an owner, a deadline and a stage.',
      },
      {
        index: '03',
        title: 'Action layer',
        detail:
          'The four modules. Each one acts inside a ceiling you define — which appointment types, which channels, how many attempts, and which triggers hand the contact to a person.',
        artefact: 'An action log, including every escalation and stop.',
      },
      {
        index: '04',
        title: 'Record layer',
        detail:
          'Promotes value between stages only on a system record, holds attribution status, and retains restatements with their previous values.',
        artefact: 'A figure you can open, question and dispute.',
      },
    ],
  },
  controls: {
    aside: 'Controls',
    title: 'The ceiling is set by you,',
    emphasis: 'not discovered by us.',
    lead: 'Every module operates inside limits agreed during setup and changeable at any time. There is no mode in which the system decides for itself what it is allowed to do.',
    items: [
      {
        index: '01',
        title: 'Booking scope',
        detail: 'The exact appointment types that may ever be created without a person involved.',
      },
      {
        index: '02',
        title: 'Contact policy',
        detail: 'Channels, hours, attempt limits and the interval between attempts.',
      },
      {
        index: '03',
        title: 'Suppression',
        detail:
          'Absolute, immediate and applied across every module. Set by the practice, never overridden.',
      },
      {
        index: '04',
        title: 'Escalation triggers',
        detail:
          'The named conditions that hand a contact to a person, with a response expectation.',
      },
      {
        index: '05',
        title: 'Language',
        detail: 'Every message sent in your name is approved by you before it is used.',
      },
      {
        index: '06',
        title: 'Data scope',
        detail: 'What is read, what is explicitly excluded, and where clinical data begins.',
      },
    ],
  },
  data: {
    aside: 'Data',
    title: 'Scheduling and contact data.',
    emphasis: 'Not clinical records.',
    lead: 'The boundary is drawn deliberately narrow. Grow Label needs to know that contact happened and what the schedule looks like. It does not need to know why somebody is coming in.',
    required: [
      { key: 'Contact events', detail: 'Time, channel, direction and outcome.' },
      { key: 'Appointment book', detail: 'Bookings, cancellations, statuses, released capacity.' },
      { key: 'Interval data', detail: 'Recall due dates and plan status — status only.' },
      { key: 'Fee schedule', detail: 'Your own published prices, used to estimate value.' },
      { key: 'Consent state', detail: 'Contact permissions and suppression flags.' },
    ],
    excluded: [
      'Clinical notes, histories, images and results.',
      'The content of a treatment plan, as opposed to whether it has an appointment attached.',
      'Any record with no bearing on scheduling or contact.',
    ],
  },
};

export const ABOUT = {
  label: 'About',
  title: 'A revenue operation,',
  emphasis: 'not a marketing channel.',
  lead: 'Grow Label works on demand a practice has already generated and already paid for. That single decision determines everything else: what we measure, what we refuse to claim, and why the reporting is built to be argued with.',
  position: {
    aside: 'Position',
    title: 'The cheapest demand in the business',
    emphasis: 'is the demand you already have.',
    body: [
      'Acquisition is competitive, expensive and slow to prove. Meanwhile every practice carries a back book of records past their interval, a list of accepted treatment with no date attached, and a telephony log full of calls that produced nothing. That demand is already qualified and already paid for.',
      'Working it is unglamorous. It is list work, follow-up work and schedule work — exactly the jobs that lose to whatever is urgent at the front desk. It gets done in bursts and then stops, which is why the same opportunities are recovered twice and missed three times.',
      'Grow Label exists to make that work continuous, bounded and measurable, and to report what it produced in terms a finance director will accept.',
    ],
  },
  principles: {
    aside: 'Operating principles',
    title: 'Five commitments',
    emphasis: 'that constrain what we build.',
    items: [
      {
        index: '01',
        title: 'Four numbers, never one',
        detail:
          'Estimated, booked, attended and collected are reported separately, always. A single blended figure is the most common way this category misleads its buyers.',
      },
      {
        index: '02',
        title: 'Every figure is traceable',
        detail:
          'If a number cannot be opened into the event that produced it, it is not reported. Untraceable value is not value.',
      },
      {
        index: '03',
        title: 'The ceiling belongs to the client',
        detail:
          'What may be booked, who may be contacted, how often, and in what words are decisions that stay with the practice.',
      },
      {
        index: '04',
        title: 'Clinical judgement is not ours',
        detail:
          'No triage, no advice, no assessment, no recommendation. Clinical questions route to the practice immediately and unanswered.',
      },
      {
        index: '05',
        title: 'Disputes stay in the record',
        detail:
          'When a client disagrees with an attribution, the item remains visible with the dispute attached. Nothing quietly disappears from a total.',
      },
    ],
  },
  who: {
    aside: 'Who this is for',
    title: 'Groups where a lost hour',
    emphasis: 'has a price on it.',
    lead: 'The platform is built for organisations that already measure capacity and already argue about how it is filled.',
    audiences: [
      {
        key: 'Owners and founders',
        detail: 'Want the recovered figure and want to know which part of it is real.',
      },
      {
        key: 'Operations directors',
        detail: 'Want the manual list work off the same four people, permanently.',
      },
      {
        key: 'Practice managers',
        detail: 'Want the escalations to arrive with context and a suggested next step.',
      },
      {
        key: 'Finance and commercial leads',
        detail: 'Want a number that survives a board meeting, with the method attached.',
      },
    ],
  },
};

export type Insight = {
  slug: string;
  title: string;
  kicker: string;
  date: string;
  readingTime: string;
  summary: string;
  body: { heading: string; paragraphs: string[]; list?: string[] }[];
};

export const INSIGHTS: Insight[] = [
  {
    slug: 'why-one-revenue-number-is-not-enough',
    title: 'Why a single recovered-revenue number tells you almost nothing',
    kicker: 'Measurement',
    date: '2026-06-18',
    readingTime: '6 min',
    summary:
      'The most common figure in this category answers four different questions at once, which is why it survives so little scrutiny.',
    body: [
      {
        heading: 'The problem with one number',
        paragraphs: [
          'A recovery figure quoted as a single amount is answering four questions simultaneously: how much was identified, how much got booked, how much actually happened, and how much was paid. Those have four different answers and four different levels of certainty, and averaging them produces a number that is defensible in a sales meeting and indefensible in a board meeting.',
          'The failure is usually not dishonest. It is that the reporting was built from whichever data source was easiest to reach, and then described in the language of revenue because that is what buyers ask for.',
        ],
      },
      {
        heading: 'What separating the stages changes',
        paragraphs: [
          'Once the four stages are reported separately, the interesting information is in the gaps rather than the totals. A large distance between estimated and booked is a conversion problem in the contact workflow. A large distance between booked and attended is a confirmation problem. A large distance between attended and collected is a billing problem, and it is not a recovery problem at all.',
          'Each gap has a different owner and a different fix. Collapsing them into one figure hides exactly the information an operator needs.',
        ],
      },
      {
        heading: 'Questions worth asking any provider',
        paragraphs: [],
        list: [...AUDIT_QUESTIONS],
      },
    ],
  },
  {
    slug: 'the-cost-of-a-short-notice-gap',
    title: 'The short-notice gap is a scheduling problem, not a marketing one',
    kicker: 'Operations',
    date: '2026-05-02',
    readingTime: '5 min',
    summary:
      'A slot released inside twenty-four hours competes for attention with everything else happening at the desk, and it usually loses.',
    body: [
      {
        heading: 'Why the gap stays open',
        paragraphs: [
          'Refilling a short-notice cancellation is a specific job with a short window: identify who could take it, decide whether they clinically should, contact them in a channel they will actually read, and confirm before the time passes. Every step is small. Together they take longer than the quiet moment available to do them in.',
          'So the work gets deferred until the gap is no longer fillable, and the loss is recorded as a cancellation rather than as unused capacity. Those are different problems with different fixes.',
        ],
      },
      {
        heading: 'The horizon that matters',
        paragraphs: [
          'The useful measurement is not the cancellation rate. It is how long a released slot stays open, measured against the horizon in which it could still realistically be filled. That horizon differs by appointment type: a routine review can be filled the same morning, a longer procedure usually cannot.',
          'Once the horizon is written down per appointment type, refilling becomes a queue with a deadline rather than a favour somebody does when the desk goes quiet.',
        ],
      },
    ],
  },
  {
    slug: 'the-back-book-nobody-works',
    title: 'The back book is the largest list most practices never work',
    kicker: 'Revenue operations',
    date: '2026-03-11',
    readingTime: '5 min',
    summary:
      'Records past their interval, lapsed plans and accepted treatment with no date attached: qualified demand, already paid for, and worked in bursts at best.',
    body: [
      {
        heading: 'Three lists in one',
        paragraphs: [
          'The back book is not a single list. It is at least three: records past their expected return interval, plans that stopped without a recorded reason, and treatment that was agreed and never scheduled. They have different intent levels and they deserve different sequences, but they are usually merged into one spreadsheet and worked from the top.',
          'Working from the top means the same records are contacted repeatedly and the bottom of the list is never reached. It also means nobody can say how far the list was worked in a given month, because there is no record of where it stopped.',
        ],
      },
      {
        heading: 'Bounded contact, not campaigns',
        paragraphs: [
          'A list worked without a stop rule turns into a campaign, and campaigns are how practices annoy the people they most want back. The alternative is a fixed number of attempts across approved channels, followed by a close with a recorded reason — so a record is either brought back or set down deliberately.',
          'The measurable outcome is not just bookings. It is that suppression is honoured, contact volume per record is capped, and the list has a defensible position at the end of every month.',
        ],
      },
    ],
  },
];

export function getInsight(slug: string): Insight | undefined {
  return INSIGHTS.find((i) => i.slug === slug);
}

export const CONTACT = {
  label: 'Contact',
  title: 'Request a revenue-recovery',
  emphasis: 'assessment.',
  lead: 'Tell us about the group and what you think is being lost. If it is a fit, we agree a window of your own operational data to read and return a written assessment.',
  steps: [
    {
      index: '01',
      title: 'You send the outline',
      detail: 'The group, how many sites, the systems you run, and what you believe is leaking.',
    },
    {
      index: '02',
      title: 'Scoping call',
      detail:
        'Around thirty minutes to agree the period we would look at and exactly which data is in scope.',
    },
    {
      index: '03',
      title: 'The assessment',
      detail:
        'A written view of where demand is being lost, valued at estimated value, with the modules that would address it.',
    },
    {
      index: '04',
      title: 'Your decision',
      detail: 'You keep the analysis either way. No obligation attaches to it.',
    },
  ],
  dataNotice:
    'This form is for commercial enquiries only. Do not include client, patient, clinical or otherwise sensitive information in any field.',
};

/**
 * The modules index.
 *
 * The four modules are not four products. They are four points on the life of
 * one opportunity, and the page is built to say that before it says anything
 * else — hence the timeline, which is the organising device.
 */
export const MODULES_PAGE = {
  label: 'Modules',
  title: 'Four modules.',
  emphasis: 'One opportunity, followed all the way.',
  lead: 'Demand does not leak in one place. It leaks at first contact, at first response, between booking and attendance, and in the records that quietly stopped moving. Each module covers one of those, and all four report into the same four value stages.',
  strip: [
    { key: 'Answer', detail: 'Contact that is never picked up' },
    { key: 'Respond', detail: 'Enquiries answered after the window closes' },
    { key: 'Retain', detail: 'Booked capacity that empties again' },
    { key: 'Reactivate', detail: 'Records that stopped coming back' },
  ],
  /** The timeline the four modules are plotted against. */
  timeline: {
    eyebrow: 'The life of one opportunity',
    title: 'Every module covers a different',
    emphasis: 'way of losing the same patient.',
    lead: 'Demand arrives. It gets a response or it does not. It becomes an appointment or it does not. It attends, or it lapses. The four modules sit over the four places it drops.',
    stages: [
      { key: 'Contact arrives', detail: 'A call, a form, a message, an overdue recall date.' },
      { key: 'Response owed', detail: 'A window in which the person is still deciding.' },
      { key: 'Appointment held', detail: 'Committed capacity with a date against it.' },
      { key: 'Outcome recorded', detail: 'Attended and invoiced, or lapsed and forgotten.' },
    ],
    spans: [
      {
        slug: 'answer',
        name: 'Answer',
        from: 0,
        to: 26,
        caption: 'Picks up what would have rung out.',
      },
      {
        slug: 'respond',
        name: 'Respond',
        from: 18,
        to: 50,
        caption: 'Replies inside the window that still converts.',
      },
      {
        slug: 'retain',
        name: 'Retain',
        from: 46,
        to: 82,
        caption: 'Holds the appointment, refills it when it goes.',
      },
      {
        slug: 'reactivate',
        name: 'Reactivate',
        from: 62,
        to: 100,
        caption: 'Works the records that stopped moving.',
      },
    ],
  },
  boundary: {
    eyebrow: 'The ceiling',
    title: 'Every module has a limit,',
    emphasis: 'and the practice sets it.',
    lead: 'A module can only do what a practice has explicitly approved. The ceiling is written down during setup, applies to every contact, and can be lowered at any time without a conversation.',
    items: [
      {
        key: 'No clinical judgement, ever',
        detail:
          'No module triages, assesses, advises or diagnoses. Anything that sounds urgent goes straight to the practice’s own emergency route.',
      },
      {
        key: 'Booking scope is a whitelist',
        detail:
          'Only the appointment types a practice has approved may be booked without a person. Everything else is routed to a named owner with the context attached.',
      },
      {
        key: 'Contact rules are yours',
        detail:
          'Hours, response windows, attempt limits, tone and the practice’s own name in the script are all set by the practice.',
      },
      {
        key: 'A refusal is permanent',
        detail:
          'A contact who asks not to be approached is suppressed immediately, across every module, and it is recorded against the record.',
      },
    ],
  },
  close: {
    title: 'Start with what is actually leaking,',
    emphasis: 'not with the module.',
    body: 'The assessment reads your own event data and shows which of the four is losing you the most. Most groups do not begin with all four, and none should begin with the one that sounds most impressive.',
  },
} as const;
