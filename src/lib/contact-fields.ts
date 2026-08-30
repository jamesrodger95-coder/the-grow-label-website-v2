/**
 * Field shapes shared by the form and the route handler.
 *
 * Deliberately free of any validation library: the client only needs the option
 * lists, the labels and the result types, and importing the zod schema here
 * would pull the whole validator into the browser bundle for no benefit.
 * Validation itself is server-side, in contact-schema.ts.
 */

export const SECTORS = ['veterinary', 'dental', 'both', 'other'] as const;
export const SITE_BANDS = ['1', '2-5', '6-15', '16-50', '50+'] as const;

export type Sector = (typeof SECTORS)[number];
export type SiteBand = (typeof SITE_BANDS)[number];

export const SECTOR_LABELS: Record<Sector, string> = {
  veterinary: 'Veterinary',
  dental: 'Dental',
  both: 'Both veterinary and dental',
  other: 'Other healthcare group',
};

export const SITE_LABELS: Record<SiteBand, string> = {
  '1': 'Single site',
  '2-5': '2 to 5 sites',
  '6-15': '6 to 15 sites',
  '16-50': '16 to 50 sites',
  '50+': 'More than 50 sites',
};

export type ContactInput = {
  name: string;
  email: string;
  organisation: string;
  role?: string;
  sector: Sector;
  sites: SiteBand;
  message: string;
  /** Honeypot. Must be empty; bots fill it in. */
  website?: string;
  /** Milliseconds between form render and submit. */
  elapsed?: number;
};

export type FieldErrors = Partial<Record<keyof ContactInput, string>>;

export type ContactResult =
  | { status: 'success'; reference: string }
  | { status: 'error'; message: string; fieldErrors?: FieldErrors }
  | { status: 'unconfigured'; message: string };

/** Human-readable messages, keyed to the field they belong to. */
export const FIELD_MESSAGES: Record<string, string> = {
  name: 'Enter your name, at least two characters.',
  email: 'Enter a valid work email address.',
  organisation: 'Enter the name of the group or practice.',
  role: 'Role must be 120 characters or fewer.',
  sector: 'Choose a sector.',
  sites: 'Choose how many sites the group runs.',
  message:
    'Tell us what you are trying to recover, in at least 20 characters and no more than 2,000.',
  website: 'This request could not be accepted.',
};
