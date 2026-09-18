import { z } from 'zod';
import type { LeadInput } from './lead-fields';

/**
 * Server-side validation for a calculator lead.
 *
 * The answers are re-validated rather than trusted: the estimate that reaches
 * the CRM is recomputed on the server from these nine values, so a payload that
 * has been edited in the console produces a corrected figure rather than a
 * fabricated one.
 *
 * Server-only by convention. Importing it from a client component would pull
 * zod into the browser bundle.
 */

export const answersSchema = z.object({
  practice: z.enum(['veterinary', 'dental']),
  locations: z.enum(['1', '2-3', '4-7', '8+']),
  records: z.enum(['under-1500', '1500-4000', '4000-10000', '10000-plus']),
  weeklyAppointments: z.coerce.number().int().positive().max(20000),
  value: z.enum(['under-100', '100-200', '200-400', '400-800', '800-plus']),
  desk: z.enum(['1', '2-3', '4-6', '7-plus']),
  calls: z.enum(['voicemail', 'answering-service', 'try-again', 'not-sure']),
  noShows: z.enum(['under-5', '5-10', '10-20', 'over-20', 'not-sure']),
  campaign: z.enum(['never', 'over-12', '6-12', 'under-6']),
});

export const leadSchema = z.object({
  email: z
    .string()
    .transform((v) => v.trim())
    .pipe(z.string().email().max(200)),
  practiceName: z
    .string()
    .transform((v) => v.trim())
    .pipe(z.string().max(120))
    .optional()
    .or(z.literal('')),
  answers: answersSchema,
  /** Honeypot. Must be empty; bots fill it in. */
  website: z.string().max(0, 'unexpected').optional().or(z.literal('')),
});

/**
 * Holds the hand-written `LeadInput` the client imports tied to the schema the
 * server enforces. Change one without the other and this stops compiling.
 */
type SchemaOutput = z.infer<typeof leadSchema>;
type AssertAssignable<A extends B, B> = A;
export type SchemaMatchesInput = AssertAssignable<SchemaOutput, LeadInput>;
export type InputMatchesSchema = AssertAssignable<LeadInput, SchemaOutput>;
