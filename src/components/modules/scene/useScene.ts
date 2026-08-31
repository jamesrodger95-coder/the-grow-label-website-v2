'use client';

import { useEffect, useRef } from 'react';
import { usePrefersReducedMotion } from '@/components/motion/useInView';
import { registerScene } from './ticker';

/**
 * THE MODULE SCENE HARNESS.
 *
 * One piece of plumbing behind every scroll-linked visual on the site. The
 * drawings are deliberately unalike; only the machinery is shared.
 *
 * How it drives, and why:
 *
 *   - There is NO scroll listener anywhere on this site. Scroll events
 *     coalesce under momentum and are dispatched after the compositor has
 *     already moved the page, so a listener-driven scene is always chasing the
 *     scrollbar. Position is read at paint time instead, which is why
 *     trackpad, wheel and touch momentum all scrub identically.
 *
 *   - Every scene shares ONE rAF loop and ONE IntersectionObserver, in
 *     `ticker.ts`. The loop reads every scene's rect in one pass and only then
 *     lets any scene write. Per-scene loops that read and wrote in turn forced
 *     a layout between each pair; batching removes that entirely.
 *
 *   - The draw callback mutates DOM directly and must never setState. A React
 *     render per frame is the other half of why scroll scenes stutter.
 *
 *   - Only `transform` and `opacity` may be written. Both are compositor
 *     properties, so a frame costs no layout and no paint. Writing `x`, `y`,
 *     `width` or `height` on an SVG element forces geometry recalculation on
 *     the main thread every frame.
 *
 * Contract with the caller: the scene's markup must already be in its FINAL
 * state when it renders, so a blocked bundle or a reduced-motion preference
 * leaves a finished picture rather than an empty frame.
 */

export type SceneDraw = (
  /** Scroll progress across the scene's travel window, 0 to 1. */
  p: number,
  /** Seconds since the scene became visible. For ambient loops only. */
  t: number
) => void;

export type SceneOptions = {
  /** Keep drawing after progress reaches 1, for a slow ambient cycle. */
  ambient?: boolean;
  /**
   * Where in the viewport progress starts and ends, as fractions of viewport
   * height measured against the element's top edge.
   *
   * The window closes at 45% rather than a third of the way up: a tall scene
   * panel whose progress only completed at 0.34 finished with its own foot
   * already off the bottom of the screen, so the last beat was reliably
   * missed.
   */
  from?: number;
  to?: number;
};

/**
 * Maps a sub-range of overall progress to its own 0..1, so a scene can be
 * written as a sequence of beats: `seg(p, 0.3, 0.6)` is 0 before 0.3, 1 after
 * 0.6, and scrubs in between.
 */
export const seg = (p: number, start: number, end: number) => {
  const v = (p - start) / (end - start || 1);
  return v < 0 ? 0 : v > 1 ? 1 : v;
};

export function useScene<T extends HTMLElement>(draw: SceneDraw, options: SceneOptions = {}) {
  const { ambient = false, from = 0.95, to = 0.45 } = options;
  const hostRef = useRef<T | null>(null);
  const drawRef = useRef(draw);
  useEffect(() => {
    drawRef.current = draw;
  });
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    // Reduced motion: paint the finished state once and never register.
    if (reduced) {
      drawRef.current(1, 0);
      return;
    }

    return registerScene({
      host,
      from,
      to,
      ambient,
      draw: (p, t) => drawRef.current(p, t),
      p: 0,
      offsetTop: 0,
      visible: false,
      started: 0,
      settled: false,
    });
  }, [reduced, ambient, from, to]);

  return hostRef;
}
