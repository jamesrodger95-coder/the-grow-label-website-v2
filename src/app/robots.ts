import type { MetadataRoute } from 'next';
import { siteUrl } from '@/lib/env';

export default function robots(): MetadataRoute.Robots {
  const base = siteUrl();
  // Only the live production deployment is indexed; previews and local builds
  // are not. Production no longer needs NEXT_PUBLIC_SITE_URL set to count.
  const isPreview =
    process.env.VERCEL_ENV !== 'production' && !process.env.NEXT_PUBLIC_SITE_URL;

  return {
    rules: isPreview
      ? [{ userAgent: '*', disallow: '/' }]
      : [{ userAgent: '*', allow: '/', disallow: ['/dev/', '/api/', '/s/'] }],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
