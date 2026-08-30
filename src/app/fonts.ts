import { Archivo, IBM_Plex_Mono, Instrument_Serif } from 'next/font/google';

/**
 * Three families, four files, latin subset only.
 *
 * The two faces that paint the first screen are preloaded. The monospace
 * carries labels and figures only, so it is discovered from the stylesheet.
 *
 * Instrument Serif ships roman and italic together rather than as two
 * declarations. Splitting them to keep the italic off the critical path was
 * measured and rejected: it moved LCP by less than the run-to-run variance and
 * introduced a layout shift as the italic swapped into headlines mid-render.
 *
 * Every face uses `display: swap` rather than `optional`. Rendering a first
 * visit entirely in Arial to save a fraction of a second is the wrong trade for
 * a brand whose argument is carried by its typography, and `optional` was
 * measured to make no difference to LCP here in any case.
 */

export const archivo = Archivo({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-archivo',
  weight: 'variable',
  preload: true,
  adjustFontFallback: true,
  fallback: ['Helvetica Neue', 'Arial', 'sans-serif'],
});

export const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-instrument-serif',
  weight: '400',
  style: ['normal', 'italic'],
  preload: true,
  adjustFontFallback: true,
  fallback: ['Times New Roman', 'serif'],
});

export const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-plex-mono',
  weight: ['400'],
  preload: false,
  adjustFontFallback: true,
  fallback: ['ui-monospace', 'SFMono-Regular', 'monospace'],
});

export const fontVariables = [archivo.variable, instrumentSerif.variable, plexMono.variable].join(
  ' '
);
