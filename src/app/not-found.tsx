import type { Metadata } from 'next';
import { ActionLink } from '@/components/primitives';

export const metadata: Metadata = {
  title: 'Page not found',
  description: 'That page does not exist.',
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <section className="surface--black on-dark">
      <div className="shell nf">
        <p className="label label--accent" style={{ marginBottom: 24 }}>
          Error 404
        </p>
        <h1 className="display d2" style={{ maxWidth: '16ch', marginBottom: 24 }}>
          That page does not exist. <em>The studio does.</em>
        </h1>
        <p className="lead" style={{ marginBottom: 40 }}>
          The address you followed is not a page on this site.
        </p>
        <div>
          <ActionLink href="/">Back to The Grow Label</ActionLink>
        </div>
      </div>
    </section>
  );
}
