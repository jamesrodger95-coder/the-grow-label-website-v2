import { Archivo } from 'next/font/google';

/**
 * The /AI page's second voice: Archivo, set expanded and italic.
 *
 * The main site holds to one family, and still does: this face is imported by
 * the /AI route alone, so it is only requested, preloaded and paid for there.
 * It sets every display line on the page (headings, the band, the
 * statement, the numerals and the footer wordmark), black and purple alike;
 * body copy, labels and controls stay in Schibsted Grotesk. Chosen over a
 * serif italic accent, which read as the default pairing, and over an
 * accent-only version, which was compared side by side and passed over.
 *
 * Variable on weight and width; the width is chosen in CSS with
 * `font-stretch`, and only the italic is loaded because nothing uses the
 * upright.
 */
export const studioAccent = Archivo({
  subsets: ['latin'],
  style: ['italic'],
  axes: ['wdth'],
  display: 'swap',
  variable: '--font-studio-accent',
  fallback: ['Arial Black', 'Arial', 'sans-serif'],
});
