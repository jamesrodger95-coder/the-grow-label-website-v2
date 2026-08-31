'use client';

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';

/**
 * ONE SHARED OBSERVER PER ROOT MARGIN, not one per element.
 *
 * The homepage renders enough `Reveal`s to have created 66 separate
 * IntersectionObserver instances covering 114 targets. Each instance carries
 * its own callback, its own registration in the browser's intersection
 * bookkeeping, and its own slice of the work the compositor does after every
 * scroll. They all wanted the same question answered about different elements.
 *
 * This keeps one observer per distinct root margin and hands each element a
 * callback through a WeakMap. Registration is one `observe` call; the element
 * is unobserved the moment it has been seen, because these are one-shot
 * entrance animations and nothing needs watching afterwards.
 */
type Cb = () => void;

const registries = new Map<string, { io: IntersectionObserver; targets: WeakMap<Element, Cb> }>();

function registryFor(rootMargin: string) {
  let entry = registries.get(rootMargin);
  if (entry) return entry;
  const targets = new WeakMap<Element, Cb>();
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        const cb = targets.get(e.target);
        if (cb) {
          targets.delete(e.target);
          io.unobserve(e.target);
          cb();
        }
      }
    },
    { rootMargin, threshold: 0.01 }
  );
  entry = { io, targets };
  registries.set(rootMargin, entry);
  return entry;
}

/**
 * One-shot viewport observer.
 *
 * IntersectionObserver support is not checked here: MotionProvider only enables
 * motion when it is available, so without it every element simply stays in its
 * authored final state and this hook's result is never consulted.
 */
export function useInView<T extends HTMLElement>(rootMargin = '0px 0px -12% 0px') {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;

    const { io, targets } = registryFor(rootMargin);
    targets.set(el, () => setInView(true));
    io.observe(el);

    return () => {
      targets.delete(el);
      io.unobserve(el);
    };
  }, [rootMargin]);

  return { ref, inView } as const;
}

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

function subscribeToReducedMotion(onChange: () => void): () => void {
  if (typeof window === 'undefined' || !window.matchMedia) return () => {};
  const mq = window.matchMedia(REDUCED_MOTION_QUERY);
  mq.addEventListener('change', onChange);
  return () => mq.removeEventListener('change', onChange);
}

function getReducedMotion(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

/**
 * Reads the reduced-motion preference and stays current with it.
 *
 * `useSyncExternalStore` is the right shape for a media query: it subscribes
 * without an effect, so there is no synchronous setState on mount and no extra
 * render pass, and the server snapshot keeps hydration consistent.
 */
export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(subscribeToReducedMotion, getReducedMotion, () => false);
}

/** True once the component has mounted on the client. */
export function useHasMounted(): boolean {
  const subscribe = useCallback(() => () => {}, []);
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );
}
