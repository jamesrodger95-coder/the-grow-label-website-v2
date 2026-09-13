import Link from 'next/link';
import { Logo } from '@/components/layout/Logo';
import { NAV_GROUPS, SITE } from '@/content/site';
import { bookingUrl, dashboardUrl } from '@/lib/env';

export function SiteFooter() {
  const year = new Date().getFullYear();
  const dashboard = dashboardUrl();
  const booking = bookingUrl();

  return (
    <footer className="foot on-dark surface--black">
      <div className="shell">
        <div className="foot__grid">
          <div className="foot__brand">
            <p className="logo logo--on-dark">
              <Logo tone="light" />
            </p>
            <p className="micro" style={{ maxWidth: '32ch' }}>
              {SITE.shortDescription}
            </p>
            {/* Deliberately not a `tlink`. The footer is the one region of the
                site with no motion in it at all — no entrance, no drawn
                underline — so the only thing that changes here is colour. */}
            {booking ? (
              <a className="foot__cta" href={booking} rel="noopener noreferrer" target="_blank">
                Book a call <span aria-hidden="true">&rarr;</span>
              </a>
            ) : null}
          </div>

          {NAV_GROUPS.filter((g) => g.id !== 'legal').map((group) => (
            <nav className="foot__nav" key={group.id} aria-label={group.label}>
              <p className="label" style={{ marginBottom: 6 }}>
                {group.label}
              </p>
              {group.links.map((link) => (
                <Link key={link.href} href={link.href}>
                  {link.label}
                </Link>
              ))}
              {group.id === 'company' && dashboard ? (
                <a href={dashboard} rel="noopener noreferrer" target="_blank">
                  Client sign in
                </a>
              ) : null}
            </nav>
          ))}
        </div>

        <div className="foot__base">
          <span className="micro">
            &copy; {year} {SITE.name}
          </span>
          <span className="micro">
            No client, patient or clinical data appears on this website.
          </span>
        </div>

        {/* Fine print. The last thing on the page, deliberately quiet: these
            are documents a reader goes looking for rather than ones the site
            offers. Small is the point — but still legible, still a real tap
            target, and still the same on both grounds, because a legal
            document that cannot be reached is a different problem from one
            that is not advertised. */}
        <nav className="foot__fine" aria-label="Legal">
          <Link href="/privacy">Privacy</Link>
          <span className="foot__finesep" aria-hidden="true">
            &middot;
          </span>
          <Link href="/terms">Terms</Link>
        </nav>
      </div>
    </footer>
  );
}
