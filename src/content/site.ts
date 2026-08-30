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
    'Revenue recovery and revenue operations for veterinary and dental organisations. Grow Label finds demand a practice already generated and did not convert, then reports the result at four separate stages.',
  shortDescription:
    'Revenue recovery and revenue operations for veterinary and dental organisations.',
  locale: 'en_GB',
  themeColor: '#fbfaf8',
} as const;

export type NavLink = {
  href: string;
  label: string;
  /** Short descriptor used in the mobile drawer and the footer. */
  note?: string;
};

export type NavGroup = {
  id: string;
  label: string;
  links: NavLink[];
};

/**
 * Primary navigation.
 *
 * Ordered the way a buyer actually reads the business: what it is, what it
 * does, who it is for, what came of it, who is behind it. Methodology and
 * Insights are deliberately absent — methodology is not a destination, it is
 * the argument the Platform page makes, and a nav item called "Insights" asks
 * the reader to guess.
 *
 * Results and case studies live on the homepage, so they are anchors rather
 * than invented routes.
 */
export const PRIMARY_NAV: NavLink[] = [
  { href: '/platform', label: 'Platform' },
  { href: '/modules', label: 'Modules' },
  { href: '/industries/veterinary', label: 'Veterinary' },
  { href: '/industries/dental', label: 'Dental' },
  { href: '/#results', label: 'Results' },
  { href: '/#case-studies', label: 'Case studies' },
  { href: '/about', label: 'About' },
];

/** Grouped navigation for the mobile drawer and the footer. */
export const NAV_GROUPS: NavGroup[] = [
  {
    id: 'product',
    label: 'Product',
    links: [
      { href: '/platform', label: 'Platform', note: 'How the system fits together' },
      { href: '/modules', label: 'Modules', note: 'The four modules in one place' },
      { href: '/modules/answer', label: 'Answer', note: 'Calls that go unanswered' },
      { href: '/modules/respond', label: 'Respond', note: 'First response on enquiries' },
      { href: '/modules/retain', label: 'Retain', note: 'Protecting a filled schedule' },
      { href: '/modules/reactivate', label: 'Reactivate', note: 'Records that stopped moving' },
    ],
  },
  {
    id: 'sector',
    label: 'Sectors',
    links: [
      { href: '/industries/veterinary', label: 'Veterinary', note: 'Practices and groups' },
      { href: '/industries/dental', label: 'Dental', note: 'Practices and dental groups' },
    ],
  },
  {
    id: 'evidence',
    label: 'Evidence',
    links: [
      { href: '/#results', label: 'Results', note: 'How an outcome is reported' },
      { href: '/#case-studies', label: 'Case studies', note: 'Engagements in progress' },
      { href: '/#team', label: 'Team', note: 'The people who do the work' },
    ],
  },
  {
    id: 'company',
    label: 'Company',
    links: [
      { href: '/about', label: 'About', note: 'Position and operating principles' },
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
    href: '/platform#value-stages',
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
