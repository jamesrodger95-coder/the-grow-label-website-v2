/**
 * Veterinary, dental and med spa pages.
 *
 * These describe workflow candidates and the data each would need. They do not
 * describe delivered outcomes, and they contain no clinical claim of any kind.
 */

export type IndustrySlug = 'veterinary' | 'dental' | 'med-spa';

export type Workflow = {
  index: string;
  title: string;
  problem: string;
  reads: string;
  module: string;
};

export type IndustryDefinition = {
  slug: IndustrySlug;
  name: string;
  label: string;
  lead: string;
  /**
   * The opening block. Each sector gets its own headline, its own six signals
   * and its own visual, because the two businesses lose money in genuinely
   * different places and a shared template would flatten that.
   */
  hero: {
    titleLines: string[];
    lead: string;
    /** Five losses and the one outcome they add up to. */
    signals: { key: string; kind: 'loss' | 'recovered' }[];
    visual: 'day' | 'list';
    visualCaption: string;
  };
  /** The distinct organising idea for this sector's page. */
  thesis: {
    title: string;
    emphasis: string;
    /** The section heading above the body copy. */
    headline: string;
    body: string[];
    /** The three patterns, one sentence each. */
    patterns: string[];
  };
  strip: { key: string; detail: string }[];
  workflows: Workflow[];
  /** Sector-specific closing section. */
  feature: {
    aside: string;
    title: string;
    emphasis: string;
    lead: string;
    kind: 'sites' | 'recall';
  };
  boundaries: string[];
};

