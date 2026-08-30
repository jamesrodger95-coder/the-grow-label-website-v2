import type { MetadataRoute } from 'next';
import { siteUrl } from '@/lib/env';

export default function robots(): MetadataRoute.Robots {
  const base = siteUrl();
  const isPreview = process.env.VERCEL_ENV === 'preview' || !process.env.NEXT_PUBLIC_SITE_URL;

  return {
    rules: isPreview
      ? [{ userAgent: '*', disallow: '/' }]
      : [{ userAgent: '*', allow: '/', disallow: ['/dev/', '/api/'] }],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
