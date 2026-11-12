import type { MetadataRoute } from 'next';
import { siteUrl } from '@/lib/env';

/** The public site is the studio home, the contact page and the two legal pages. */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  return [
    { url: `${base}/`, priority: 1, changeFrequency: 'monthly' },
    { url: `${base}/contact`, priority: 0.5, changeFrequency: 'yearly' },
    { url: `${base}/privacy`, priority: 0.3, changeFrequency: 'yearly' },
    { url: `${base}/terms`, priority: 0.3, changeFrequency: 'yearly' },
  ];
}
