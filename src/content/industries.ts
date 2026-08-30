/**
 * Veterinary and dental pages.
 *
 * These describe workflow candidates and the data each would need. They do not
 * describe delivered outcomes, and they contain no clinical claim of any kind.
 */

export type IndustrySlug = 'veterinary' | 'dental';

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
  /** The distinct organising idea for this sector's page. */
  thesis: { title: string; emphasis: string; body: string[] };
  strip: { key: string; detail: string }[];
  workflows: Workflow[];
  /** Sector-specific closing section; deliberately different between the two. */
  feature: {
    num: string;
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
    label: 'Sector 01 / 02',
    lead: 'Veterinary groups lose demand at the edges of the day and in the gap between one visit and the next one that never gets booked.',
    thesis: {
      title: 'The veterinary problem is',
      emphasis: 'the shape of the day.',
      body: [
        'Consulting runs in blocks, surgery takes the middle of the day, and the phone does not observe either. Owners call when something changes at home — early morning, evening, and across the weekend — which is precisely when the desk is thinnest or closed.',
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
        reads: 'Plan status and due dates. Status only — never the clinical record behind it.',
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
        reads: 'Released slots inside the actionable horizon, and the waiting demand that matches them.',
        module: 'Retain',
      },
    ],
    feature: {
      num: '§ 03 / 04',
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
    label: 'Sector 02 / 02',
    lead: 'Dental practices lose demand between acceptance and scheduling, and in a hygiene recall list that stops being worked at the same point every month.',
    thesis: {
      title: 'The dental problem is',
      emphasis: 'the interval and the gap after yes.',
      body: [
        'Dentistry is unusual in that a large amount of demand is already qualified and already agreed. Treatment is discussed, the patient accepts, and then the appointment is not made before they leave. The plan sits in the system as an accepted, unscheduled item — the highest-intent demand in the practice, and the least worked.',
        'The second pattern is the recall. Hygiene runs on fixed intervals, the list is generated reliably, and it is worked as far down as the day allows. Where the list stops is where the revenue stops, and that line moves depending on how busy reception was.',
      ],
    },
    strip: [
      { key: 'Operating shape', detail: 'Chair-time utilisation across providers and sites' },
      { key: 'Primary loss', detail: 'Accepted treatment never scheduled; recall adherence' },
      { key: 'Group question', detail: 'Which providers and locations convert acceptance to attendance' },
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
          'Web and message enquiries — often for higher-value treatment — answered a day after the patient decided.',
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
        reads: 'Cancellation events with notice period, and the waiting demand that matches the slot.',
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
      num: '§ 03 / 04',
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
];

export function getIndustry(slug: string): IndustryDefinition | undefined {
  return INDUSTRIES.find((i) => i.slug === slug);
}
