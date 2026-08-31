'use client';

/**
 * THE SHARED SCENE TICKER.
 *
 * One requestAnimationFrame loop for every scroll-linked scene on the page,
 * and a strict read-then-write order inside it.
 *
 * Why this exists, from the profile that produced it:
 *
 *   Each scene used to own its own rAF loop, and each loop read its host
 *   element's rect and then immediately wrote styles. With more than one loop
 *   running, and with the navigation reading `window.scrollY` on the same
 *   frame, the browser was forced to re-run layout between every read and the
 *   write that preceded it. A full homepage scroll at 4x CPU throttling spent
 *   16.7 seconds in forced synchronous layout in the nav handler and a further
 *   4.5 seconds across the scene loops.
 *
 *   Batching fixes the scene half of that. Every registered scene's rect is
 *   read first, in one pass, while the layout is clean. Only then does any
 *   scene write. One layout per frame instead of one per scene, and no
 *   interleaving at all.
 *
 * The loop also stops completely when no scene is on screen, rather than
 * idling. Nothing here runs when there is nothing to draw.
 */

export type SceneEntry = {
  host: HTMLElement;
  from: number;
  to: number;
  ambient: boolean;
  draw: (p: number, t: number) => void;
  /** Filled during the read pass, consumed during the write pass. */
  p: number;
  visible: boolean;
  started: number;
  settled: boolean;
  /** Distance from the top of the document, cached. See `measure()`. */
  offsetTop: number;
};

const scenes = new Set<SceneEntry>();
let raf = 0;
let running = false;
let viewportH = 0;

const clamp = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

/**
 * Cache every scene's position in the document.
 *
 * Called on registration, on resize, and once the webfont has settled. NOT
 * called per frame, which is the whole point: `getBoundingClientRect()` in a
 * frame callback, after any style has been written, forces a synchronous
 * layout of everything above the element. A profiled homepage scroll spent
 * 8.8 seconds doing exactly that.
 *
 * Nothing this site animates changes layout -- entrances are opacity and
 * transform, scenes are transform and opacity -- so a position measured once
 * stays correct until the viewport itself changes.
 */
function measure() {
  viewportH = window.innerHeight || 1;
  const scrollY = window.scrollY;
  for (const scene of scenes) {
    scene.offsetTop = scene.host.getBoundingClientRect().top + scrollY;
  }
}

function frame(now: number) {
  raf = 0;

  /* ---- PASS 1: read. One cheap scroll read, no layout. ------------------
     `window.scrollY` is the scroll offset, not a geometry query, so it does
     not need layout to be clean the way a rect does. Combined with the cached
     offsets above, the whole read pass costs one property access. */
  const scrollY = window.scrollY;
  const vh = viewportH || window.innerHeight || 1;
  let active = 0;
  for (const scene of scenes) {
    if (!scene.visible) continue;
    const top = scene.offsetTop - scrollY;
    const span = vh * scene.from - vh * scene.to;
    scene.p = clamp((vh * scene.from - top) / (span || 1));
    active += 1;
  }

  /* ---- PASS 2: write. Layout is not read again this frame. ------------- */
  for (const scene of scenes) {
    if (!scene.visible) continue;
    if (!scene.started) scene.started = now;

    // A settled, non-ambient scene has nothing left to say. Draw the final
    // frame once, then skip it until progress can change again. The previous
    // version kept a heartbeat running for these, which cost 1.7 seconds of
    // main thread on a throttled homepage scroll to discover nothing.
    const atRest = scene.p === 0 || scene.p === 1;
    if (!scene.ambient && atRest && scene.settled) continue;

    scene.draw(scene.p, (now - scene.started) / 1000);
    scene.settled = !scene.ambient && atRest;
  }

  if (active > 0) raf = requestAnimationFrame(frame);
  else running = false;
}

function wake() {
  if (running) return;
  running = true;
  if (!raf) raf = requestAnimationFrame(frame);
}

/**
 * One IntersectionObserver for every scene on the page, rather than one each.
 * A scene that leaves the viewport is marked invisible and stops being read
 * or drawn; when the last one leaves, the loop shuts down entirely.
 */
let observer: IntersectionObserver | null = null;
const byHost = new WeakMap<Element, SceneEntry>();

function ensureObserver() {
  if (observer || typeof IntersectionObserver === 'undefined') return observer;
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const scene = byHost.get(entry.target);
        if (!scene) continue;
        scene.visible = entry.isIntersecting;
        if (entry.isIntersecting) {
          scene.started = 0;
          scene.settled = false;
        }
      }
      if ([...scenes].some((s) => s.visible)) wake();
    },
    // A margin either side, so a scene is already live before its first pixel
    // arrives and there is nothing to catch up on.
    { rootMargin: '15% 0px 15% 0px' }
  );
  return observer;
}

/** Re-measure on anything that can move a scene, never during a frame. */
let listening = false;
let resizeTimer = 0;
function onResize() {
  clearTimeout(resizeTimer);
  resizeTimer = window.setTimeout(measure, 120);
}
function startListening() {
  if (listening) return;
  listening = true;
  window.addEventListener('resize', onResize, { passive: true });
  // A webfont swapping in reflows text and moves everything below it.
  document.fonts?.ready.then(measure).catch(() => {});
}
function stopListening() {
  if (!listening) return;
  listening = false;
  window.removeEventListener('resize', onResize);
  clearTimeout(resizeTimer);
}

export function registerScene(entry: SceneEntry): () => void {
  scenes.add(entry);
  byHost.set(entry.host, entry);
  startListening();
  // Measure after the current paint, so the entry is measured against a
  // settled layout rather than mid-hydration.
  requestAnimationFrame(measure);
  const io = ensureObserver();
  io?.observe(entry.host);
  return () => {
    io?.unobserve(entry.host);
    byHost.delete(entry.host);
    scenes.delete(entry);
    if (scenes.size === 0) {
      stopListening();
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      running = false;
    }
  };
}

/** Exposed for the profiler and for tests. */
export function sceneCount() {
  return scenes.size;
}
