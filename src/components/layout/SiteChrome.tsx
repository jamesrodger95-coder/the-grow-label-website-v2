'use client';

import type { ReactNode } from 'react';

/**
 * The clinic site's navigation and footer.
 *
 * Withheld everywhere while the clinic site is retired from public view: the
 * studio home brings its own header and footer, and the legal pages carry a
 * link back to it. Kept as a component so the clinic chrome can return by
 * restoring the path check (see git history).
 */
export function SiteChrome({ children }: { children: ReactNode }) {
  void children;
  return null;
}
