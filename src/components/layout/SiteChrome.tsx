'use client';

import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

/**
 * The main site's navigation and footer, withheld from routes that bring
 * their own.
 *
 * /AI is a separate offering for a separate audience, so it carries its own
 * header and footer and must not inherit the clinic site's. A client
 * component because the root layout cannot see the path; the children are
 * still server-rendered, and on every other route they render exactly as
 * before.
 */
const STANDALONE = /^\/ai(?:\/|$)/i;

export function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  if (pathname && STANDALONE.test(pathname)) return null;
  return <>{children}</>;
}
