'use client';

import { useEffect, useRef } from 'react';

/**
 * Cursor proximity for the hero's signal marks.
 *
 * The only client code in the hero, and the smallest useful amount of it: one
 * rAF-throttled pointermove listener that writes a `--lift` custom property to
 * each mark. Renders nothing.
 *
 * Skipped entirely on coarse pointers and under reduced motion, so touch
 * devices and readers who asked for less movement pay no runtime cost at all.
 */
export function PointerSignals() {
  const anchor = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const host = anchor.current?.parentElement;
    if (!host) return;
    if (!window.matchMedia('(pointer: fine)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const marks = Array.from(host.querySelectorAll<HTMLElement>('[data-mark]'));
    if (marks.length === 0) return;

    let frame = 0;
    let pending: { x: number; y: number } | null = null;

    const apply = () => {
      frame = 0;
      const point = pending;
      if (!point) return;
      const reach = Math.max(220, host.getBoundingClientRect().width * 0.18);
      for (const mark of marks) {
        const box = mark.getBoundingClientRect();
        const distance = Math.hypot(
          box.left + box.width / 2 - point.x,
          box.top + box.height / 2 - point.y
        );
        mark.style.setProperty('--lift', Math.max(0, 1 - distance / reach).toFixed(3));
      }
    };

    const onMove = (event: PointerEvent) => {
      pending = { x: event.clientX, y: event.clientY };
      if (!frame) frame = requestAnimationFrame(apply);
    };

    const clear = () => {
      for (const mark of marks) mark.style.setProperty('--lift', '0');
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerleave', clear);

    return () => {
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerleave', clear);
      if (frame) cancelAnimationFrame(frame);
      clear();
    };
  }, []);

  // A zero-size anchor so the effect can find its host without the parent
  // needing to become a client component.
  return <span ref={anchor} hidden />;
}