export const INDUSTRIES: IndustryDefinition[] = [
  {
    slug: 'veterinary',
    name: 'Veterinary',
    label: 'Veterinary',
    lead: 'Veterinary groups lose demand at the edges of the day and in the gap between one visit and the next one that never gets booked.',
    hero: {
      titleLines: ['The phone does not', 'keep consulting hours.'],
      lead: 'Owners ring when something changes at home: before opening, during theatre, after closing, across the weekend. Grow Label reads the calls, the enquiries and the return intervals your practice already generates, works the ones that were missed, and reports what came back at four separate stages.',
      signals: [
        { key: 'Missed calls', kind: 'loss' },
        { key: 'Overdue care', kind: 'loss' },
        { key: 'Dormant clients', kind: 'loss' },
        { key: 'Cancellations', kind: 'loss' },
        { key: 'Schedule gaps', kind: 'loss' },
        { key: 'Recovered appointments', kind: 'recovered' },
      ],
      visual: 'day',
      visualCaption:
        'Contact arriving across a working day, against the hours the desk is actually staffed for. The shape is the problem.',
    },
    thesis: {
      title: 'The veterinary problem is',
      emphasis: 'the shape of the day.',
      headline: 'Demand arrives when the desk is thinnest.',
      patterns: [
        'Contact peaks outside the hours the desk is staffed for, every week, in the same places.',
        'Return visits are discussed rather than booked, and the record ages past the point where anyone would notice.',
        'A group multiplies both, and the variation between sites is usually larger than anyone expects.',
      ],
      body: [
        'Consulting runs in blocks, surgery takes the middle of the day, and the phone does not observe either. Owners call when something changes at home, in the early morning, in the evening and across the weekend. That is precisely when the desk is thinnest or closed.',
        'The second pattern is interval-based. A client comes in once, the follow-up is discussed rather than booked, and the record quietly ages past the point where anyone would notice. Multiply that across a group and the back book becomes the largest addressable list the business owns.',
      ],
    },
    strip: [
      { key: 'Operating shape', detail: 'Consult blocks, theatre time, and out-of-hours demand' },
      { key: 'Primary loss', detail: 'After-hours contact and lapsed return intervals' },
      { key: 'Group question', detail: 'Which sites lose the same demand, and by how much' },
      { key: 'Modules in scope', detail: 'Answer · Respond · Retain · Reactivate' },
    ],
    workflows: [
      {
        index: '01',
        title: 'After-hours and overflow enquiries',
        problem:
          'Contacts arriving before opening, after closing and across the weekend, when the desk is closed or a single person is covering it.',
        reads: 'Telephony events by hour and day; enquiry arrival times by channel.',
        module: 'Answer',
      },
      {
        index: '02',
        title: 'Missed calls during theatre',
        problem:
          'A predictable mid-day window where clinical work takes the team away from the phone and calls go unanswered rather than queued.',
        reads: 'Call detail records including abandonment and repeat-attempt patterns.',
        module: 'Answer',
      },
      {
        index: '03',
        title: 'Dormant-client reactivation',
        problem:
          'Clients past their expected return interval whose record has simply stopped moving, with nobody assigned to look.',
        reads: 'Last-visit dates, expected intervals by record type, suppression flags.',
        module: 'Reactivate',
      },
      {
        index: '04',
        title: 'Wellness plan and vaccination intervals',
        problem:
          'Interval-driven appointments that lapse silently, and plans that stop being paid without a recorded reason.',
        reads: 'Plan status and due dates. Status only, never the clinical record behind it.',
        module: 'Reactivate',
      },
      {
        index: '05',
        title: 'Dental opportunities raised and not booked',
        problem:
          'Work identified during a consultation, discussed with the owner, and never given a date before they left the building.',
        reads: 'Whether an agreed plan has an appointment attached. Status, not content.',
        module: 'Retain',
      },
      {
        index: '06',
        title: 'Cancellation recovery',
        problem:
          'Cancellations taken at the desk where no replacement date is offered in the same conversation.',
        reads: 'Cancellation events with notice period, appointment type and site.',
        module: 'Retain',
      },
      {
        index: '07',
        title: 'Appointment backfill',
        problem:
          'Consult and theatre capacity released too close to the day for anyone to refill it by hand.',
        reads:
          'Released slots inside the actionable horizon, and the waiting demand that matches them.',
        module: 'Retain',
      },
    ],
    feature: {
      aside: 'Multi-location',
      title: 'The same six losses,',
      emphasis: 'measured the same way at every site.',
      lead: 'In a group, the useful question is not how much was recovered. It is which practice is losing demand the others are not, and whether that is a rota problem, a systems problem or a local one. Every site is measured on the same definitions, so the comparison means something.',
      kind: 'sites',
    },
    boundaries: [
      'No clinical claim is made anywhere in this system. Grow Label does not triage, advise or assess.',
      'Clinical urgency is routed immediately to the practice’s own emergency route.',
      'Suppression and contact permissions are set by the practice and are applied without exception.',
      'Recall intervals are the practice’s clinical decision, never a Grow Label recommendation.',
    ],
  },
  {
    slug: 'dental',
    name: 'Dental',
    label: 'Dental',
    lead: 'Dental practices lose demand between acceptance and scheduling, and in a hygiene recall list that stops being worked at the same point every month.',
    hero: {
      titleLines: ['Your best demand', 'is already in the building.'],
      lead: 'Treatment gets accepted and never given a date. The hygiene list gets worked until the day runs out. Grow Label reads the enquiries, the accepted plans and the recall intervals your practice already holds, works the ones nobody reached, and reports what came back at four separate stages.',
      signals: [
        { key: 'Missed enquiries', kind: 'loss' },
        { key: 'Overdue hygiene recall', kind: 'loss' },
        { key: 'Unscheduled treatment', kind: 'loss' },
        { key: 'Cancellations', kind: 'loss' },
        { key: 'Schedule gaps', kind: 'loss' },
        { key: 'Recovered production', kind: 'recovered' },
      ],
      visual: 'list',
      visualCaption:
        'A recall and unscheduled-treatment list, and the line where working it stopped. Everything under that line is demand the practice already owns.',
    },
    thesis: {
      title: 'The dental problem is',
      emphasis: 'the interval and the gap after yes.',
      headline: 'The highest-intent demand is already inside the practice.',
      patterns: [
        'Treatment is accepted in the chair and never given a date before the patient leaves.',
        'The hygiene recall list is worked from the top until the day runs out, and stops at a different depth every week.',
        'Chair time released on the day competes with checkout, and the gap usually wins.',
      ],
      body: [
        'Dentistry is unusual in that a large amount of demand is already qualified and already agreed. Treatment is discussed, the patient accepts, and then the appointment is not made before they leave. The plan sits in the system as an accepted, unscheduled item. It is the highest-intent demand in the practice and the least worked.',
        'The second pattern is the recall. Hygiene runs on fixed intervals, the list is generated reliably, and it is worked as far down as the day allows. Where the list stops is where the revenue stops, and that line moves depending on how busy reception was.',
      ],
    },
    strip: [
      { key: 'Operating shape', detail: 'Chair-time utilisation across providers and sites' },
      { key: 'Primary loss', detail: 'Accepted treatment never scheduled; recall adherence' },
      {
        key: 'Group question',
        detail: 'Which providers and locations convert acceptance to attendance',
      },
      { key: 'Modules in scope', detail: 'Answer · Respond · Retain · Reactivate' },
    ],
    workflows: [
      {
        index: '01',
        title: 'Missed-call recovery',
        problem:
          'New-patient calls that ring out during a handover or a busy checkout, leaving no record anywhere.',
        reads: 'Call detail records, queue abandonment, repeat attempts from the same number.',
        module: 'Answer',
      },
      {
        index: '02',
        title: 'Enquiry response time',
        problem:
          'Web and message enquiries, often for higher-value treatment, answered a day after the patient decided.',
        reads: 'Arrival and first-reply timestamps per channel, per site, per hour.',
        module: 'Respond',
      },
      {
        index: '03',
        title: 'Hygiene recall adherence',
        problem:
          'A reliable list that gets worked from the top until reception runs out of time, at a different depth every week.',
        reads: 'Due dates and intervals by record type, plus how far the list was actually worked.',
        module: 'Reactivate',
      },
      {
        index: '04',
        title: 'Unscheduled accepted treatment',
        problem:
          'Treatment agreed in the chair with no appointment attached, ageing quietly in the plan list.',
        reads: 'Whether an accepted plan has a linked appointment. Status only, never content.',
        module: 'Retain',
      },
      {
        index: '05',
        title: 'Dormant-patient reactivation',
        problem:
          'Patients with no activity for longer than their interval, who were never contacted after the second reminder.',
        reads: 'Last-activity dates, interval rules, consent and suppression state.',
        module: 'Reactivate',
      },
      {
        index: '06',
        title: 'Short-notice cancellation recovery',
        problem:
          'A cancelled chair inside twenty-four hours, where the manual refill competes with everything else at the desk.',
        reads:
          'Cancellation events with notice period, and the waiting demand that matches the slot.',
        module: 'Retain',
      },
      {
        index: '07',
        title: 'Schedule backfill',
        problem:
          'Chair time released by a change on the day, left open because nobody had the twenty minutes to fill it.',
        reads: 'Released capacity by provider and chair, ranked by the value of the slot.',
        module: 'Retain',
      },
    ],
    feature: {
      aside: 'Provider view',
      title: 'Where acceptance stops',
      emphasis: 'becoming attendance.',
      lead: 'Reporting by provider and by location is only useful if every provider is measured on the same four stages. The interesting number is not how much was accepted; it is the distance between accepted and attended, and whether that distance is the same on a Tuesday as on a Saturday.',
      kind: 'recall',
    },
    boundaries: [
      'No clinical claim is made anywhere in this system. Grow Label does not assess, diagnose or advise.',
      'Treatment content is never read, quoted or discussed. Only the scheduling status of a plan is used.',
      'Recall intervals are set by the practice as a clinical decision.',
      'Suppression and consent are applied immediately and without exception across every module.',
    ],
  },
  {
    slug: 'med-spa',
    name: 'Med spa',
    label: 'Med spa',
    lead: 'Med spas lose demand in the minutes after an enquiry arrives, in consultations that end without a date, and in repeat visits that stop being rebooked.',
    hero: {
      titleLines: ['The enquiry is warm', 'for about an hour.'],
      lead: 'Enquiries arrive from ads, social and search at all hours, and the first reply decides who gets the booking. Consultations end without a date, and regular clients drift past the point they would have rebooked. Grow Label reads the enquiries, the consultations and the visit history your business already holds, works the ones nobody reached, and reports what came back at four separate stages.',
      signals: [
        { key: 'Missed enquiries', kind: 'loss' },
        { key: 'Slow first response', kind: 'loss' },
        { key: 'Unbooked consultations', kind: 'loss' },
        { key: 'Lapsed repeat clients', kind: 'loss' },
        { key: 'No-shows and gaps', kind: 'loss' },
        { key: 'Recovered bookings', kind: 'recovered' },
      ],
      visual: 'list',
      visualCaption:
        'A rebooking and unbooked-consultation list, and the line where working it stopped. Everything under that line is demand the business already owns.',
    },
    thesis: {
      title: 'The med spa problem is',
      emphasis: 'speed to reply and the visit that never gets rebooked.',
      headline: 'Most of the demand is paid for, and the first reply decides it.',
      patterns: [
        'An enquiry from an ad or a social message is answered after the person has already booked somewhere else.',
        'A consultation ends with interest and no date, and nobody is assigned to follow it up.',
        'Repeat clients stop rebooking quietly, and the list of who has gone quiet is never worked in one go.',
      ],
      body: [
        'A med spa buys a large share of its demand. Enquiries arrive from ads, social messages, web forms and search, often in the evening and at weekends, and the person enquiring is usually comparing two or three businesses at once. The first reply tends to win, and a reply the next morning tends not to.',
        'The second pattern is the repeat client. Many appointments are part of a series or a regular schedule, so the history shows who is due. When the front desk is busy, that list is worked as far as the day allows, and the clients below the line simply stop booking. They were never lost to a competitor. Nobody asked them.',
      ],
    },
    strip: [
      {
        key: 'Operating shape',
        detail: 'Paid and social enquiries, consultations, and series or repeat bookings',
      },
      {
        key: 'Primary loss',
        detail: 'Slow first response; consultations with no date; lapsed repeat clients',
      },
      {
        key: 'Group question',
        detail: 'Which locations and providers turn an enquiry into an attended appointment',
      },
      { key: 'Modules in scope', detail: 'Answer · Respond · Retain · Reactivate' },
    ],
    workflows: [
      {
        index: '01',
        title: 'First-reply speed on new enquiries',
        problem:
          'Ad, social and web-form enquiries that arrive in the evening or at the weekend and are answered the next working day, after the person has chosen elsewhere.',
        reads: 'Arrival and first-reply timestamps per channel, per location, per hour.',
        module: 'Respond',
      },
      {
        index: '02',
        title: 'Missed calls at the front desk',
        problem:
          'New-client calls that ring out while the team is with a client, leaving no record and no callback.',
        reads: 'Call detail records, abandonment, repeat attempts from the same number.',
        module: 'Answer',
      },
      {
        index: '03',
        title: 'Consultations without a booking',
        problem:
          'A consultation that ends with interest and no appointment attached, and no one assigned to follow it up.',
        reads:
          'Whether a consultation has a linked booking. Status only, never what was discussed.',
        module: 'Retain',
      },
      {
        index: '04',
        title: 'Series and package continuation',
        problem:
          'Clients part-way through a booked series whose next appointment was never made, so the series quietly stops.',
        reads: 'Package or series status and next-booking presence. Never the treatment record.',
        module: 'Retain',
      },
      {
        index: '05',
        title: 'Lapsed repeat-client reactivation',
        problem:
          'Regular clients past the interval at which they usually rebook, who have not been contacted since their last visit.',
        reads:
          'Last-visit dates, the business’s own rebooking intervals, consent and suppression state.',
        module: 'Reactivate',
      },
      {
        index: '06',
        title: 'Membership lapse',
        problem:
          'Memberships that stop renewing or go unused, with no recorded reason and nobody assigned to ask.',
        reads: 'Membership status and renewal dates. Status only, never payment details.',
        module: 'Reactivate',
      },
      {
        index: '07',
        title: 'No-show and late-cancellation recovery',
        problem:
          'A held room and provider slot lost inside the notice window, where refilling it by hand competes with the client in front of the desk.',
        reads:
          'Cancellation events with notice period, and the waiting demand that matches the slot.',
        module: 'Retain',
      },
    ],
    feature: {
      aside: 'Rebooking view',
      title: 'Where interest stops',
      emphasis: 'becoming a booked visit.',
      lead: 'Reporting by location and by provider is only useful if every one is measured on the same four stages. The interesting number is not how many enquiries or consultations there were; it is the distance between interest and an attended appointment, and whether that distance is the same on a Tuesday as on a Saturday.',
      kind: 'recall',
    },
    boundaries: [
      'No clinical claim is made anywhere in this system. Grow Label does not assess, diagnose, recommend or advise on any treatment.',
      'Treatment content is never read, quoted or discussed. Only the scheduling status of a consultation, series or membership is used.',
      'Rebooking intervals are set by the business and its clinicians, never by Grow Label.',
      'Suppression and consent are applied immediately and without exception across every module.',
    ],
  },
];

export function getIndustry(slug: string): IndustryDefinition | undefined {
  return INDUSTRIES.find((i) => i.slug === slug);
}
