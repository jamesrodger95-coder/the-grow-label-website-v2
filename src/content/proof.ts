/**
 * Results, case studies, testimonials, video and team.
 *
 * Everything in this file is a **labelled placeholder**. No figure, quote,
 * face, organisation or outcome here is real, and every surface that renders it
 * says so on the page rather than only in a comment. See
 * docs/CLAIMS_REGISTER.md for what evidence would be needed to publish real
 * content in each slot.
 *
 * Replacing a placeholder is a content edit in this file — no component needs
 * to change.
 */

export const PLACEHOLDER_NOTE =
  'Placeholder content. Real figures, quotations and profiles are added only once they are evidenced and approved.';

/* -------------------------------------------------------------------------- */
/* Results — how a verified outcome will be presented                         */
/* -------------------------------------------------------------------------- */

export const RESULTS = {
  eyebrow: 'Results',
  titleLines: ['Reported at four stages,', 'never as one number.'],
  lead: 'This is the shape every Grow Label report takes. When a client result is published here, it arrives in exactly this frame — the same four stages, each with the evidence that promoted it.',
  cards: [
    {
      stage: 'Estimated',
      basis: 'Modelled from your fee schedule',
      width: '100%',
      tone: 'var(--gl-stage-1)',
      hint: 'Opportunity detected',
    },
    {
      stage: 'Booked',
      basis: 'Appointment record in your PMS',
      width: '74%',
      tone: 'var(--gl-stage-2)',
      hint: 'A date exists',
    },
    {
      stage: 'Attended',
      basis: 'Attendance status in your PMS',
      width: '61%',
      tone: 'var(--gl-stage-3)',
      hint: 'The appointment happened',
    },
    {
      stage: 'Collected',
      basis: 'Payment against your ledger',
      width: '52%',
      tone: 'var(--gl-stage-4)',
      hint: 'The only figure that is revenue',
    },
  ],
  note: 'Every published result will carry its reporting period, its cut-off date, its attribution status and a link to the source events behind it.',
} as const;

/* -------------------------------------------------------------------------- */
/* Case studies                                                               */
/* -------------------------------------------------------------------------- */

export type CaseStudy = {
  slug: string;
  sector: string;
  title: string;
  summary: string;
  chips: string[];
  /** Two hues drive the placeholder artwork so the cards differ at a glance. */
  hue: number;
};

export const CASE_STUDIES: CaseStudy[] = [
  {
    slug: 'multi-site-after-hours',
    sector: 'Veterinary · multi-site',
    title: 'After-hours demand across a practice group',
    summary:
      'What happens to contact that arrives before opening, after closing and across the weekend — and what changes when it is answered.',
    chips: ['Answer', 'Respond', 'Multi-location'],
    hue: 248,
  },
  {
    slug: 'accepted-unscheduled',
    sector: 'Dental · single site',
    title: 'Treatment accepted in the chair and never given a date',
    summary:
      'The highest-intent demand a practice holds, and the workflow that turns an accepted plan into an appointment before the patient leaves.',
    chips: ['Retain', 'Reactivate', 'Chair time'],
    hue: 262,
  },
  {
    slug: 'hygiene-recall-depth',
    sector: 'Dental · group',
    title: 'How far down the recall list a practice actually gets',
    summary:
      'Where the list stops being worked is where the revenue stops. Measuring that line, then holding it steady week to week.',
    chips: ['Reactivate', 'Recall', 'Provider view'],
    hue: 234,
  },
];

/* -------------------------------------------------------------------------- */
/* Written testimonials                                                       */
/* -------------------------------------------------------------------------- */

export type Testimonial = {
  id: string;
  quote: string;
  name: string;
  role: string;
  org: string;
  hue: number;
};

/**
 * The quotes below describe the *kind* of thing a client would be asked to say,
 * so the section can be reviewed for design. They are attributed to obvious
 * placeholders and must be replaced wholesale, not edited.
 */
