/**
 * Field shapes for the /AI free-sample request, shared by the form and the
 * route handler.
 *
 * Dependency-free for the same reason as contact-fields.ts: the client needs
 * the types and the option list, and importing the zod schema here would pull
 * the validator into the browser bundle. Validation is in sample-schema.ts.
 */

/** The one qualifying question: how much content the business needs. */
export const SAMPLE_NEEDS = ['one-off', 'monthly', 'unsure'] as const;
export type SampleNeed = (typeof SAMPLE_NEEDS)[number];

export const SAMPLE_NEED_LABELS: Record<SampleNeed, string> = {
  'one-off': 'A one-off project',
  monthly: 'Regular content each month',
  unsure: 'Not sure yet',
};

export const SAMPLE_BUSINESSES = [
  'ecommerce',
  'software',
  'home-improvement',
  'construction',
  'hvac',
  'plumbing',
  'electrical',
  'roofing-solar',
  'landscaping',
  'real-estate',
  'beauty',
  'fashion',
  'food-drink',
  'health-fitness',
  'other',
] as const;
export type SampleBusiness = (typeof SAMPLE_BUSINESSES)[number];

export type SampleInput = {
  name: string;
  email: string;
  brand: string;
  /** Optional (not asked on the form for now); empty when not given. */
  business: SampleBusiness | '';
  /** Optional (not asked on the form for now); empty when not given. */
  need: SampleNeed | '';
  /** Optional: a page to feature. Empty when not given. */
  productUrl: string;
  /** Optional: anything specific they want to see. Empty when not given. */
  note: string;
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
