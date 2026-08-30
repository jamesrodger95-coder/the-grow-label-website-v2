'use client';

import { useEffect, useRef } from 'react';
import { usePrefersReducedMotion } from './useInView';

/**
 * Cursor proximity for the hero's signal marks.
 *
 * The only client code in the hero, and the smallest useful amount of it: one
 * rAF-throttled pointermove listener that writes a `--lift` custom property to
 * each mark. Renders nothing visible.
 *
 * It attaches only where it can do something — a fine pointer, motion not
 * reduced, and marks actually on screen — and detaches again when any of those
 * stops being true. Below 1080px the marks are `display: none`, so measuring
 * them every frame would be pure waste.
 */
export function PointerSignals() {
  const anchor = useRef<HTMLSpanElement | null>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const host = anchor.current?.parentElement;
    if (!host || reduced) return;

    const finePointer = window.matchMedia('(pointer: fine)');
    let frame = 0;
    let pending: { x: number; y: number } | null = null;
    let attached = false;

    const marks = Array.from(host.querySelectorAll<HTMLElement>('[data-mark]'));

    const clear = () => {
      for (const mark of marks) mark.style.setProperty('--lift', '0');
    };

    const apply = () => {
      frame = 0;
      const point = pending;
      if (!point) return;
      const reach = Math.max(220, host.getBoundingClientRect().width * 0.18);
      for (const mark of marks) {
        const box = mark.getBoundingClientRect();
        // Hidden marks have a zero-size box; skip rather than compute against it.
        if (box.width === 0 && box.height === 0) continue;
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

    const attach = () => {
      if (attached) return;
      attached = true;
      window.addEventListener('pointermove', onMove, { passive: true });
      document.addEventListener('pointerleave', clear);
    };

    const detach = () => {
      if (!attached) return;
      attached = false;
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerleave', clear);
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      clear();
    };

    // The marks are removed from the layout below the two-column hero, so track
    // their visibility rather than assuming the viewport never changes.
    const visible = new IntersectionObserver((entries) => {
      const onScreen = entries.some((entry) => entry.isIntersecting);
      if (onScreen && finePointer.matches) attach();
      else detach();
    });
    for (const mark of marks) visible.observe(mark);

    const onPointerChange = () => {
      if (finePointer.matches) return;
      detach();
    };
    finePointer.addEventListener('change', onPointerChange);

    return () => {
      finePointer.removeEventListener('change', onPointerChange);
      visible.disconnect();
      detach();
    };
  }, [reduced]);

  // A zero-size anchor so the effect can find its host without the parent
  // needing to become a client component.
  return <span ref={anchor} hidden />;
}
