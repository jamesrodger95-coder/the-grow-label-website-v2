import type { Metadata } from 'next';
import { studioAccent } from '@/components/studio/fonts';
import { Showcase } from '@/components/studio/Showcase';
import {
  StudioBand,
  StudioFooter,
  StudioHeader,
  StudioHero,
  StudioMake,
  StudioProcess,
  StudioSample,
  StudioStatement,
  StudioWork,
} from '@/components/studio/Sections';
import { STUDIO_META } from '@/content/studio';
import { reelTiles, workItems } from '@/lib/studio-media';

/**
 * /AI: the content studio.
 *
 * Linked from the main site as "Design Studio" (the glowing nav item) and
 * reached from outreach. It brings its own header and footer; the site's are
 * withheld by SiteChrome. Static: the media on it is
 * read from public/ at build time, and the form's delivery state with it.
 */

export const metadata: Metadata = {
  title: { absolute: STUDIO_META.title },
  description: STUDIO_META.description,
  alternates: { canonical: '/AI' },
  openGraph: {
    type: 'website',
    url: '/AI',
    title: STUDIO_META.title,
    description: STUDIO_META.description,
  },
  twitter: {
    card: 'summary_large_image',
    title: STUDIO_META.title,
    description: STUDIO_META.description,
  },
};

export default function StudioPage() {
  const { tiles, live } = reelTiles();
  const items = workItems();

  return (
    <div className={`studio ${studioAccent.variable}`}>
      <StudioHeader />
      <StudioHero tiles={tiles} live={live} />
      <StudioBand />
      <StudioWork items={items} />
      <Showcase items={items} />
      <StudioStatement items={items} />
      <StudioMake items={items} />
      <StudioProcess />
      <StudioSample />
      <StudioFooter />
    </div>
  );
}
