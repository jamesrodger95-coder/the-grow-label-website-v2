import { Schibsted_Grotesk } from 'next/font/google';

/**
 * One typeface, one variable file, latin subset.
 *
 * Schibsted Grotesk carries display, interface, labels and figures. Hierarchy
 * comes from weight, size, tracking and colour rather than from a second
 * family — the same discipline Apple applies with SF, and the reason the page
 * reads as one system instead of an assembly.
 *
 * It also means the critical path holds a single font request, which is the
 * cheapest typography a site like this can have.
 */
export const schibsted = Schibsted_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-schibsted',
  weight: 'variable',
  preload: true,
  adjustFontFallback: true,
  fallback: ['Helvetica Neue', 'Arial', 'sans-serif'],
});

export const fontVariables = schibsted.variable;
