import type { MetadataRoute } from 'next';
import { MODULE_SLUGS } from '@/content/modules';
import { INDUSTRIES } from '@/content/industries';
import { INSIGHTS } from '@/content/pages';
import { CASE_STUDIES } from '@/content/illustrative';
import { siteUrl } from '@/lib/env';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  const now = new Date();

  const entries: MetadataRoute.Sitemap = [
    { url: `${base}/`, priority: 1, changeFrequency: 'monthly' },
    { url: `${base}/platform`, priority: 0.9, changeFrequency: 'monthly' },
    { url: `${base}/modules`, priority: 0.9, changeFrequency: 'monthly' },
    { url: `${base}/contact`, priority: 0.9, changeFrequency: 'yearly' },
    { url: `${base}/calculator`, priority: 0.9, changeFrequency: 'monthly' },
    { url: `${base}/case-studies`, priority: 0.8, changeFrequency: 'monthly' },
    { url: `${base}/about`, priority: 0.7, changeFrequency: 'yearly' },
    { url: `${base}/insights`, priority: 0.7, changeFrequency: 'monthly' },
    { url: `${base}/privacy`, priority: 0.3, changeFrequency: 'yearly' },
    { url: `${base}/terms`, priority: 0.3, changeFrequency: 'yearly' },
  ];

  for (const slug of MODULE_SLUGS) {
    entries.push({ url: `${base}/modules/${slug}`, priority: 0.8, changeFrequency: 'monthly' });
  }
  for (const industry of INDUSTRIES) {
    entries.push({
      url: `${base}/industries/${industry.slug}`,
      priority: 0.8,
      changeFrequency: 'monthly',
    });
  }
  // Placeholder studies are noindex, so they are deliberately not listed here.
  // Each one joins the sitemap when its `illustrative` flag is cleared.
  for (const study of CASE_STUDIES.filter((s) => !s.illustrative)) {
    entries.push({
      url: `${base}/case-studies/${study.slug}`,
      priority: 0.7,
      changeFrequency: 'yearly',
    });
  }
  for (const insight of INSIGHTS) {
    entries.push({
      url: `${base}/insights/${insight.slug}`,
      priority: 0.6,
      changeFrequency: 'yearly',
      lastModified: new Date(insight.date),
    });
  }

  return entries.map((entry) => ({ lastModified: now, ...entry }));
}
