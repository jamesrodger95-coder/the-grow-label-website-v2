/**
 * Framing copy for the results, team and ingest surfaces.
 *
 * This file holds the *frame*: headings, leads, definitions and the notes that
 * explain what a reader is looking at. The content those frames hold lives in
 * one of two places, and which one it is, is the whole point:
 *
 *   - `src/content/illustrative.ts` — invented. Results worked example, case
 *     studies. Every surface rendering it shows a label.
 *   - `src/content/testimonials.ts` — real, named, released clients, figures
 *     included. No label, because nothing about it is illustrative.
 *
 * `TEAM` below is the exception that lives here: real colleagues, so it is
 * neither a fixture nor client evidence, and the test that guards it fails on
 * a *missing* name rather than on an invented one.
 *
 * See `docs/CLAIMS_REGISTER.md` for what evidence unblocks each slot, and for
 * the release status of every person named on the site.
 */

/* -------------------------------------------------------------------------- */
/* Results — the frame a verified outcome arrives in                          */
/* -------------------------------------------------------------------------- */

export const RESULTS = {
  eyebrow: 'Results',
  titleLines: ['Reported at four stages,', 'never as one number.'],
  lead: 'This is the shape every Grow Label report takes, and the figures below are a worked example of it: one group, one year, the same four stages with the evidence that promoted each one. Under the money sits the operational detail it came from.',
  aside: 'One engagement, four stages',
} as const;

/* -------------------------------------------------------------------------- */
/* Testimonials, video and case studies — section framing                     */
/* -------------------------------------------------------------------------- */

export const CASES_SECTION = {
  eyebrow: 'Case studies',
  titleLines: ['Six write-ups of the work,', 'in the shape a real one takes.'],
  aside: 'Three veterinary · three dental',
  lead: 'Each of these describes a place demand is commonly lost, what an assessment finds when it looks there, what the modules do about it, and what that produces at each of the four value stages. The workflows are real. The organisations and the figures are not.',
} as const;

export const QUOTES_SECTION = {
  eyebrow: 'In their words',
  title: 'What our clients',
  emphasis: 'have to say.',
} as const;

export const VIDEO_SECTION = {
  title: 'Three clients,',
  emphasis: 'on what changed.',
  note: 'See what some of our clients have to say.',
  /**
   * The typicality line, under the cards rather than over them.
   *
   * Three real clients are named above three real recovery figures. Published
   * without a line saying they are not a rate anyone else should expect, that
   * is a results claim rather than a testimonial — which is the one thing this
   * site has never made. It reads quietly at the foot of the section instead
   * of competing with the heading, but it does have to be there, and a test
   * fails the build if it goes missing.
   */
  foot: 'Each figure is that client’s own reported recovery over the period shown on their card. No result is typical and none of these is an average.',
} as const;

/* -------------------------------------------------------------------------- */
/* Team                                                                       */
/* -------------------------------------------------------------------------- */

export type TeamMember = {
  id: string;
  /** Real colleagues. Never invent one — see the test that enforces this. */
  name: string;
  role: string;
  /** One line on what this person owns, shown on the card. */
  intro: string;
  /**
   * Portrait path under `public/team/`. Every member has one reserved, and a
   * missing file renders the drawn placeholder rather than a broken image —
   * see `docs/media/TEAM_PORTRAITS.md` for the file names and the crop.
   */
  photo: string;
  /** Seeds the placeholder while the photograph is outstanding. */
  hue: number;
};

/**
 * The four people a client deals with.
 *
 * These are real colleagues, so the rule here is the opposite of the one in
 * `illustrative.ts`: nothing in this list may be invented, and a person is
 * added only once they are actually on the account. Portraits are the one
 * outstanding item and the cards render without them.
 */
export const TEAM = {
  eyebrow: 'The team',
  titleLines: ['The four people', 'on your account.'],
  aside: 'Founders, client relations and advisory',
  lead: 'Grow Label is delivered by a small team that sits between your systems and your schedule. These are the four people you deal with and what each of them owns.',
  members: [
    {
      id: 'james-rodger',
      name: 'James Rodger',
      role: 'Co-Founder',
      intro:
        'Owns the commercial position, the four-stage measurement model, and the things this product refuses to do.',
      photo: '/team/james-rodger.jpg',
      hue: 250,
    },
    {
      id: 'trent-overy',
      name: 'Trent Overy',
      role: 'Co-Founder',
      intro:
        'Owns delivery: onboarding, the module ceiling, and the escalation policy your team lives with.',
      photo: '/team/trent-overy.jpg',
      hue: 264,
    },
    {
      id: 'isabelle-njorrak',
      name: 'Isabelle Njorrak',
      role: 'Client Relations Manager',
      intro: 'Your day-to-day contact, and the person who reviews what each module did every week.',
      photo: '/team/isabelle-njorrak.jpg',
      hue: 236,
    },
    {
      id: 'hadleigh-bognuda',
      name: 'Hadleigh Bognuda',
      role: 'Advisor',
      intro:
        'Sense-checks the measurement model and the commercial position against how groups actually buy.',
      photo: '/team/hadleigh-bognuda.jpg',
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
