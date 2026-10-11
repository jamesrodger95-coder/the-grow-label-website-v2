/**
 * Field shapes for the /AI free-sample request, shared by the form and the
 * route handler.
 *
 * Dependency-free for the same reason as contact-fields.ts: the client needs
 * the types and the option list, and importing the zod schema here would pull
 * the validator into the browser bundle. Validation is in sample-schema.ts.
 */

export const SAMPLE_PREFERENCES = ['video', 'images'] as const;
export type SamplePreference = (typeof SAMPLE_PREFERENCES)[number];

export const SAMPLE_PREFERENCE_LABELS: Record<SamplePreference, string> = {
  video: 'Video',
  images: 'Images',
};

export const SAMPLE_BUSINESSES = [
  'ecommerce',
  'saas',
  'home-improvement',
  'hvac',
  'plumbing',
  'electrical',
  'other',
] as const;
export type SampleBusiness = (typeof SAMPLE_BUSINESSES)[number];

export type SampleInput = {
  name: string;
  email: string;
  brand: string;
  business: SampleBusiness;
  productUrl: string;
  preference: SamplePreference;
  /** Honeypot. Must be empty; bots fill it in. */
  hp?: string;
  /** Milliseconds between form render and submit. */
  elapsed?: number;
};

export type SampleFieldErrors = Partial<Record<keyof SampleInput, string>>;

export type SampleResult =
  | { status: 'success'; reference: string }
  | { status: 'error'; message: string; fieldErrors?: SampleFieldErrors }
  | { status: 'unconfigured'; message: string };
