'use client';

import { useEffect } from 'react';

/**
 * Enables motion for the whole document, once, after the first paint.
 *
 * Until this runs, every animated element renders in its final state (see
 * src/styles/motion.css). That ordering is deliberate: meaningful content never
 * waits on JavaScript, and a blocked or failed bundle leaves a complete page.
 */
export function MotionProvider() {
  useEffect(() => {
    const root = document.documentElement;
    // Two frames: one to let the browser paint the static page, one to let the
    // transition properties apply before any element flips to its start state.
    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        root.dataset.motion = 'on';
      });
    });
    return () => {
      cancelAnimationFrame(raf1);
      if (raf2) cancelAnimationFrame(raf2);
      delete root.dataset.motion;
    };
  }, []);

  return null;
}
