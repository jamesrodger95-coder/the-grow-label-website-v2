'use client';

import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react';
import { usePrefersReducedMotion } from './useInView';

/**
 * Scroll-linked drift.
 *
 * Writes a `--py` custom property that the element's transform reads, so the
 * work stays on the compositor and never touches layout. The listener attaches
 * only while the element is on screen, is throttled to one animation frame, and
 * is skipped entirely under reduced motion and on coarse pointers — a phone is
 * both the least able to afford it and the least likely to show it well.
 */
export function Parallax({
  children,
  /** Pixels of travel across the full pass. Negative moves against the scroll. */
  distance = 60,
  className,
  style,
  as: Tag = 'div',
}: {
  children: ReactNode;
  distance?: number;
  className?: string;
  style?: CSSProperties;
  as?: 'div' | 'section' | 'span';
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;
    if (!window.matchMedia('(min-width: 900px)').matches) return;

    let frame = 0;
    let attached = false;

    const read = () => {
      frame = 0;
      const rect = el.getBoundingClientRect();
      const viewport = window.innerHeight;
      // -1 when the element is just below the fold, 1 when just above it.
      const progress =
        (rect.top + rect.height / 2 - viewport / 2) / (viewport / 2 + rect.height / 2);
      const clamped = Math.max(-1, Math.min(1, progress));
      el.style.setProperty('--py', `${(clamped * distance).toFixed(1)}px`);
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(read);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.some((entry) => entry.isIntersecting);
        if (visible && !attached) {
          attached = true;
          window.addEventListener('scroll', onScroll, { passive: true });
          read();
        } else if (!visible && attached) {
          attached = false;
          window.removeEventListener('scroll', onScroll);
        }
      },
      { rootMargin: '15% 0px 15% 0px' }
    );
    observer.observe(el);

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
      if (frame) cancelAnimationFrame(frame);
      el.style.removeProperty('--py');
    };
  }, [distance, reduced]);

  return (
    <Tag ref={ref} className={['m-parallax', className].filter(Boolean).join(' ')} style={style}>
      {children}
    </Tag>
  );
}
