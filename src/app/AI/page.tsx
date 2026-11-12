import type { Metadata } from 'next';
import { studioAccent } from '@/components/studio/fonts';
import { Showcase } from '@/components/studio/Showcase';
import {
  StudioFooter,
  StudioGetCards,
  StudioHeader,
  StudioHero,
  StudioProcess,
  StudioSample,
  StudioWork,
} from '@/components/studio/Sections';
import { STUDIO_META, WORK_SHOWN } from '@/content/studio';
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
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    url: '/',
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
  // The Selected work grid shows the curated pieces, in their own order.
  const shown = WORK_SHOWN.map((id) => items.find((w) => w.id === id)).filter(
    (w): w is (typeof items)[number] => Boolean(w)
  );

  return (
    <div className={`studio ${studioAccent.variable}`}>
      <StudioHeader />
      <StudioHero tiles={tiles} live={live} />
      <StudioWork items={shown} />
      <Showcase items={items}>
        <StudioGetCards items={shown} />
      </Showcase>
      <StudioProcess />
      <StudioSample />
      <StudioFooter />
    </div>
  );
}
