/**
 * The four modules. Each entry carries every part the module page template
 * requires, so no page can ship with a missing section.
 *
 * Nothing here describes an outcome, a client or a benchmark. Every statement
 * is a description of designed behaviour, not evidence of results.
 */

export type ModuleSlug = 'answer' | 'respond' | 'retain' | 'reactivate';

export type ModuleDefinition = {
  slug: ModuleSlug;
  /** Display name, always upper case in the interface. */
  name: string;
  index: number;
  /** One line, used in navigation and on the homepage. */
  summary: string;
  /** Standfirst on the module page. */
  lead: string;
  /** Where this module sits in the recovery system. */
  position: string;
  problem: {
    title: string;
    body: string[];
  };
  monitors: { key: string; detail: string }[];
  actions: { key: string; detail: string }[];
  /** Decisions that never leave the practice. */
  clientControls: string[];
  escalation: { trigger: string; handover: string }[];
  /** Which of the four value stages this module can influence vs only observe. */
  stages: { stage: string; role: 'Influences' | 'Observes'; note: string }[];
  dataRequired: { key: string; detail: string }[];
  dataNotRequired: string[];
  evidence: { key: string; detail: string }[];
  outcome: string[];
  cta: { label: string; href: string };
};

export const MODULES: ModuleDefinition[] = [
  {
    slug: 'answer',
    name: 'Answer',
    index: 1,
    summary: 'Coverage for the calls that would otherwise go unanswered.',
    position: 'First contact — before an opportunity has a record anywhere.',
    lead: 'Coverage for the calls that would otherwise go unanswered: the ones in the queue, the ones after hours, and the ones during the twenty minutes when everybody is in surgery.',
    problem: {
      title: 'A call that rings out leaves no trace in any system you report on.',
      body: [
        'Front-desk teams are interrupt-driven. A phone that rings while three people are at the desk and a clinician is asking for a room does not get answered, and the practice management system records nothing at all — no enquiry, no lead, no lost opportunity. The only evidence is a line in the telephony log that nobody reads.',
        'The pattern is predictable rather than random. Call volume peaks against the same shift boundaries every week, and the calls that go unanswered cluster there. Because the loss is invisible in the systems that generate the management report, it is usually described as a staffing problem rather than a revenue one.',
      ],
    },
    monitors: [
      {
        key: 'Inbound call events',
        detail:
          'Time, duration, direction and outcome for every inbound call on the practice line.',
      },
      {
        key: 'Queue abandonment',
        detail: 'Calls that entered a queue or hold state and ended before being connected.',
      },
      {
        key: 'Out-of-hours volume',
        detail: 'Contacts arriving outside published opening hours, by day and by hour.',
      },
      {
        key: 'Repeat attempts',
        detail:
          'The same number calling more than once inside a short window, which is treated as one opportunity rather than several.',
      },
    ],
    actions: [
      {
        key: 'Answer or return the contact',
        detail:
          'The contact is answered live where coverage is configured for it, or returned within the response window agreed for that practice.',
      },
      {
        key: 'Capture the reason',
        detail:
          'A structured reason for contact is recorded against the caller, using categories your team defines during setup.',
      },
      {
        key: 'Book or route',
        detail:
          'Where the reason maps to an appointment type the practice has approved for direct booking, an appointment is created. Everything else is routed to a named person with the context attached.',
      },
      {
        key: 'Close the loop',
        detail:
          'Contacts that could not be reached after the agreed number of attempts are closed with a reason and remain visible in the record.',
      },
    ],
    clientControls: [
      'Which appointment types may ever be booked without a person, and which may not.',
      'Clinical triage in all forms. No clinical assessment or advice is given.',
      'Pricing, quotes and any discussion of fees beyond the published schedule.',
      'Opening hours, response windows and the number of contact attempts.',
      'The script, tone and the practice’s name as it is used on a call.',
    ],
    escalation: [
      {
        trigger: 'Any mention of an urgent or emergency situation.',
        handover:
          'Immediate transfer to the practice’s stated emergency route. No triage is given.',
      },
      {
        trigger: 'A complaint, or a caller who asks to speak to a manager.',
        handover: 'Handed to the named practice contact with a written summary the same day.',
      },
      {
        trigger: 'A reason for contact that is not on the approved list.',
        handover: 'Logged with the caller’s own words and routed to the front desk queue.',
      },
      {
        trigger: 'A caller who asks not to be contacted.',
        handover: 'Suppression applied immediately and recorded against the contact.',
      },
    ],
    stages: [
      {
        stage: 'Estimated',
        role: 'Influences',
        note: 'Detects the opportunity and prices it from your fee schedule.',
      },
      {
        stage: 'Booked',
        role: 'Influences',
        note: 'Creates the appointment record where approved.',
      },
      {
        stage: 'Attended',
        role: 'Observes',
        note: 'Reads attendance from the practice management system.',
      },
      { stage: 'Collected', role: 'Observes', note: 'Reads payment from the practice ledger.' },
    ],
    dataRequired: [
      {
        key: 'Telephony event feed',
        detail: 'Call detail records or an equivalent event stream from your phone system.',
      },
      {
        key: 'Appointment availability',
        detail: 'Read access to the diary for the appointment types approved for booking.',
      },
      {
        key: 'Fee schedule',
        detail: 'Your own published prices, used only to estimate the value of an opportunity.',
      },
    ],
    dataNotRequired: [
      'Clinical notes or treatment history.',
      'Any record not connected to scheduling or contact.',
    ],
    evidence: [
      {
        key: 'The call record',
        detail:
          'Every detected opportunity links back to the specific call event that produced it, with its timestamp.',
      },
      {
        key: 'The action log',
        detail: 'What was attempted, when, how many times, and how it ended.',
      },
      {
        key: 'The booking link',
        detail:
          'Where an appointment was created, the appointment identifier in your own system is stored against the opportunity.',
      },
    ],
    outcome: [
      'Calls that previously produced no record produce a tracked opportunity with an owner and a due time.',
      'The front desk stops absorbing the overflow, and the pattern of when calls are missed becomes a schedulable fact rather than an impression.',
    ],
    cta: { label: 'Request an assessment', href: '/contact' },
  },
  {
    slug: 'respond',
    name: 'Respond',
    index: 2,
    summary: 'First response on every enquiry, inside the window that still converts.',
    position: 'First response — after contact, before the opportunity goes cold.',
    lead: 'A first response on every written enquiry, inside the window in which people are still deciding — including the enquiries that arrive at nine in the evening and on a Sunday.',
    problem: {
      title: 'An enquiry answered on Tuesday was decided on Sunday.',
      body: [
        'Written enquiries — web forms, messages, callback requests — arrive whenever the person happens to be thinking about it, which is rarely during a shift. They then sit in a shared inbox until somebody has a quiet ten minutes, and the person who sent them has usually contacted somebody else in the meantime.',
        'The failure is not that nobody replies. It is that the reply arrives after the decision. Response latency is measurable, it varies enormously between sites in the same group, and almost nobody reports on it, because the inbox is not part of the practice management system.',
      ],
    },
    monitors: [
      {
        key: 'Enquiry intake',
        detail: 'Web forms, contact messages and callback requests across the channels you use.',
      },
      {
        key: 'Response latency',
        detail:
          'Time from arrival to first substantive reply, measured per channel, per site and per hour of the day.',
      },
      {
        key: 'Thread state',
        detail: 'Whether a conversation is awaiting the practice or awaiting the enquirer.',
      },
      {
        key: 'Ageing',
        detail: 'Enquiries that pass the response window agreed for their channel.',
      },
    ],
    actions: [
      {
        key: 'Acknowledge and qualify',
        detail:
          'A first reply goes out inside the agreed window, confirming receipt and asking the qualifying questions your team defined.',
      },
      {
        key: 'Book where approved',
        detail:
          'Where the enquiry maps to an approved appointment type and a slot is available, the appointment is offered and created.',
      },
      {
        key: 'Escalate with context',
        detail:
          'Anything outside the approved set is handed to a named person, with the enquirer’s own words and a suggested next step.',
      },
      {
        key: 'Chase to a stop rule',
        detail:
          'Unanswered threads are followed up to a defined limit, then closed with a reason. There is no indefinite pursuit.',
      },
    ],
    clientControls: [
      'The response window for each channel, and what counts as a substantive reply.',
      'Which enquiry types may be booked directly and which must reach a person.',
      'All clinical content. No clinical question is answered.',
      'Quotes, fee discussions and anything that commits the practice commercially.',
      'The follow-up limit and the wording of every message sent in your name.',
    ],
    escalation: [
      {
        trigger: 'A clinical question, or a description of symptoms.',
        handover: 'Passed to the practice immediately with no clinical response given.',
      },
      {
        trigger: 'A request for a price outside the published schedule.',
        handover: 'Routed to the named commercial contact at that site.',
      },
      {
        trigger: 'A dissatisfied enquirer, or any reference to a previous complaint.',
        handover: 'Handed to the practice manager the same working day.',
      },
      {
        trigger: 'Two failed attempts to clarify what the enquirer needs.',
        handover: 'Handed to the front desk rather than chased further.',
      },
    ],
    stages: [
      {
        stage: 'Estimated',
        role: 'Influences',
        note: 'Prices the enquiry from your fee schedule.',
      },
      { stage: 'Booked', role: 'Influences', note: 'Creates the appointment where approved.' },
      { stage: 'Attended', role: 'Observes', note: 'Reads attendance from your system.' },
      { stage: 'Collected', role: 'Observes', note: 'Reads payment from your ledger.' },
    ],
    dataRequired: [
      {
        key: 'Enquiry channels',
        detail: 'Access to the form, inbox or message queue you receive.',
      },
      { key: 'Appointment availability', detail: 'Read access to the diary for approved types.' },
      { key: 'Response policy', detail: 'Your target windows and your approved reply templates.' },
    ],
    dataNotRequired: [
      'Clinical records of any kind.',
      'Historic correspondence unrelated to the enquiry being handled.',
    ],
    evidence: [
      {
        key: 'The thread',
        detail: 'The full exchange, retained against the opportunity, in the order it happened.',
      },
      {
        key: 'Latency measurement',
        detail:
          'Arrival time and first-reply time for every enquiry, reportable by site, channel and hour.',
      },
      {
        key: 'Stop-rule record',
        detail: 'Why a thread was closed, and at which attempt.',
      },
    ],
    outcome: [
      'Enquiries receive a first response inside a window you set, including outside working hours.',
      'Response latency becomes a managed number with an owner, rather than a property of how busy the desk was that morning.',
    ],
    cta: { label: 'Request an assessment', href: '/contact' },
  },
  {
    slug: 'retain',
    name: 'Retain',
    index: 3,
    summary: 'Protecting the schedule you have already filled.',
    position: 'Between booking and attendance — where filled capacity quietly empties.',
    lead: 'Protecting appointments that are already booked: confirming them, recovering the ones that cancel, and refilling the gaps that open inside the working horizon.',
    problem: {
      title: 'A booked appointment is not a kept appointment.',
      body: [
        'Between booking and attendance, a schedule loses volume in three ways: appointments that are cancelled with too little notice to refill by hand, appointments where nobody arrives, and slots released by clinical changes on the day. Each one is a room, a chair and a clinician already paid for.',
        'Refilling a short-notice gap is a manual job that competes with everything else happening at the desk at the same time. It usually loses, and the gap stays open. The cost is real, it recurs daily, and it does not appear anywhere as a line item.',
      ],
    },
    monitors: [
      {
        key: 'Confirmation state',
        detail: 'Which upcoming appointments have been confirmed and which have not.',
      },
      {
        key: 'Cancellations',
        detail: 'Cancellations by notice period, appointment type, site and clinician.',
      },
      {
        key: 'Non-attendance',
        detail: 'Appointments marked as not attended, and the patterns that precede them.',
      },
      {
        key: 'Emerging gaps',
        detail:
          'Openings appearing inside the horizon you can still act on, ranked by the value of the slot.',
      },
      {
        key: 'Waiting demand',
        detail:
          'Contacts who asked for an earlier date, or who are waiting for an appointment type that has just become available.',
      },
    ],
    actions: [
      {
        key: 'Confirm ahead',
        detail:
          'Appointments are confirmed on the schedule and through the channels you have approved, at the intervals you set.',
      },
      {
        key: 'Recover a cancellation',
        detail:
          'When someone cancels, a replacement date is offered in the same conversation before the slot is released.',
      },
      {
        key: 'Offer the released slot',
        detail:
          'Released capacity is offered to a matched list of waiting contacts, in an order the practice defines.',
      },
      {
        key: 'Record the outcome',
        detail:
          'Whether a gap was refilled, by whom, and how long it stayed open — held against the original slot.',
      },
    ],
    clientControls: [
      'Which appointment types can be offered to which contacts. Clinical appropriateness is always a practice decision.',
      'The matching rules for a waiting list, and the order in which contacts are offered a slot.',
      'How far ahead confirmations go out, and through which channels.',
      'Any policy on deposits, charges or repeated non-attendance.',
      'Whether a specific person should be contacted at all.',
    ],
    escalation: [
      {
        trigger: 'A cancellation with a clinical reason attached.',
        handover: 'Routed to the practice rather than rebooked automatically.',
      },
      {
        trigger: 'A slot released for a clinical or safeguarding reason.',
        handover: 'Left closed and flagged to the practice for a decision.',
      },
      {
        trigger: 'Repeated non-attendance by the same contact.',
        handover: 'Reported to the practice manager, with no policy action taken independently.',
      },
      {
        trigger: 'A contact who disputes a charge or a policy.',
        handover: 'Handed to a named person at that site the same working day.',
      },
    ],
    stages: [
      {
        stage: 'Estimated',
        role: 'Influences',
        note: 'Values a released slot from your fee schedule.',
      },
      { stage: 'Booked', role: 'Influences', note: 'Refills the slot and links the new booking.' },
      {
        stage: 'Attended',
        role: 'Influences',
        note: 'Confirmation activity sits directly against attendance.',
      },
      { stage: 'Collected', role: 'Observes', note: 'Reads payment from your ledger.' },
    ],
    dataRequired: [
      {
        key: 'Appointment book',
        detail: 'Read access to bookings, cancellations, statuses and released slots.',
      },
      {
        key: 'Contact channels',
        detail: 'The approved channels for confirmations and offers.',
      },
      {
        key: 'Matching rules',
        detail: 'Which contacts may be offered which appointment types, defined by the practice.',
      },
    ],
    dataNotRequired: [
      'Clinical detail behind a cancellation.',
      'Any information about a condition, treatment or history.',
    ],
    evidence: [
      {
        key: 'Slot history',
        detail:
          'For every gap: when it opened, who was offered it, in what order, and when it closed.',
      },
      {
        key: 'Confirmation trail',
        detail: 'What was sent, when, on which channel, and what came back.',
      },
      {
        key: 'Attribution status',
        detail:
          'Whether a refilled slot is attributed, assisted or disputed — and who changed the status.',
      },
    ],
    outcome: [
      'Short-notice gaps are worked immediately instead of competing with the queue at the front desk.',
      'Cancellation and non-attendance rates become reportable by site, clinician and appointment type.',
    ],
    cta: { label: 'Request an assessment', href: '/contact' },
  },
  {
    slug: 'reactivate',
    name: 'Reactivate',
    index: 4,
    summary: 'Bringing dormant records back into the schedule.',
    position: 'The back book — demand that already exists in your own database.',
    lead: 'Working the records that stopped coming back: overdue recalls, lapsed plans, and treatment that was accepted and never given a date.',
    problem: {
      title: 'The largest list of prospects a practice has is the list it already owns.',
      body: [
        'Every practice carries a back book: records past their expected return interval, recalls that lapsed, plans that stopped being paid, and treatment that was discussed, agreed and never scheduled. It is the cheapest demand in the business and it is almost never worked, because working it is an unglamorous list job with no deadline attached to it.',
        'When it is worked, it is worked in bursts — a quiet January, a new hire with spare capacity — and then it stops. The result is that the same list gets partially contacted several times and never systematically.',
      ],
    },
    monitors: [
      {
        key: 'Overdue recalls',
        detail: 'Records past the interval the practice defines for their type.',
      },
      {
        key: 'Lapsed plans',
        detail: 'Plans or memberships that stopped without a recorded reason.',
      },
      {
        key: 'Accepted, unscheduled treatment',
        detail: 'Agreed plans with no appointment attached to them.',
      },
      {
        key: 'Dormancy',
        detail:
          'Records with no activity for a period the practice sets, excluding anyone suppressed.',
      },
    ],
    actions: [
      {
        key: 'Sequence the list',
        detail:
          'Contacts are worked in a defined order — by overdue interval, by value, or by a rule you set — not by whoever is at the top of a spreadsheet.',
      },
      {
        key: 'Contact to a stop rule',
        detail:
          'Each record is contacted a fixed number of times across the channels you approve, then closed. No indefinite campaigns.',
      },
      {
        key: 'Book or close',
        detail:
          'Where the contact wants an appointment and the type is approved, it is created. Where they do not, the record is closed with the reason they gave.',
      },
      {
        key: 'Honour suppression immediately',
        detail:
          'Any request not to be contacted is applied at once, across every module, and recorded.',
      },
    ],
    clientControls: [
      'Who is on the list at all. Suppression rules are set by the practice and are absolute.',
      'The recall intervals and what counts as dormant for each record type.',
      'The number of attempts, the channels used and the gap between them.',
      'Every word of every message sent in the practice’s name.',
      'Whether a lapsed plan may be discussed commercially, and on what terms.',
    ],
    escalation: [
      {
        trigger: 'A contact who says a record is wrong or out of date.',
        handover: 'Passed to the practice for correction. The record is held, not re-contacted.',
      },
      {
        trigger: 'Any indication that a patient has died, or a client has been bereaved.',
        handover:
          'Contact stops immediately, suppression is applied, and the practice is notified privately.',
      },
      {
        trigger: 'A clinical question about why a recall is due.',
        handover: 'Routed to the practice. No clinical explanation is offered.',
      },
      {
        trigger: 'A complaint about being contacted.',
        handover: 'Suppression applied, and the practice manager informed the same day.',
      },
    ],
    stages: [
      {
        stage: 'Estimated',
        role: 'Influences',
        note: 'Values the overdue item from your fee schedule.',
      },
      { stage: 'Booked', role: 'Influences', note: 'Creates the appointment where approved.' },
      { stage: 'Attended', role: 'Observes', note: 'Reads attendance from your system.' },
      { stage: 'Collected', role: 'Observes', note: 'Reads payment from your ledger.' },
    ],
    dataRequired: [
      {
        key: 'Recall and interval data',
        detail: 'Due dates and record types, with the intervals your practice uses.',
      },
      {
        key: 'Contact permissions',
        detail: 'Consent state and suppression flags for every record on the list.',
      },
      {
        key: 'Treatment plan status',
        detail: 'Whether an agreed plan has an appointment attached — status only, not content.',
      },
    ],
    dataNotRequired: [
      'The clinical content of a treatment plan.',
      'Notes, images, results or any other clinical record.',
    ],
    evidence: [
      {
        key: 'List provenance',
        detail: 'Why each record was selected, against which rule, and on which date.',
      },
      {
        key: 'Contact history',
        detail: 'Every attempt, channel, response and stop reason.',
      },
      {
        key: 'Suppression record',
        detail: 'When suppression was applied, by whom, and on what basis.',
      },
    ],
    outcome: [
      'The back book is worked continuously and in a defined order, instead of in occasional bursts.',
      'Every contact is bounded by a stop rule, so the list is worked without being over-worked.',
    ],
    cta: { label: 'Request an assessment', href: '/contact' },
  },
];

export const MODULE_SLUGS: ModuleSlug[] = MODULES.map((m) => m.slug);

export function getModule(slug: string): ModuleDefinition | undefined {
  return MODULES.find((m) => m.slug === slug);
}
