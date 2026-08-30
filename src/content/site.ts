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
  themeColor: '#08080b',
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

/** Primary desktop navigation. Kept to seven items so it never wraps. */
export const PRIMARY_NAV: NavLink[] = [
  { href: '/platform', label: 'Platform' },
  { href: '/modules/answer', label: 'Modules' },
  { href: '/industries/veterinary', label: 'Veterinary' },
  { href: '/industries/dental', label: 'Dental' },
  { href: '/methodology', label: 'Methodology' },
  { href: '/insights', label: 'Insights' },
  { href: '/about', label: 'About' },
];

/** Grouped navigation for the mobile drawer and the footer. */
export const NAV_GROUPS: NavGroup[] = [
  {
    id: 'platform',
    label: 'Platform',
    links: [
      { href: '/platform', label: 'Platform overview', note: 'How the system fits together' },
      { href: '/modules/answer', label: 'Answer', note: 'Calls that go unanswered' },
      { href: '/modules/respond', label: 'Respond', note: 'First response on enquiries' },
      { href: '/modules/retain', label: 'Retain', note: 'Protecting a filled schedule' },
      { href: '/modules/reactivate', label: 'Reactivate', note: 'Dormant records' },
    ],
  },
  {
    id: 'sector',
    label: 'Sector',
    links: [
      { href: '/industries/veterinary', label: 'Veterinary', note: 'Multi-site practice groups' },
      { href: '/industries/dental', label: 'Dental', note: 'Practices and dental groups' },
      { href: '/methodology', label: 'Methodology', note: 'How value is measured' },
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
    href: '/methodology',
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
