import { Archivo, IBM_Plex_Mono, Instrument_Serif } from 'next/font/google';

/**
 * Three families, four files, latin subset only.
 *
 * Display and interface faces are preloaded because they paint the LCP element.
 * The monospace face carries labels and figures only, so it is not preloaded.
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

export const fontVariables = `${archivo.variable} ${instrumentSerif.variable} ${plexMono.variable}`;
