'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useId, useRef, useState, type CSSProperties } from 'react';
import { CTA, NAV_GROUPS, PRIMARY_NAV, SITE } from '@/content/site';

/**
 * Global navigation.
 *
 * A client component because it owns the drawer's open state and focus
 * management. The markup is complete on the server, so the nav is present and
 * usable in the initial HTML.
 */

function Mark() {
  return (
    <svg className="nav__glyph" viewBox="0 0 15 15" aria-hidden="true" focusable="false">
      <rect x="0" y="0" width="15" height="3" fill="var(--gl-signal)" opacity="0.3" />
      <rect x="0" y="4" width="11" height="3" fill="var(--gl-signal)" opacity="0.55" />
      <rect x="0" y="8" width="9" height="3" fill="var(--gl-signal)" opacity="0.78" />
      <rect x="0" y="12" width="7" height="3" fill="var(--gl-signal)" />
    </svg>
  );
}

function isActive(pathname: string, href: string): boolean {
  if (href === '/') return pathname === '/';
  if (href.startsWith('/modules/')) return pathname.startsWith('/modules/');
  return pathname === href || pathname.startsWith(`${href}/`);
}

/** Flattened drawer links, numbered once so nothing is counted during render. */
const DRAWER_ENTRIES = NAV_GROUPS.flatMap((group) =>
  group.links.map((link) => ({ group: group.id, ...link }))
).map((link, i) => ({ ...link, ordinal: String(i + 1).padStart(2, '0') }));

export function SiteNav({ dashboardHref }: { dashboardHref?: string }) {
  const pathname = usePathname();
  // The drawer is open *for a particular route*. Navigating changes `pathname`,
  // which closes it during render — no effect, and no stale-open flash.
  const [openFor, setOpenFor] = useState<string | null>(null);
  const open = openFor === pathname;

  const drawerId = useId();
  const toggleRef = useRef<HTMLButtonElement | null>(null);
  const drawerRef = useRef<HTMLDivElement | null>(null);

  const close = useCallback(() => setOpenFor(null), []);
  const toggle = useCallback(
    () => setOpenFor((current) => (current === pathname ? null : pathname)),
    [pathname]
  );

  // Focus management, escape handling and scroll lock while the drawer is open.
  useEffect(() => {
    if (!open) return;
    const drawer = drawerRef.current;
    const toggleButton = toggleRef.current;
    const previouslyFocused = document.activeElement;

    drawer?.querySelector<HTMLElement>('a, button')?.focus();

    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setOpenFor(null);
        return;
      }
      if (event.key !== 'Tab' || !drawer) return;

      const focusable = Array.from(
        drawer.querySelectorAll<HTMLElement>('a[href], button:not([disabled])')
      ).filter((el) => el.offsetParent !== null);
      const cycle = toggleButton ? [toggleButton, ...focusable] : focusable;
      if (cycle.length === 0) return;

      const first = cycle[0]!;
      const last = cycle[cycle.length - 1]!;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = overflow;
      // Only pull focus back if it was the toggle that opened the drawer;
      // a route change moves focus itself and must not be fought.
      if (previouslyFocused === toggleButton) toggleButton?.focus();
    };
  }, [open]);

  return (
    <header className="nav on-dark" data-open={open ? 'true' : 'false'}>
      <div className="shell">
        <div className="nav__bar">
          <Link className="nav__mark" href="/" aria-label={`${SITE.name} — home`}>
            <Mark />
            {SITE.name}
          </Link>

          <nav className="nav__links" aria-label="Primary">
            {PRIMARY_NAV.map((link) => (
              <Link
                key={link.href}
                className="nav__link"
                href={link.href}
                aria-current={isActive(pathname, link.href) ? 'page' : undefined}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="nav__actions">
            {dashboardHref ? (
              <a
                className="nav__link"
                href={dashboardHref}
                rel="noopener noreferrer"
                target="_blank"
              >
                Client sign in
              </a>
            ) : null}
            <Link className="btn nav__cta" href={CTA.primary.href}>
              {CTA.primary.label}
              <span className="btn__arrow" aria-hidden="true">
                &rarr;
              </span>
            </Link>
            <button
              ref={toggleRef}
              type="button"
              className="nav__toggle"
              aria-expanded={open}
              aria-controls={drawerId}
              onClick={toggle}
            >
              {open ? 'Close' : 'Menu'}
              <span className="nav__burger" aria-hidden="true">
                <i />
                <i />
              </span>
            </button>
          </div>
        </div>
      </div>

      {open ? (
        <div className="drawer on-dark" id={drawerId} ref={drawerRef}>
          <div className="drawer__inner shell">
            <nav aria-label="All pages">
              {NAV_GROUPS.map((group) => (
                <div className="drawer__group" key={group.id}>
                  <div className="drawer__grouphead">
                    <span className="label">{group.label}</span>
                  </div>
                  {DRAWER_ENTRIES.filter((entry) => entry.group === group.id).map((entry) => (
                    <Link
                      key={entry.href}
                      className="drawer__link"
                      href={entry.href}
                      aria-current={isActive(pathname, entry.href) ? 'page' : undefined}
                      onClick={close}
                      style={{ '--i': Number(entry.ordinal) } as CSSProperties}
                    >
                      {entry.label}
                      {/* Decorative ordinal: keep it out of the link name. */}
                      <span aria-hidden="true">{entry.ordinal}</span>
                    </Link>
                  ))}
                </div>
              ))}
            </nav>
            <div className="drawer__foot">
              <Link
                className="btn"
                href={CTA.primary.href}
                onClick={close}
                style={{ justifyContent: 'space-between' }}
              >
                {CTA.primary.longLabel}
                <span className="btn__arrow" aria-hidden="true">
                  &rarr;
                </span>
              </Link>
              {dashboardHref ? (
                <a
                  className="btn btn--ghost"
                  href={dashboardHref}
                  rel="noopener noreferrer"
                  target="_blank"
                  style={{ justifyContent: 'space-between' }}
                >
                  Client sign in
                  <span className="btn__arrow" aria-hidden="true">
                    &rarr;
                  </span>
                </a>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
