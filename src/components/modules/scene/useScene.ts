'use client';

import { useEffect, useRef } from 'react';
import { usePrefersReducedMotion } from '@/components/motion/useInView';

/**
 * THE MODULE SCENE HARNESS.
 *
 * One piece of plumbing behind all four module visuals. The four treatments
 * are deliberately unalike; only the machinery below is shared.
 *
 * How it drives, and why:
 *
 *   - There is NO scroll listener. A requestAnimationFrame loop runs only
 *     while the host element intersects the viewport, and reads the element's
 *     own rect each frame. Scroll events fire at unpredictable rates, coalesce
 *     under momentum and arrive after the compositor has already moved the
 *     page, which is what makes listener-driven scenes feel like they are
 *     chasing the scrollbar. Reading position at paint time instead means the
 *     scene is always exactly where the page is, so trackpad, wheel and touch
 *     momentum all scrub identically.
 *
 *   - The draw callback mutates DOM directly. It is never allowed to setState.
 *     A React render per frame is the other half of why scroll scenes stutter.
 *
 *   - Only `transform` and `opacity` may be written by a draw callback. Both
 *     are compositor properties, so a frame costs no layout and no paint.
 *     Writing `x`, `y`, `width` or `height` on an SVG element forces geometry
 *     recalculation on the main thread every frame; the scenes here place
 *     elements once and move them with transforms afterwards.
 *
 * Contract with the caller: the scene's markup must already be in its FINAL
 * state when it renders. The harness only ever adds motion to something that
 * is already complete and correct, so a blocked bundle or a reduced-motion
 * preference leaves a finished picture rather than an empty frame.
 */

export type SceneDraw = (
  /** Scroll progress across the scene's travel window, 0 to 1. */
  p: number,
  /** Seconds since the scene became visible. For ambient loops only. */
  t: number
) => void;

export type SceneOptions = {
  /**
   * Keep the loop running after progress reaches 1, so a scene can carry a
   * slow ambient cycle. Off by default: most scenes should settle and stop.
   */
  ambient?: boolean;
  /**
   * Where in the viewport progress starts and ends, as fractions of viewport
   * height measured against the element's top edge. The defaults give the
   * scene most of a screen of travel, which is enough to read as scrubbing
   * without demanding a long scroll.
   */
  from?: number;
  to?: number;
};

const clamp = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

/**
 * Maps a sub-range of overall progress to its own 0..1, so a scene can be
 * written as a sequence of beats: `seg(p, 0.3, 0.6)` is 0 before 0.3, 1 after
 * 0.6, and scrubs in between.
 */
export const seg = (p: number, start: number, end: number) =>
  clamp((p - start) / (end - start || 1));

export function useScene<T extends HTMLElement>(draw: SceneDraw, options: SceneOptions = {}) {
  /**
   * The window closes at 45% rather than a third of the way up the viewport.
   * A tall scene panel whose progress only completed at 0.34 finished with
   * its own foot already off the bottom of the screen, so the last beat --
   * the backfill, the records returning -- was reliably missed. Completing
   * while the panel is still whole on screen is worth more than a longer
   * scrub.
   */
  const { ambient = false, from = 0.95, to = 0.45 } = options;
  const hostRef = useRef<T | null>(null);
  const drawRef = useRef(draw);
  // Kept current in an effect rather than during render: the loop below only
  // reads it from a frame callback, so it never needs to be fresh mid-render.
  useEffect(() => {
    drawRef.current = draw;
  });
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    // Reduced motion: paint the finished state once and never start a loop.
    if (reduced) {
      drawRef.current(1, 0);
      return;
    }

    let raf = 0;
    let visible = false;
    let started = 0;
    let settled = false;

    const frame = (now: number) => {
      raf = 0;
      if (!started) started = now;

      const rect = host.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const span = vh * from - vh * to;
      const p = clamp((vh * from - rect.top) / (span || 1));
      const t = (now - started) / 1000;

      drawRef.current(p, t);

      // A settled, non-ambient scene stops burning frames. It restarts the
      // moment progress could change again, because the loop is re-armed by
      // the observer rather than by a completion flag alone.
      settled = !ambient && (p === 1 || p === 0);
      if (visible && !settled) raf = requestAnimationFrame(frame);
      else if (visible && settled) raf = requestAnimationFrame(pollSettled);
    };

    // While settled, keep a cheap heartbeat that only reads the rect and wakes
    // the real loop if the scene has moved back into its travel window.
    let idle = 0;
    const pollSettled = (now: number) => {
      raf = 0;
      // Only every fourth frame. A settled scene that is still on screen has
      // nothing to do, and a layout read at 60Hz to discover that is the sort
      // of cost that does not show up in a profile as any one expensive thing.
      idle += 1;
      if (idle % 4 !== 0) {
        if (visible) raf = requestAnimationFrame(pollSettled);
        return;
      }
      const rect = host.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const span = vh * from - vh * to;
      const p = clamp((vh * from - rect.top) / (span || 1));
      if (p > 0 && p < 1) {
        raf = requestAnimationFrame(frame);
        return;
      }
      if (visible) raf = requestAnimationFrame(pollSettled);
      void now;
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        if (entry.isIntersecting && !visible) {
          visible = true;
          started = 0;
          if (!raf) raf = requestAnimationFrame(frame);
        } else if (!entry.isIntersecting && visible) {
          visible = false;
          if (raf) cancelAnimationFrame(raf);
          raf = 0;
          // Leave the scene in a complete state when it goes off screen, so
          // scrolling back to it never reveals a half-drawn frame.
          drawRef.current(rect0(host, from, to), 0);
        }
      },
      // A margin either side, so the loop is already running before the first
      // pixel of the scene is visible and there is nothing to catch up on.
      { rootMargin: '20% 0px 20% 0px' }
    );

    observer.observe(host);

    return () => {
      observer.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, [reduced, ambient, from, to]);

  return hostRef;
}

/** Progress right now, used when the loop is being torn down. */
function rect0(host: HTMLElement, from: number, to: number) {
  const rect = host.getBoundingClientRect();
  const vh = window.innerHeight || 1;
  const span = vh * from - vh * to;
  return clamp((vh * from - rect.top) / (span || 1));
}
