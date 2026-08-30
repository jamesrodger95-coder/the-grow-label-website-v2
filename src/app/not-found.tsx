import type { Metadata } from 'next';
import { ActionLink, TextLink } from '@/components/primitives';
import { NAV_GROUPS } from '@/content/site';

export const metadata: Metadata = {
  title: 'Page not found',
  description: 'That page does not exist. Everything on the site is listed here.',
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <section className="surface--void on-dark">
      <div className="shell nf">
        <p className="label label--accent" style={{ marginBottom: 24 }}>
          Error 404
        </p>
        <h1 className="display d2" style={{ maxWidth: '16ch', marginBottom: 24 }}>
          That page does not exist. <em>Everything else does.</em>
        </h1>
        <p className="lead" style={{ marginBottom: 40 }}>
          The address you followed is not a route on this site. The full index is below.
        </p>

        <div style={{ marginBottom: 56 }}>
          <ActionLink href="/">Back to the homepage</ActionLink>
        </div>

        <div className="kv" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))' }}>
          {NAV_GROUPS.map((group) => (
            <div className="kv__cell" key={group.id} style={{ background: 'var(--gl-void)' }}>
              <p className="label kv__key">{group.label}</p>
              <ul style={{ display: 'grid', gap: 8 }}>
                {group.links.map((link) => (
                  <li key={link.href}>
                    <TextLink href={link.href}>{link.label}</TextLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
