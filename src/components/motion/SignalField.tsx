'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { usePrefersReducedMotion } from './useInView';

/**
 * The hero's scattered revenue signals.
 *
 * Purely decorative (aria-hidden) and cheap: seven absolutely positioned
 * hairlines whose entrance is a CSS transition. On desktop with a fine pointer
 * the marks nearest the cursor lift slightly — one rAF-throttled pointermove
 * listener, transform and opacity only, torn down on unmount.
 */

type Mark = {
  /** Percentage position within the field. */
  left: number;
  top: number;
  width: number;
  opacity: number;
  /** Horizontal offset the mark starts from before it consolidates. */
  drift: number;
};

/**
 * Positions sit in the corridor between the headline and the capacity column,
 * so the marks never collide with either. Widths and opacities vary because
 * the point is that real signals arrive at different strengths.
 */
const MARKS: Mark[] = [
  { left: 51, top: 14, width: 46, opacity: 0.3, drift: -30 },
  { left: 60, top: 24, width: 62, opacity: 0.44, drift: 34 },
  { left: 54, top: 35, width: 38, opacity: 0.34, drift: -20 },
  { left: 64, top: 45, width: 70, opacity: 0.58, drift: 26 },
  { left: 56, top: 55, width: 50, opacity: 0.38, drift: -34 },
  { left: 66, top: 65, width: 42, opacity: 0.6, drift: 20 },
  { left: 58, top: 76, width: 58, opacity: 0.32, drift: -26 },
  { left: 50, top: 86, width: 34, opacity: 0.26, drift: 22 },
];

export function SignalField() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(false);
  const reduced = usePrefersReducedMotion();

  // Reveal on mount (the hero is above the fold, so there is nothing to observe).
  useEffect(() => {
    const raf = requestAnimationFrame(() => setActive(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  // Cursor proximity — fine pointers only, and never under reduced motion.
  useEffect(() => {
    const host = ref.current;
    if (!host || reduced) return;
    if (!window.matchMedia('(pointer: fine)').matches) return;

    const marks = Array.from(host.querySelectorAll<HTMLElement>('[data-mark]'));
    let frame = 0;
    let pending: { x: number; y: number } | null = null;

    const apply = () => {
      frame = 0;
      const point = pending;
      if (!point) return;
      const box = host.getBoundingClientRect();
      for (const mark of marks) {
        const m = mark.getBoundingClientRect();
        const dx = m.left + m.width / 2 - point.x;
        const dy = m.top + m.height / 2 - point.y;
        const distance = Math.hypot(dx, dy);
        const reach = Math.max(220, box.width * 0.18);
        const proximity = Math.max(0, 1 - distance / reach);
        mark.style.setProperty('--lift', proximity.toFixed(3));
      }
    };

    const onMove = (event: PointerEvent) => {
      pending = { x: event.clientX, y: event.clientY };
      if (!frame) frame = requestAnimationFrame(apply);
    };

    const onLeave = () => {
      for (const mark of marks) mark.style.setProperty('--lift', '0');
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerleave', onLeave);
    return () => {
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerleave', onLeave);
      if (frame) cancelAnimationFrame(frame);
      onLeave();
    };
  }, [reduced]);

  return (
    <div className="signalfield" ref={ref} data-inview={active ? 'true' : 'false'} aria-hidden="true">
      <div className="signalfield__grid" />
      {MARKS.map((mark, i) => (
        <span
          key={`${mark.left}-${mark.top}`}
          data-mark=""
          className="signalfield__mark"
          style={
            {
              left: `${mark.left}%`,
              top: `${mark.top}%`,
              width: mark.width,
              '--o': mark.opacity,
              '--dx': active || reduced ? '0px' : `${mark.drift}px`,
              '--i': i,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
