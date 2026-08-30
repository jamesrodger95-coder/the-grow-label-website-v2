import { z } from 'zod';

/**
 * Server-side validation for the assessment request form.
 *
 * The form deliberately collects only commercial information. There is no field
 * for client, patient or clinical data, and free text is length-capped.
 */

export const SECTORS = ['veterinary', 'dental', 'both', 'other'] as const;
export const SITE_BANDS = ['1', '2-5', '6-15', '16-50', '50+'] as const;

const trimmed = (min: number, max: number) =>
  z
    .string()
    .transform((v) => v.trim())
    .pipe(z.string().min(min).max(max));

export const contactSchema = z.object({
  name: trimmed(2, 80),
  email: z
    .string()
    .transform((v) => v.trim())
    .pipe(z.string().email().max(200)),
  organisation: trimmed(2, 120),
  role: z
    .string()
    .transform((v) => v.trim())
    .pipe(z.string().max(120))
    .optional()
    .or(z.literal('')),
  sector: z.enum(SECTORS),
  sites: z.enum(SITE_BANDS),
  message: trimmed(20, 2000),
  /** Honeypot. Must be empty; bots fill it in. */
  website: z.string().max(0, 'unexpected').optional().or(z.literal('')),
  /** Milliseconds between form render and submit; blocks instant scripted posts. */
  elapsed: z.coerce.number().int().nonnegative().optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;

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

export function toFieldErrors(error: z.ZodError<unknown>): FieldErrors {
  const out: FieldErrors = {};
  for (const issue of error.issues) {
    const key = issue.path[0];
    if (typeof key !== 'string') continue;
    if (key in out) continue;
    out[key as keyof ContactInput] = FIELD_MESSAGES[key] ?? issue.message;
  }
  return out;
}

export const SECTOR_LABELS: Record<(typeof SECTORS)[number], string> = {
  veterinary: 'Veterinary',
  dental: 'Dental',
  both: 'Both veterinary and dental',
  other: 'Other healthcare group',
};

export const SITE_LABELS: Record<(typeof SITE_BANDS)[number], string> = {
  '1': 'Single site',
  '2-5': '2 to 5 sites',
  '6-15': '6 to 15 sites',
  '16-50': '16 to 50 sites',
  '50+': 'More than 50 sites',
};
