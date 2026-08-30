import { z } from 'zod';
import {
  FIELD_MESSAGES,
  SECTORS,
  SITE_BANDS,
  type ContactInput,
  type FieldErrors,
} from './contact-fields';

/**
 * Server-side validation for the assessment request form.
 *
 * The form deliberately collects only commercial information. There is no field
 * for client, patient or clinical data, and free text is length-capped.
 *
 * This module is server-only by convention — importing it from a client
 * component would pull zod into the browser bundle. Shared constants and types
 * live in contact-fields.ts, which has no dependencies.
 */

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

/**
 * Keeps the hand-written `ContactInput` in `contact-fields.ts` tied to this
 * schema. That type cannot simply be `z.infer` of it, because the client
 * imports it and zod must stay out of the browser bundle — so the coupling is
 * asserted here instead. Change a field in either place without changing the
 * other and this stops compiling.
 */
type SchemaOutput = z.infer<typeof contactSchema>;
type AssertAssignable<A extends B, B> = A;
export type SchemaMatchesInput = AssertAssignable<SchemaOutput, ContactInput>;
export type InputMatchesSchema = AssertAssignable<ContactInput, SchemaOutput>;

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

export type { ContactInput, FieldErrors };