export const TESTIMONIALS: Testimonial[] = [
  {
    id: 't1',
    quote:
      'Placeholder quotation. This slot is sized for two or three sentences about a specific operational change, not a general endorsement.',
    name: 'Name to be confirmed',
    role: 'Operations Director',
    org: 'Client organisation',
    hue: 250,
  },
  {
    id: 't2',
    quote:
      'Placeholder quotation. The strongest version of this names the workflow that changed and what it replaced.',
    name: 'Name to be confirmed',
    role: 'Practice Owner',
    org: 'Client organisation',
    hue: 268,
  },
  {
    id: 't3',
    quote:
      'Placeholder quotation. A finance-side quote belongs here, about the reporting rather than the automation.',
    name: 'Name to be confirmed',
    role: 'Finance Director',
    org: 'Client organisation',
    hue: 232,
  },
  {
    id: 't4',
    quote:
      'Placeholder quotation. Reserved for a practice manager describing what stopped landing on their desk.',
    name: 'Name to be confirmed',
    role: 'Practice Manager',
    org: 'Client organisation',
    hue: 256,
  },
  {
    id: 't5',
    quote:
      'Placeholder quotation. A multi-site quote about comparing locations on the same definitions.',
    name: 'Name to be confirmed',
    role: 'Group Operations Lead',
    org: 'Client organisation',
    hue: 240,
  },
  {
    id: 't6',
    quote:
      'Placeholder quotation. Something about the assessment itself, and what it surfaced before any commitment.',
    name: 'Name to be confirmed',
    role: 'Managing Partner',
    org: 'Client organisation',
    hue: 274,
  },
];

/* -------------------------------------------------------------------------- */
/* Video testimonials                                                         */
/* -------------------------------------------------------------------------- */

export type VideoTestimonial = {
  id: string;
  name: string;
  role: string;
  org: string;
  duration: string;
  /** Set to a real embed URL to enable playback; null renders the empty state. */
  src: string | null;
  hue: number;
};

export const VIDEO_TESTIMONIALS: VideoTestimonial[] = [
  {
    id: 'v1',
    name: 'Name to be confirmed',
    role: 'Operations Director',
    org: 'Client organisation',
    duration: '2:14',
    src: null,
    hue: 250,
  },
  {
    id: 'v2',
    name: 'Name to be confirmed',
    role: 'Practice Owner',
    org: 'Client organisation',
    duration: '1:48',
    src: null,
    hue: 266,
  },
  {
    id: 'v3',
    name: 'Name to be confirmed',
    role: 'Finance Director',
    org: 'Client organisation',
    duration: '3:02',
    src: null,
    hue: 236,
  },
];

/* -------------------------------------------------------------------------- */
/* Team                                                                       */
/* -------------------------------------------------------------------------- */

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  intro: string;
  bio: string[];
  focus: string[];
  hue: number;
};

export const TEAM = {
  eyebrow: 'The team',
  titleLines: ['The people who', 'work your back book.'],
  lead: 'Grow Label is delivered by a small team that sits between your systems and your schedule. Profiles are placeholders until each person has approved their own.',
  members: [
    {
      id: 'p1',
      name: 'Name to be confirmed',
      role: 'Founder',
      intro: 'Placeholder profile. One or two lines on background and what they own here.',
      bio: [
        'Placeholder biography. Two or three short paragraphs work best in this space: what they did before Grow Label, what they are responsible for now, and the part of the product they care most about.',
        'Nothing in this profile is real. It is here so the layout, the modal and the typography can be reviewed before real profiles are written.',
      ],
      focus: ['Commercial', 'Methodology'],
      hue: 250,
    },
    {
      id: 'p2',
      name: 'Name to be confirmed',
      role: 'Head of Delivery',
      intro: 'Placeholder profile. Two lines on who owns delivery, and what they did before this.',
      bio: [
        'Placeholder biography. This slot suits someone who owns onboarding, escalation policy and the configuration conversations with each practice.',
        'Nothing in this profile is real.',
      ],
      focus: ['Onboarding', 'Escalation'],
      hue: 264,
    },
    {
      id: 'p3',
      name: 'Name to be confirmed',
      role: 'Data & Measurement',
      intro: 'Placeholder profile. Two lines on who defends the numbers, and how.',
      bio: [
        'Placeholder biography. The natural fit here is whoever defends the four-stage model, the attribution rules and the duplicate logic.',
        'Nothing in this profile is real.',
      ],
      focus: ['Attribution', 'Reporting'],
      hue: 236,
    },
    {
      id: 'p4',
      name: 'Name to be confirmed',
      role: 'Client Operations',
      intro: 'Placeholder profile. Two lines on who each practice actually speaks to.',
      bio: [
        'Placeholder biography. Day-to-day contact for practice managers, and the person who reviews what the modules did each week.',
        'Nothing in this profile is real.',
      ],
      focus: ['Accounts', 'Quality'],
      hue: 272,
    },
  ] satisfies TeamMember[],
} as const;

/* -------------------------------------------------------------------------- */
/* The quiet marquee: what the platform reads                                 */
/* -------------------------------------------------------------------------- */

export const READS_STRIP = [
  'Inbound call events',
  'Queue abandonment',
  'Out-of-hours contact',
  'Web enquiries',
  'Callback requests',
  'Response latency',
  'Appointment book',
  'Cancellations',
  'Non-attendance',
  'Released capacity',
  'Recall due dates',
  'Plan status',
  'Consent and suppression',
  'Your fee schedule',
];
