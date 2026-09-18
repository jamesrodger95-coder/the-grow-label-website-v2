/**
 * The shape the calculator's email capture and its route handler agree on.
 *
 * Dependency-free on purpose: the client imports this, and the validator that
 * checks the same payload server-side lives in `lead-schema.ts`, where zod can
 * be imported without it reaching the browser. Same arrangement as
 * `contact-fields.ts` / `contact-schema.ts`.
 */

import type { Answers } from './model';

export type LeadInput = {
  email: string;
  practiceName?: string;
  answers: Answers;
  /** Honeypot. Must be empty; bots fill it in. */
  website?: string;
};

export type LeadResult =
  | { status: 'success'; reference: string }
  | { status: 'error'; message: string }
  | { status: 'unconfigured'; message: string };
