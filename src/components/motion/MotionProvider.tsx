'use client';

import { useEffect } from 'react';

/**
 * Enables motion for the whole document, once, after the first paint.
 *
 * Until this runs, every animated element renders in its final state (see
 * src/styles/motion.css). That ordering is deliberate: meaningful content never
 * waits on JavaScript, and a blocked or failed bundle leaves a complete page.
 *
 * Motion is only enabled where IntersectionObserver exists, because that is
 * what moves an element from its start state to its end state. Without it, the
 * page keeps the authored final state rather than animating to nothing.
 */
export function MotionProvider() {
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;

    const root = document.documentElement;
    // Two frames: one to let the browser paint the static page, one to let the
    // transition properties apply before any element flips to its start state.
    let second = 0;
    const first = requestAnimationFrame(() => {
      second = requestAnimationFrame(() => {
        root.dataset.motion = 'on';
      });
    });

    return () => {
      cancelAnimationFrame(first);
      if (second) cancelAnimationFrame(second);
      delete root.dataset.motion;
    };
  }, []);

  return null;
}
