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

  /**
   * Entrances: one immediate pass, then one shared observer.
   *
   * The immediate pass is the important half. WebKit does not reliably deliver
   * an IntersectionObserver callback for elements that were ALREADY on screen
   * when the observer was created, so the hero's entrances sat at opacity 0 in
   * Safari for the life of the page. Marking everything above the fold line
   * synchronously, before observing anything, removes that class of failure
   * entirely and costs one layout read at startup.
   *
   * The observer then handles everything below the fold, which is the case it
   * is actually good at. One observer for the whole page, and each element is
   * unobserved once it has fired, because entrances are one-shot.
   */
  useEffect(() => {
    const els = [...document.querySelectorAll<HTMLElement>('[data-reveal]')];
    if (!els.length) return;

    const mark = (el: HTMLElement) => {
      el.dataset.inview = 'true';
      for (const line of el.querySelectorAll<HTMLElement>('.m-line')) {
        line.dataset.inview = 'true';
      }
    };

    const fold = window.innerHeight * 0.88;
    const rest: HTMLElement[] = [];
    for (const el of els) {
      if (el.getBoundingClientRect().top < fold) mark(el);
      else rest.push(el);
    }

    if (!rest.length || typeof IntersectionObserver === 'undefined') {
      for (const el of rest) mark(el);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          mark(entry.target as HTMLElement);
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.01 }
    );
    for (const el of rest) observer.observe(el);
    return () => observer.disconnect();
  }, []);

  /**
   * Pause ambient loops that are nowhere near the viewport.
   *
   * A CSS animation does not stop just because its element has been scrolled
   * away; it keeps having its styles recalculated for the life of the page.
   * The homepage carries several ambient loops well below the fold, and a
   * profiled scroll found 36 of them running off screen at any moment.
   *
   * One observer for all of them, toggling a single attribute that CSS reads
   * as `animation-play-state: paused`. `content-visibility: auto` would do
   * this for free, and was tried, but it makes the scroll scenes' rect reads
   * dramatically more expensive; the note in sections.css records the
   * measurements.
   */
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;
    const targets = document.querySelectorAll<HTMLElement>('[data-ambient]');
    if (!targets.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          (entry.target as HTMLElement).dataset.ambient = entry.isIntersecting ? 'on' : 'off';
        }
      },
      { rootMargin: '10% 0px 10% 0px' }
    );
    for (const el of targets) observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return null;
}
