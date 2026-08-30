'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useId, useRef, useState, type CSSProperties } from 'react';
import { Logo } from '@/components/layout/Logo';
import { CTA, NAV_GROUPS, PRIMARY_NAV, SITE } from '@/content/site';

/**
 * Global navigation.
 *
 * A client component because it owns the drawer's open state and focus
 * management. The markup is complete on the server, so the nav is present and
 * usable in the initial HTML.
 */

/**
 * A link is current when the reader is on it or somewhere beneath it.
 *
 * Anchors on the homepage are never marked current: `aria-current="page"` would
 * be a lie on any other route, and on the homepage itself it would mark two
 * items at once.
 */
function isActive(pathname: string, href: string): boolean {
  if (href.includes('#')) return false;
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(`${href}/`);
}

const DRAWER_ENTRIES = NAV_GROUPS.flatMap((group) =>
  group.links.map((link) => ({ group: group.id, ...link }))
);

export function SiteNav({ dashboardHref }: { dashboardHref?: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [lastPathname, setLastPathname] = useState(pathname);

  // Close on any route change, including back and forward. Adjusting state
  // during render is React's documented way to reset on a changed input; an
  // effect would fire a second render pass, and deriving `open` from the route
  // it was opened on would silently reopen the drawer on a return visit to
  // that same route.
  if (lastPathname !== pathname) {
    setLastPathname(pathname);
    setOpen(false);
  }

  // The bar condenses once the page has moved: a light, purposeful nav state
  // change rather than a hide-on-scroll trick that fights the reader.
  const [condensed, setCondensed] = useState(false);
  useEffect(() => {
    let frame = 0;
    const read = () => {
      frame = 0;
      setCondensed(window.scrollY > 12);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(read);
    };
    read();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  const drawerId = useId();
  const toggleRef = useRef<HTMLButtonElement | null>(null);
  const drawerRef = useRef<HTMLDivElement | null>(null);

  const close = useCallback(() => setOpen(false), []);
  const toggle = useCallback(() => setOpen((current) => !current), []);

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
        setOpen(false);
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
    <header
      className="nav on-light"
      data-open={open ? 'true' : 'false'}
      data-condensed={condensed ? 'true' : 'false'}
    >
      <div className="shell">
        <div className="nav__bar">
          <Link className="logo" href="/" aria-label={`${SITE.name} — home`} onClick={close}>
            <Logo />
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
            <Link className="btn nav__cta" href={CTA.primary.href} onClick={close}>
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
        <div
          className="drawer on-light"
          id={drawerId}
          ref={drawerRef}
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
        >
          <div className="drawer__inner shell">
            <nav aria-label="All pages">
              {NAV_GROUPS.map((group) => (
                <div className="drawer__group" key={group.id}>
                  <div className="drawer__grouphead">
                    <span className="label">{group.label}</span>
                  </div>
                  {DRAWER_ENTRIES.filter((entry) => entry.group === group.id).map((entry, i) => (
                    <Link
                      key={entry.href}
                      className="drawer__link"
                      href={entry.href}
                      aria-current={isActive(pathname, entry.href) ? 'page' : undefined}
                      onClick={close}
                      style={{ '--i': i } as CSSProperties}
                    >
                      <span className="drawer__label">{entry.label}</span>
                      {entry.note ? <span className="drawer__note">{entry.note}</span> : null}
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
