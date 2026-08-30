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
          <div>
            <p className="logo logo--on-dark" style={{ marginBottom: 16 }}>
              <Logo tone="light" />
            </p>
            <p className="micro" style={{ maxWidth: '34ch' }}>
              {SITE.shortDescription}
            </p>
            {booking ? (
              <p style={{ marginTop: 20 }}>
                <a className="tlink" href={booking} rel="noopener noreferrer" target="_blank">
                  Book a call <span aria-hidden="true">&rarr;</span>
                </a>
              </p>
            ) : null}
          </div>

          {NAV_GROUPS.filter((g) => g.id !== 'legal').map((group) => (
            <nav className="foot__nav" key={group.id} aria-label={group.label}>
              <p className="label" style={{ marginBottom: 10 }}>
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
          <nav aria-label="Legal" style={{ display: 'flex', gap: 20 }}>
            <Link className="micro" href="/privacy">
              Privacy
            </Link>
            <Link className="micro" href="/terms">
              Terms
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
