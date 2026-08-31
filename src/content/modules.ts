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
    /**
     * The figure that makes the problem concrete. It is deliberately a number
     * the reader can produce from their own systems in an afternoon, not a
     * published benchmark: this site does not assert third-party statistics,
     * and a figure an owner can check beats one they have to take on trust.
     */
    figure?: { value: string; label: string; basis: string };
  };
  /**
   * What the module does, in the language an operations manager would use in
   * a handover. No architecture, no capability nouns.
   */
  operation?: string[];
  /** What it plugs into: the systems of record, and the channels it works. */
  connects?: {
    systems: { key: string; detail: string }[];
    channels: { key: string; detail: string }[];
    note: string;
  };
  /** What appears on the practice's dashboard because this module ran. */
  dashboard?: { key: string; detail: string }[];
  /**
   * Stated plainly, because a clear boundary builds more trust than a claim.
   * Separate from `dataNotRequired`, which is about inputs rather than
   * behaviour.
   */
  doesNot?: { key: string; detail: string }[];
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
    position: 'First contact, before an opportunity has a record anywhere.',
    lead: 'Coverage for the calls that would otherwise go unanswered: the ones in the queue, the ones after hours, and the ones during the twenty minutes when everybody is in surgery.',
    problem: {
      title: 'A call that rings out leaves no trace in any system you report on.',
      body: [
        'Front-desk teams are interrupt-driven. A phone that rings while three people are at the desk and a clinician is asking for a room does not get answered, and the practice management system records nothing at all: no enquiry, no lead, no lost opportunity. The only evidence is a line in the telephony log that nobody reads.',
        'The pattern is predictable rather than random. Call volume peaks against the same shift boundaries every week, and the calls that go unanswered cluster there. Because the loss is invisible in the systems that generate the management report, it is usually described as a staffing problem rather than a revenue one.',
        'It is worth knowing the size of it before deciding whether it matters. Your telephony provider can export last month by hour and by outcome, and the unanswered column is the one to read. Most owners have never seen that column, and it is the only part of the practice where demand arrives, finds nobody, and leaves no record that it was ever there.',
      ],
      figure: {
        value: '0',
        label: 'Records created in your practice management system by a call that rang out',
        basis:
          'True of every practice management system we have worked with. It is the reason the loss does not appear in a management report.',
      },
    },
    operation: [
      'Answer picks up the calls your desk cannot get to. When a call rings past your threshold, arrives outside opening hours, or lands while every line is already busy, it is answered rather than left to ring.',
      'The caller is asked what they need and who they are. If the request is one you have approved for booking, the appointment is made in your system while the caller is still on the line. If it is anything else, the details and the reason for the call are captured, and the contact is queued for your team with the context already attached.',
      'Every call produces a record either way. That is the operational change: the front desk stops starting each morning by guessing what it missed, and starts with a list.',
    ],
    connects: {
      systems: [
        {
          key: 'Your phone system',
          detail:
            'Call events, timings and outcomes. Answer sits behind your existing number and overflow rules; nobody is asked to change how they dial.',
        },
        {
          key: 'Your practice management system',
          detail:
            'Availability and appointment creation. Answer reads the diary to know what can be offered, and writes an appointment when one is booked.',
        },
      ],
      channels: [
        { key: 'Inbound voice', detail: 'The practice line, in queue and out of hours.' },
        { key: 'Voicemail', detail: 'Messages transcribed and raised as contacts to return.' },
        { key: 'SMS follow-up', detail: 'A confirmation or a callback offer, where you allow it.' },
      ],
      note: 'Answer works with the phone system and diary you already run. Where a system has no write access, it captures the contact and hands the booking to your team instead of holding it.',
    },
    dashboard: [
      {
        key: 'Calls answered that would have rung out',
        detail:
          'Counted against the telephony event, with the recording and transcript attached to each one.',
      },
      {
        key: 'What each caller wanted',
        detail:
          'Grouped by reason, so the pattern in your missed calls is legible rather than anecdotal.',
      },
      {
        key: 'Appointments booked from those calls',
        detail:
          'Only where an appointment exists in your practice management system. This is the Booked stage, and it moves on a record rather than on an outcome we inferred.',
      },
      {
        key: 'The hours the loss actually sits in',
        detail:
          'Your own week, by day and half hour. Usually the argument for a rota change as much as for anything else.',
      },
    ],
    doesNot: [
      {
        key: 'It does not give clinical advice',
        detail:
          'No triage, no assessment, no opinion on whether an animal or a patient should be seen. A caller describing a symptom is routed to a person, immediately.',
      },
      {
        key: 'It does not decide what it may book',
        detail:
          'Appointment types, durations and clinicians are a list you set. Anything not on that list is captured and handed over, never improvised.',
      },
      {
        key: 'It does not pretend to be a person',
        detail:
          'Callers are told what they are speaking to at the start of the call. A caller who asks for a human gets one, or a call back inside the window you set.',
      },
      {
        key: 'It does not replace your front desk',
        detail:
          'It takes the calls that were already going unanswered. Calls your team picks up are calls your team picks up.',
      },
    ],
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
    position: 'First response, after contact and before the opportunity goes cold.',
    lead: 'A first response on every written enquiry, inside the window in which people are still deciding, including the enquiries that arrive at nine in the evening and on a Sunday.',
    problem: {
      title: 'An enquiry answered on Tuesday was decided on Sunday.',
      body: [
        'Written enquiries arrive by web form, by message and by callback request, whenever the person happens to be thinking about it. That is rarely during a shift. They then sit in a shared inbox until somebody has a quiet ten minutes, and the person who sent them has usually contacted somebody else in the meantime.',
        'The failure is not that nobody replies. It is that the reply arrives after the decision. Response latency is measurable, it varies enormously between sites in the same group, and almost nobody reports on it, because the inbox is not part of the practice management system.',
      ],
      figure: {
        value: '5 min',
        label:
          'The window an enquiry is still warm in, before the person who sent it starts contacting somebody else',
        basis:
          'Take your own inbox and measure the gap between the timestamp on an enquiry and the timestamp on its first reply. Do it for a fortnight and take the median, not the average, because the average is flattered by the quick ones.',
      },
    },
    operation: [
      'Respond answers written enquiries as they arrive, at whatever hour they arrive. It acknowledges the person, answers what it has been given approved answers to, and asks the one or two questions your team would have asked anyway.',
      'Where the enquiry is for something on your approved list, it offers times and books one. Where it is not, it collects the detail and hands a complete thread to your team, so the first thing anybody reads is a conversation rather than a form.',
      'The measurable change is the gap between an enquiry arriving and a reply going out. That gap becomes a number you can see per site, per channel and per hour of the day, which is usually the first time a group can compare its practices on it.',
    ],
    connects: {
      systems: [
        {
          key: 'Your website and forms',
          detail:
            'Enquiry submissions, including the fields you already collect. No change to your form is required for Respond to read it.',
        },
        {
          key: 'Your practice management system',
          detail:
            'Availability, and appointment creation for the types you have approved. Where write access is not available, Respond proposes and your team confirms.',
        },
      ],
      channels: [
        { key: 'Web enquiry forms', detail: 'Including out of hours and at weekends.' },
        { key: 'Messages', detail: 'The messaging channels you already publish, in one thread.' },
        { key: 'Email', detail: 'Replies from your practice address, in your own wording.' },
        { key: 'SMS', detail: 'Where the enquirer gave a mobile number and consented to it.' },
      ],
      note: 'Respond replies on the channel the person used, because a web enquiry answered by telephone two days later is the failure this module exists to remove.',
    },
    dashboard: [
      {
        key: 'Time to first response',
        detail:
          'Median and spread, by channel and by hour. The single number most groups have never had for their written enquiries.',
      },
      {
        key: 'Enquiries answered inside the window',
        detail:
          'Counted against the arrival timestamp, not against when somebody opened the inbox.',
      },
      {
        key: 'Appointments booked from an enquiry',
        detail:
          'Only where the appointment exists in your practice management system. Booked is a record, never an intention.',
      },
      {
        key: 'What people are actually asking for',
        detail:
          'Enquiries grouped by request, which tends to say more about demand than any survey the practice has run.',
      },
    ],
    doesNot: [
      {
        key: 'It does not assess urgency',
        detail:
          'No triage and no clinical opinion. An enquiry that describes a symptom is escalated to a person rather than answered.',
      },
      {
        key: 'It does not quote outside your fee schedule',
        detail:
          'Prices come from the schedule you publish to it, or the question is handed over. It never estimates a cost.',
      },
      {
        key: 'It does not chase indefinitely',
        detail:
          'A fixed number of follow-ups on approved channels, then the thread is closed with a recorded reason. A list worked without a stop rule becomes a campaign.',
      },
      {
        key: 'It does not write in a voice you have not approved',
        detail:
          'Tone, wording and the answers it is allowed to give are configured with your team and are yours to change.',
      },
    ],
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
    position: 'Between booking and attendance, where filled capacity quietly empties.',
    lead: 'Protecting appointments that are already booked: confirming them, recovering the ones that cancel, and refilling the gaps that open inside the working horizon.',
    problem: {
      title: 'A booked appointment is not a kept appointment.',
      body: [
        'Between booking and attendance, a schedule loses volume in three ways: appointments that are cancelled with too little notice to refill by hand, appointments where nobody arrives, and slots released by clinical changes on the day. Each one is a room, a chair and a clinician already paid for.',
        'Refilling a short-notice gap is a manual job that competes with everything else happening at the desk at the same time. It usually loses, and the gap stays open. The cost is real, it recurs daily, and it does not appear anywhere as a line item.',
      ],
      figure: {
        value: '1 chair',
        label:
          'What an unfilled short-notice gap costs, for the length of the appointment that was in it',
        basis:
          'The room, the clinician and the nurse are all rostered and paid whether or not somebody is in the chair. Your own hourly cost of a surgery is the figure to put against it.',
      },
    },
    operation: [
      'Retain works the space between a booking and the appointment happening. It confirms ahead on the channel each person actually replies on, and it keeps asking, within the limits you set, until it gets an answer rather than assuming silence means yes.',
      'When somebody cancels or a slot is released on the day, the gap is offered straight away to the people most likely to take it: the waiting list, patients whose appointment is further out than they wanted, and records already overdue.',
      'The job it removes from the desk is the one that always loses. Refilling a Thursday afternoon gap on Thursday morning is entirely possible and almost never happens, because whoever would do it is on the phone.',
    ],
    connects: {
      systems: [
        {
          key: 'Your practice management system',
          detail:
            'The diary, appointment status and cancellations. Retain reads what is booked and writes back confirmations and refills for the types you allow.',
        },
        {
          key: 'Your waiting list',
          detail:
            'Wherever it currently lives, including a spreadsheet. A gap can only be offered to somebody the system knows is waiting.',
        },
      ],
      channels: [
        { key: 'SMS', detail: 'Confirmations and short-notice offers, where consent exists.' },
        { key: 'Email', detail: 'Longer confirmations and pre-appointment instructions.' },
        { key: 'Voice', detail: 'A call for the gaps that are worth a call, inside your hours.' },
      ],
      note: 'Retain never contacts somebody who has asked not to be contacted, and suppression lists are read before every send rather than at set-up.',
    },
    dashboard: [
      {
        key: 'Appointments confirmed ahead',
        detail: 'With the channel each confirmation came back on, and how many attempts it took.',
      },
      {
        key: 'Gaps that opened, and what happened to them',
        detail:
          'Every released slot, how long it stayed open, and whether it was refilled or ran empty. Including the ones nobody filled.',
      },
      {
        key: 'Attended, against booked',
        detail:
          'The gap between these two is the number this module is judged on, and it comes from attendance status in your system.',
      },
      {
        key: 'Where non-attendance concentrates',
        detail:
          'By appointment type, clinician and day. Usually a rota conversation rather than a patient one.',
      },
    ],
    doesNot: [
      {
        key: 'It does not overbook',
        detail:
          'A slot is offered to one person at a time. Retain will not double-book a room to protect a utilisation figure.',
      },
      {
        key: 'It does not decide who is clinically suitable',
        detail:
          'Offers go to the people your rules say are eligible for that appointment type. Clinical suitability is a judgement it never makes.',
      },
      {
        key: 'It does not charge or waive fees',
        detail:
          'Cancellation policy, deposits and any charge for non-attendance stay entirely with the practice.',
      },
      {
        key: 'It does not pester',
        detail:
          'A capped number of contacts per appointment across channels you approve, with a quiet period you set. The cap is a ceiling, not a target.',
      },
    ],
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
          'Whether a gap was refilled, by whom, and how long it stayed open, all held against the original slot.',
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
          'Whether a refilled slot is attributed, assisted or disputed, and who changed the status.',
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
    position: 'The back book: demand that already exists in your own database.',
    lead: 'Working the records that stopped coming back: overdue recalls, lapsed plans, and treatment that was accepted and never given a date.',
    problem: {
      title: 'The largest list of prospects a practice has is the list it already owns.',
      body: [
        'Every practice carries a back book: records past their expected return interval, recalls that lapsed, plans that stopped being paid, and treatment that was discussed, agreed and never scheduled. It is the cheapest demand in the business and it is almost never worked, because working it is an unglamorous list job with no deadline attached to it.',
        'When it is worked, it is worked in bursts, in a quiet January or when a new hire has spare capacity, and then it stops. The result is that the same list gets partially contacted several times and never systematically.',
      ],
      figure: {
        value: '0',
        label: 'Marketing spend needed to reach somebody who is already in your database',
        basis:
          'These records were acquired once and paid for once. Working them competes with acquiring new demand, and it is the cheaper of the two by the whole cost of acquisition.',
      },
    },
    operation: [
      'Reactivate takes the records that stopped coming back and works them in a defined order: how overdue they are, what they are worth, and any rule you set about who should be approached first.',
      'Each record gets a fixed number of attempts on channels you have approved, and then it is closed with a reason. Closed means closed. The record is not quietly returned to the top of the list three months later, which is what makes a back book feel like a campaign to the people in it.',
      'The order matters more than the effort. A record three months overdue and a record three years overdue are not the same job, and working them in the order the export happened to produce is why most back-book pushes stall.',
    ],
    connects: {
      systems: [
        {
          key: 'Your practice management system',
          detail:
            'Recall due dates, plan status and last-seen dates. Status only, never the clinical record behind it.',
        },
        {
          key: 'Your suppression and consent records',
          detail:
            'Read before every contact. A record that has opted out is never approached, regardless of how overdue it is.',
        },
      ],
      channels: [
        {
          key: 'SMS',
          detail: 'The first approach for most overdue recalls, where consent exists.',
        },
        { key: 'Email', detail: 'Longer explanations, and anything with a form or a link.' },
        { key: 'Voice', detail: 'Reserved for higher-value records, inside your hours.' },
      ],
      note: 'Reactivate works from your own database. It does not buy, rent or enrich lists, and no contact is added from outside your systems.',
    },
    dashboard: [
      {
        key: 'The back book, segmented',
        detail:
          'How many records sit at each overdue interval, which is usually the first time anybody has seen its shape.',
      },
      {
        key: 'Records worked, and how far they got',
        detail: 'Attempts made, replies received, and where each record was closed.',
      },
      {
        key: 'Returns by interval',
        detail:
          'What came back from three months against what came back from two years. The argument for working the list in order, in your own numbers.',
      },
      {
        key: 'Closed with a reason',
        detail:
          'Every record set down deliberately, with the reason recorded. A back book that has been worked properly gets smaller.',
      },
    ],
    doesNot: [
      {
        key: 'It does not buy or enrich data',
        detail:
          'Every record worked came from your own systems. No third-party list is purchased, appended or matched.',
      },
      {
        key: 'It does not recall on clinical grounds',
        detail:
          'It works intervals and statuses that already exist in your system. Deciding when somebody is due is a clinical decision your practice has already made.',
      },
      {
        key: 'It does not run without a stop rule',
        detail:
          'Attempts are capped and closures are recorded. There is no configuration in which a record is contacted indefinitely.',
      },
      {
        key: 'It does not discount to win a return',
        detail:
          'Any offer, and whether there is one at all, is set by the practice. Reactivate never invents an incentive.',
      },
    ],
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
          'Contacts are worked in a defined order you set, by overdue interval or by value, not by whoever sits at the top of a spreadsheet.',
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
        detail: 'Whether an agreed plan has an appointment attached. Status only, not content.',
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
