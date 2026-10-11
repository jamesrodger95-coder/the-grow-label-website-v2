import { z } from 'zod';
import { STUDIO_SAMPLE } from '@/content/studio';
import {
  SAMPLE_BUSINESSES,
  SAMPLE_PREFERENCES,
  type SampleFieldErrors,
  type SampleInput,
} from './sample-fields';

/**
 * Server-side validation for the /AI free-sample request.
 *
 * Server-only by convention, like contact-schema.ts: importing it from a
 * client component would put zod in the browser bundle.
 */

const trimmed = (min: number, max: number) =>
  z
    .string()
    .transform((v) => v.trim())
    .pipe(z.string().min(min).max(max));

/**
 * A product page address. People paste these without the scheme as often as
 * with it, so a bare `shop.example.com/p/1` is accepted and given https.
 * What is refused is anything without a dotted host, or a scheme other than
 * http or https.
 */
export function normaliseProductUrl(raw: string): string | null {
  const value = raw.trim();
  if (!value || value.length > 500) return null;
  const withScheme = /^[a-z][a-z0-9+.-]*:/i.test(value) ? value : `https://${value}`;
  try {
    const url = new URL(withScheme);
    if (url.protocol !== 'https:' && url.protocol !== 'http:') return null;
    if (!url.hostname.includes('.') || url.hostname.endsWith('.')) return null;
    return url.toString();
  } catch {
    return null;
  }
}

export const sampleSchema = z.object({
  name: trimmed(2, 80),
  email: z
    .string()
    .transform((v) => v.trim())
    .pipe(z.string().email().max(200)),
  brand: trimmed(2, 160),
  business: z.enum(SAMPLE_BUSINESSES),
  productUrl: z.string().transform((v, ctx) => {
    const url = normaliseProductUrl(v);
    if (!url) {
      ctx.addIssue({ code: 'custom', message: 'invalid url' });
      return z.NEVER;
    }
    return url;
  }),
  preference: z.enum(SAMPLE_PREFERENCES),
  hp: z.string().max(0, 'unexpected').optional().or(z.literal('')),
  elapsed: z.coerce.number().int().nonnegative().optional(),
});

/** Keeps the hand-written SampleInput tied to this schema; see contact-schema.ts. */
type SchemaOutput = z.infer<typeof sampleSchema>;
type AssertAssignable<A extends B, B> = A;
export type SchemaMatchesInput = AssertAssignable<SchemaOutput, SampleInput>;
export type InputMatchesSchema = AssertAssignable<SampleInput, SchemaOutput>;

export function toSampleFieldErrors(error: z.ZodError<unknown>): SampleFieldErrors {
  const out: SampleFieldErrors = {};
  const messages: Record<string, string> = STUDIO_SAMPLE.errors;
  for (const issue of error.issues) {
    const key = issue.path[0];
    if (typeof key !== 'string' || key in out) continue;
    out[key as keyof SampleInput] = messages[key] ?? issue.message;
  }
  return out;
}
