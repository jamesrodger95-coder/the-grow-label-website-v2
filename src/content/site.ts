/**
 * Global site facts, navigation and shared strings.
 *
 * Nothing in this file may assert an unverified commercial claim. See
 * docs/CLAIMS_REGISTER.md for the register of statements that require evidence
 * before they can appear publicly.
 */

export const SITE = {
  name: 'Grow Label',
  /** One-line description used in metadata and the footer. */
  description:
    'Revenue recovery and revenue operations for veterinary, dental and med spa organisations. Grow Label finds demand a practice already generated and did not convert, then reports the result at four separate stages.',
  shortDescription:
    'Revenue recovery and revenue operations for veterinary, dental and med spa organisations.',
  locale: 'en_GB',
  themeColor: '#fbfaf8',
} as const;

export type NavLink = {
  href: string;
  label: string;
  /** Short descriptor used in the mobile drawer and the footer. */
  note?: string;
  /** Makes the item a dropdown. The item's own href is then not navigated to. */
  children?: NavLink[];
  /** Set apart from the rest of the nav: the Design Studio's glowing pill. */
  variant?: 'studio';
};

export type NavGroup = {
  id: string;
  label: string;
  links: NavLink[];
};

/**
 * Primary navigation.
 *
 * Ordered the way a buyer actually reads the business: what it does, who it
 * is for, and what came of it. Methodology lives on the modules page, beside
 * the modules it governs, and a nav item called "Insights" asks the reader to
 * guess.
 *
 * Platform and About were retired from the live site (their routes are kept
 * in `src/app/_archive/`, which Next does not serve). "Case studies" points at
 * the client video testimonials on the homepage: the written placeholder
 * studies and their pages were removed.
 */
export const PRIMARY_NAV: NavLink[] = [
  { href: '/modules', label: 'Modules' },
  {
    href: '/industries',
    label: 'Industries',
    children: [
      { href: '/industries/dental', label: 'Dental', note: 'Practices and dental groups' },
      { href: '/industries/veterinary', label: 'Veterinary', note: 'Practices and groups' },
      { href: '/industries/med-spa', label: 'Med spa', note: 'Med spas and groups' },
    ],
  },
  { href: '/#videos', label: 'Case studies' },
];

/**
 * The Design Studio: a different offering (AI video, imagery and ad creative),
 * so it sits apart from the clinic destinations, to the right of the primary
 * call to action, as a glowing pill.
 */
export const STUDIO_LINK: NavLink = { href: '/AI', label: 'Design Studio', variant: 'studio' };

/** Grouped navigation for the mobile drawer and the footer. */
export const NAV_GROUPS: NavGroup[] = [
  {
    id: 'product',
    label: 'Product',
    links: [
      { href: '/modules', label: 'Modules', note: 'The four modules in one place' },
      { href: '/modules/answer', label: 'Answer', note: 'Calls that go unanswered' },
      { href: '/modules/respond', label: 'Respond', note: 'First response on enquiries' },
      { href: '/modules/retain', label: 'Retain', note: 'Protecting a filled schedule' },
      { href: '/modules/reactivate', label: 'Reactivate', note: 'Records that stopped moving' },
    ],
  },
  {
    id: 'studio',
    label: 'Design Studio',
    links: [
      {
        href: '/AI',
        label: 'Design Studio',
        note: 'AI video, imagery and ad creative',
        variant: 'studio',
      },
    ],
  },
  {
    id: 'sector',
    label: 'Industries',
    links: [
      { href: '/industries/dental', label: 'Dental', note: 'Practices and dental groups' },
      { href: '/industries/veterinary', label: 'Veterinary', note: 'Practices and groups' },
      { href: '/industries/med-spa', label: 'Med spa', note: 'Med spas and groups' },
    ],
  },
  {
    id: 'evidence',
    label: 'Evidence',
    links: [
      { href: '/#videos', label: 'Case studies', note: 'Clients, in their own words' },
      { href: '/#team', label: 'Team', note: 'The people who do the work' },
    ],
  },
  {
    id: 'company',
    label: 'Company',
    links: [
      { href: '/insights', label: 'Insights', note: 'Notes on revenue operations' },
      { href: '/contact', label: 'Contact', note: 'Request an assessment' },
    ],
  },
  {
    id: 'legal',
    label: 'Legal',
    links: [
      { href: '/privacy', label: 'Privacy' },
      { href: '/terms', label: 'Terms' },
    ],
  },
];

export const CTA = {
  primary: {
    label: 'Request an assessment',
    longLabel: 'Request a revenue-recovery assessment',
    href: '/contact',
  },
  methodology: {
    label: 'How value is measured',
    href: '/modules#value-stages',
  },
} as const;

/** The four value stages, in order. Used everywhere a figure is presented. */
export const VALUE_STAGES = [
  {
    id: 'estimated',
    name: 'Estimated',
    confidence: 'Modelled',
    definition:
      'The value of an opportunity at the moment it was detected, priced from the practice’s own fee schedule.',
  },
  {
    id: 'booked',
    name: 'Booked',
    confidence: 'System record',
    definition:
      'An appointment exists in the practice management system and is linked to the source event.',
  },
  {
    id: 'attended',
    name: 'Attended',
    confidence: 'System record',
    definition: 'The appointment took place and was marked as attended in the source system.',
  },
  {
    id: 'collected',
    name: 'Collected',
    confidence: 'Ledger',
    definition: 'Payment is recorded against the practice ledger. Only this figure is revenue.',
  },
] as const;

export type ValueStage = (typeof VALUE_STAGES)[number];
