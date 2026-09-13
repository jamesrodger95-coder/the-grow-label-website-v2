/**
 * CLIENT TESTIMONIALS — attributed, and supplied by the client.
 *
 * ---------------------------------------------------------------------------
 * WHAT THIS FILE IS, AND WHAT IT IS NOT
 * ---------------------------------------------------------------------------
 * Everything here is a real, named client of Grow Label. That is the whole
 * difference between this file and `src/content/illustrative.ts`, which holds
 * fabricated examples and labels every one of them on the page.
 *
 * Because these are real, three obligations travel with them and none of them
 * is optional:
 *
 *   1. A signed release exists for every person named here, covering the
 *      wording, the attribution and — for the video entries — the recording.
 *      `docs/CLAIMS_REGISTER.md` is where that is recorded.
 *   2. The figures are the client's own reported outcome over the stated
 *      period. They are not modelled, not annualised and not extrapolated.
 *   3. Nothing here is presented as typical, average or expected. Six named
 *      outcomes are six named outcomes; the site says so, and never rounds
 *      them into a benchmark.
 *
 * If a release lapses or a client withdraws, delete the entry. Do not soften
 * it into an anonymous one — an unattributed quotation carrying a real figure
 * is the exact thing this site refuses to publish.
 *
 * ---------------------------------------------------------------------------
 * CURRENCY
 * ---------------------------------------------------------------------------
 * Figures are shown in the currency of the practice they came from, and the
 * unit is part of the string so no component ever has to format one.
 *
 * A converted figure is a figure with a rate and a date hidden inside it, so
 * there is exactly one on this site and neither is hidden: Dr Qureshi's
 * recovery was reported as 27,000 dirhams but the practice is in Saudi Arabia,
 * so it is published in riyals. Both currencies are pegged to the dollar and
 * neither peg has moved in decades — AED 3.6725/USD since 1997, SAR 3.75/USD
 * since 1986 — which is why the conversion has no date attached to it and will
 * not drift:
 *
 *     27,000 AED ÷ 3.6725 = 7,351.94 USD × 3.75 = 27,569.78 SAR
 *
 * Published as SAR 27,570. The working is repeated in
 * `docs/CLAIMS_REGISTER.md` so it is reviewable without reading the source.
 *
 * Worth confirming with the client before the release is countersigned: if the
 * figure was always riyals and "DHS" was a slip in the handover, the correct
 * number is SAR 27,000 and this conversion should be undone.
 */

/* -------------------------------------------------------------------------- */
/* Written testimonials                                                       */
/* -------------------------------------------------------------------------- */

export type Testimonial = {
  id: string;
  quote: string;
  name: string;
  /** The role alone. Practice names are published only where the client asked. */
  role: string;
  sector: 'Veterinary' | 'Dental';
  /** Seeds the initials avatar, so the set reads as a range rather than a run. */
  hue: number;
};

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 't-hussain',
    quote:
      'James and the team have been brilliant. We’re filling gaps in the diary that would previously have stayed empty.',
    name: 'Dr Elias Hussain',
    role: 'Dentist',
    sector: 'Dental',
    hue: 250,
  },
  {
    id: 't-qureshi',
    quote:
      'We were losing enquiries because we couldn’t follow up quickly enough. James and the team have helped us turn more of those into booked appointments.',
    name: 'Dr Hassan Qureshi',
    role: 'Dental Practice Owner',
    sector: 'Dental',
    hue: 268,
  },
  {
    id: 't-reed',
    quote:
      'James and the team are great to work with. They’ve taken a lot of the follow-up off our hands, giving us more time with clients and their pets.',
    name: 'Dr Daniel Reed',
    role: 'Veterinary Surgeon',
    sector: 'Veterinary',
    hue: 232,
  },
  {
    id: 't-bennett',
    quote:
      'We’re getting more repeat bookings, and it’s making a difference to our revenue. James and the team have been helpful throughout.',
    name: 'Laura Bennett',
    role: 'Veterinary Practice Manager',
    sector: 'Veterinary',
    hue: 256,
  },
  {
    id: 't-haddad',
    quote:
      'James and the team have helped us bring back patients who were overdue a visit. It’s been a straightforward way to keep the diary busier.',
    name: 'Dr Samir Haddad',
    role: 'Dentist',
    sector: 'Dental',
    hue: 240,
  },
  {
    id: 't-harris',
    quote:
      'Having James and the team handle the follow-up has been a huge help. We’re recovering missed bookings without adding more work for reception.',
    name: 'Sophie Harris',
    role: 'Veterinary Practice Manager',
    sector: 'Veterinary',
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
  /** Where the practice is, which is the only location detail published. */
  location: string;
  /**
   * The headline outcome, split so the figure can be set in the accent and the
   * qualifier cannot be separated from it. `period` is not optional: a recovery
   * figure without the window it covers is not a result, it is a number.
   */
  figure: string;
  period: string;
  /** One line on what the figure is, under the headline. */
  detail: string;
  /**
   * The recording, under `public/testimonials/`. There is no poster field and
   * no duration field: the card renders the `<video>` directly with the
   * browser's own controls, so the first frame is the cover and the control bar
   * carries the duration. A poster is a second file to keep in sync with the
   * first frame of the recording, and it was showing the wrong thing whenever
   * it drifted. See `docs/media/VIDEO_TESTIMONIALS.md` for naming and encoding.
   */
  video: string;
  hue: number;
};

export const VIDEO_TESTIMONIALS: VideoTestimonial[] = [
  {
    id: 'v-hussain',
    name: 'Dr Elias Hussain',
    role: 'Dentist',
    location: 'United Arab Emirates',
    figure: '$20,000',
    period: 'recovered in two months',
    detail: 'Treatment already accepted, rebooked and attended.',
    video: '/testimonials/elias-hussain.mp4',
    hue: 250,
  },
  {
    id: 'v-qureshi',
    name: 'Dr Hassan Qureshi',
    role: 'Dental Practice Owner',
    location: 'Saudi Arabia',
    figure: '19 gaps filled',
    period: 'in one month',
    // The one converted figure on the site. See the CURRENCY note at the head
    // of this file: reported as 27,000 dirhams, converted to riyals at the two
    // standing dollar pegs because the practice is Saudi. Rate and working are
    // recorded in docs/CLAIMS_REGISTER.md.
    detail: 'SAR 27,570 recovered from short-notice diary gaps.',
    video: '/testimonials/hassan-qureshi.mp4',
    hue: 266,
  },
  {
    id: 'v-haddad',
    name: 'Dr Samir Haddad',
    role: 'Dentist',
    location: 'United Arab Emirates',
    figure: 'AED 33,000',
    period: 'recovered',
    detail: 'Patients overdue a visit, contacted and returned to the diary.',
    video: '/testimonials/samir-haddad.mp4',
    hue: 236,
  },
];
