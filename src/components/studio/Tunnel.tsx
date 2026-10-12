'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { usePrefersReducedMotion } from '@/components/motion/useInView';
import { useScene } from '@/components/modules/scene/useScene';
import type { ReelTile } from '@/lib/studio-media';

/**
 * The hero: a curved tunnel of small videos.
 *
 * Three rows of clips sit on the inside of a cylinder, seen from near its
 * front edge, so the far wall is small at the centre of the screen and the
 * sides swell towards the edges. The cylinder turns slowly; the clips flow in
 * from one side, shrink past the middle and grow out of the other.
 *
 * It is CSS 3D, not WebGL: every tile is an element with a transform, which
 * keeps the videos as real <video> elements with posters, keeps the page
 * light, and leaves a complete, static tunnel when scripts are blocked (the
 * starting angles are rendered on the server).
 *
 * Motion, all through the site's shared scene ticker (`useScene`), so there is
 * no scroll listener and nothing runs while the hero is off screen:
 *
 *   - a slow turn, which spins up into place when the hero first arrives;
 *   - a little faster while the page is being scrolled, settling afterwards;
 *   - the camera leans towards the pointer, and pushes in as the hero leaves;
 *   - drag sideways to turn it by hand (vertical drags still scroll).
 *
 * Only `transform` and `opacity` are written per frame. Playback is decided
 * a few times a second, not per frame: clips facing the viewer may play, up
 * to a cap, and everything else is paused. Reduced motion and save-data start
 * it still, and the pause control stops all of it.
 */

const ROWS = 3;
/** Degrees per second at rest, and the per-row multipliers. */
const BASE_SPEED = 3.2;
const ROW_SPEED = [1, 0.82, 1.14];
/** Beyond this angle a tile is off the edge of the screen. */
const VISIBLE = 98;
const MIN_PERIOD = 204;
const PLAY_CAP = { wide: 24, narrow: 8 };
/** The light tones only: a reserved frame should read as a frame, not a hole. */
const SLOT_TONES = [0, 1, 2, 3, 5];

type Geometry = { W: number; th: number; g: number; R: number; P: number; c: number };

/** Kept in step with the `.tunnel__stage` rules in sections.css. */
function geometry(W: number): Geometry {
  const narrow = W < 720;
  const th = narrow
    ? Math.min(120, Math.max(60, W * 0.24))
    : Math.min(176, Math.max(70, W * 0.105));
  const R = W * 0.62;
  const P = W * (narrow ? 0.8 : 0.5);
  // Places the camera so the tunnel's sides meet the edges of the screen.
  const c = (2 * R * P) / W - P;
  return { W, th, g: th * 0.1, R, P, c };
}

/** Each tile's resting angle, in degrees, centred on the row. */
function layout(rows: { ratio: number; feature?: number }[][], g: Geometry) {
  return rows.map((row) => {
    const arcs = row.map((t) => ((t.ratio * g.th * scaleOf(t) + g.g) / g.R) * (180 / Math.PI));
    const total = arcs.reduce((a, b) => a + b, 0);
    const period = Math.max(total, MIN_PERIOD);
    const spacing = period / total;
    let at = 0;
    const angles = arcs.map((arc) => {
      const centre = at + (arc * spacing) / 2;
      at += arc * spacing;
      return centre - period / 2;
    });
    return { angles, period };
  });
}

/** Wraps an angle into [-period/2, period/2). */
function wrap(a: number, period: number): number {
  const h = period / 2;
  return ((((a + h) % period) + period) % period) - h;
}

/** Far tiles fade a little into the page, like distance. */
function fog(a: number): number {
  const abs = Math.abs(a);
  if (abs > VISIBLE) return 0;
  const edge = abs > VISIBLE - 6 ? (VISIBLE - abs) / 6 : 1;
  return Math.min(1, 0.86 + abs / 400) * edge;
}

function saveData(): boolean {
  if (typeof navigator === 'undefined') return false;
  return Boolean(
    (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData
  );
}

/**
 * Places the featured tiles (see FEATURED in studio-media) either side of
 * the middle of the row, which is where a row sits front and centre once the
 * spin-in settles. They are dealt across the rows, a share each.
 */
/**
 * Where each featured piece in a row sits, as an angle from the row's centre:
 * the lead piece at about 60 degrees, near enough the viewer to be large and
 * well inside the frame (the dead centre is the tunnel's far end, too small
 * to read), the others either side of it. By angle rather than by counting
 * tiles, because rows hold tiles of very different widths.
 */
const AT_DEGREES = [30, 46, 64, 74];

/** The first few featured pieces lead the hero: drawn larger, nearer centre. */
const LEADS = 5;
const LEAD_SCALE = 1;
/**
 * Each lead's own angle, by rank (the sign is the side), so the leads form a
 * staircase across both sides and the three rows rather than stacking.
 */
const LEAD_AT = [-30, 30, -50, 44, -66];
function scaleOf(t: { feature?: number }): number {
  return t.feature !== undefined && t.feature < LEADS ? LEAD_SCALE : 1;
}
/** Measured: how far a row has turned once the hero has settled (about 2s). */
const SETTLE_TURN = 55;

function centreFeatured(row: ReelTile[], featured: ReelTile[], r: number): ReelTile[] {
  const mine = featured.filter((_, i) => i % ROWS === r);
  const out = [...row];
  mine.forEach((tile, k) => {
    // The side alternates by piece and by row, so the leads are spread
    // across both sides of the hero rather than stacked on one.
    const side = (k + r) % 2 ? 1 : -1;
    // The row has turned by about SETTLE_TURN degrees by the time the spin-in
    // has settled, so the target is set back by that much.
    const lead = tile.feature !== undefined ? LEAD_AT[tile.feature] : undefined;
    const target = (lead ?? side * (AT_DEGREES[k] ?? 50 + k * 6)) - SETTLE_TURN;
    const { angles } = layout([out], SSR_GEOMETRY)[0]!;
    let best = 0;
    angles.forEach((a, i) => {
      if (Math.abs(a - target) < Math.abs(angles[best]! - target)) best = i;
    });
    out.splice(target + SETTLE_TURN > 0 ? best + 1 : best, 0, tile);
  });
  return out;
}

/** Server-side starting layout, at desktop proportions. */
const SSR_GEOMETRY = geometry(1440);

export function Tunnel({
  tiles,
  live,
  label,
  pauseLabel,
  playLabel,
}: {
  tiles: ReelTile[];
  live: boolean;
  label: string;
  pauseLabel: string;
  playLabel: string;
}) {
  const reduced = usePrefersReducedMotion();
  const prefersStill = reduced || saveData();
  const [choice, setChoice] = useState<boolean | null>(null);
  const paused = choice ?? prefersStill;

  // Every piece once: dealt round the rows in turn, so each row is a third of
  // the work and no piece meets itself. (A short reel is padded upstream, in
  // reelTiles, so a row is never too sparse to fill its arc.)
  const featured = tiles
    .filter((t) => t.feature !== undefined)
    .sort((a, b) => (a.feature ?? 0) - (b.feature ?? 0));
  const rest = tiles.filter((t) => t.feature === undefined);
  const rows = Array.from({ length: ROWS }, (_, r) =>
    centreFeatured(
      rest.filter((_, i) => i % ROWS === r),
      featured,
      r
    )
  );
  const ssr = layout(rows, SSR_GEOMETRY);

  // Everything the frame loop needs, kept out of React state.
  const state = useRef({
    paused,
    reduced,
    phase: 0,
    boost: 0,
    lastT: 0,
    lastP: 0,
    yaw: 0,
    pitch: 0,
    targetYaw: 0,
    targetPitch: 0,
    drag: 0,
    spunIn: false,
    spinStart: 0,
    geo: SSR_GEOMETRY,
    layout: ssr,
    angles: [] as number[][],
    anchors: [] as HTMLElement[][],
    lastWrite: [] as string[][],
    /** Re-decides playback now; set by the playback effect. */
    tick: undefined as undefined | (() => void),
  });

  useEffect(() => {
    state.current.paused = paused;
    state.current.reduced = reduced;
    // Pausing stops every clip at once, not at the next playback check.
    state.current.tick?.();
  }, [paused, reduced]);

  const camRef = useRef<HTMLDivElement | null>(null);

  const host = useScene<HTMLDivElement>(
    (p, t) => {
      const s = state.current;
      const cam = camRef.current;
      if (!cam || s.anchors.length === 0) return;
      const still = s.reduced;
      if (still) p = 0;

      const dt = Math.min(0.1, Math.max(0, t - s.lastT));
      s.lastT = t;
      const dp = Math.abs(p - s.lastP);
      s.lastP = p;

      if (!s.paused && !still) {
        s.boost = s.boost * 0.94 + dp * 260;
        s.phase += dt * BASE_SPEED * (1 + Math.min(s.boost, 6));
        s.yaw += (s.targetYaw - s.yaw) * 0.05;
        s.pitch += (s.targetPitch - s.pitch) * 0.05;
      }
      s.phase += s.drag;
      s.drag *= 0.9;

      // Spin up into place once, the first time the hero is seen.
      if (!s.spunIn && !still) {
        s.spunIn = true;
        s.spinStart = t;
      }
      const since = t - s.spinStart;
      const spin = still ? 0 : 120 * Math.exp(-since * 1.9);

      const { W, c } = s.geo;
      cam.style.transform = `translateZ(${(-c + p * W * 0.14).toFixed(1)}px) rotateX(${(s.pitch - p * 7).toFixed(2)}deg) rotateY(${s.yaw.toFixed(2)}deg)`;

      for (let r = 0; r < s.anchors.length; r++) {
        const { angles, period } = s.layout[r]!;
        const turn = s.phase * (ROW_SPEED[r] ?? 1) + spin * (1 + r * 0.12);
        const row = s.anchors[r]!;
        for (let k = 0; k < row.length; k++) {
          const a = wrap(angles[k]! + turn, period);
          s.angles[r]![k] = a;
          const el = row[k]!;
          const tf = `rotateY(${a.toFixed(2)}deg) translateZ(${(-s.geo.R).toFixed(1)}px)`;
          if (s.lastWrite[r]![k] !== tf) {
            el.style.transform = tf;
            el.style.opacity = fog(a).toFixed(3);
            s.lastWrite[r]![k] = tf;
          }
        }
      }
    },
    { ambient: true, from: 0.45, to: -0.35 }
  );

  // Geometry, anchors and resize.
  useEffect(() => {
    const stage = host.current;
    if (!stage) return;
    const s = state.current;
    s.anchors = Array.from(stage.querySelectorAll<HTMLElement>('.tunnel__row')).map((row) =>
      Array.from(row.querySelectorAll<HTMLElement>('.tunnel__tile'))
    );
    s.angles = s.anchors.map((row) => row.map(() => 0));
    s.lastWrite = s.anchors.map((row) => row.map(() => ''));

    const measure = () => {
      const g = geometry(stage.clientWidth);
      s.geo = g;
      s.layout = layout(rows, g);
      s.lastWrite = s.anchors.map((row) => row.map(() => ''));
      // Resting angles, so playback has something to go on before (or, under
      // reduced motion, instead of) the first frame.
      s.angles = s.layout.map((l) => [...l.angles]);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(stage);
    return () => ro.disconnect();
    // `rows` is derived from `tiles`, which is fixed for the life of the page.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [host]);

  // Pointer lean and drag-to-turn.
  useEffect(() => {
    const stage = host.current;
    if (!stage) return;
    const s = state.current;
    let dragging = false;
    let lastX = 0;

    const onMove = (e: PointerEvent) => {
      const rect = stage.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      s.targetYaw = x * 8;
      s.targetPitch = -y * 5;
      if (dragging) {
        s.drag += (e.clientX - lastX) * 0.06;
        lastX = e.clientX;
      }
    };
    const onDown = (e: PointerEvent) => {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      dragging = true;
      lastX = e.clientX;
      stage.dataset.dragging = 'true';
    };
    const onUp = () => {
      dragging = false;
      delete stage.dataset.dragging;
    };
    const onLeave = () => {
      s.targetYaw = 0;
      s.targetPitch = 0;
      onUp();
    };
    stage.addEventListener('pointermove', onMove);
    stage.addEventListener('pointerdown', onDown);
    window.addEventListener('pointerup', onUp);
    stage.addEventListener('pointerleave', onLeave);
    return () => {
      stage.removeEventListener('pointermove', onMove);
      stage.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      stage.removeEventListener('pointerleave', onLeave);
    };
  }, [host]);

  // Playback: decided a few times a second from the angles the frame wrote.
  useEffect(() => {
    const stage = host.current;
    if (!stage || !live) return;
    const s = state.current;
    const videos = s.anchors.map((row) => row.map((el) => el.querySelector('video')));
    const playing = new Set<HTMLVideoElement>();
    let onScreen = true;
    const io = new IntersectionObserver(([entry]) => {
      onScreen = Boolean(entry?.isIntersecting);
    });
    io.observe(stage);

    const tick = () => {
      const allowed = onScreen && !s.paused && document.visibilityState === 'visible';
      const cap = s.geo.W < 720 ? PLAY_CAP.narrow : PLAY_CAP.wide;
      const wanted: { v: HTMLVideoElement; a: number }[] = [];
      if (allowed) {
        for (let r = 0; r < videos.length; r++) {
          for (let k = 0; k < videos[r]!.length; k++) {
            const v = videos[r]![k];
            const a = s.angles[r]?.[k] ?? 999;
            if (v && Math.abs(a) < 82) wanted.push({ v, a: Math.abs(a) });
          }
        }
        wanted.sort((x, y) => x.a - y.a);
      }
      const keep = new Set(wanted.slice(0, cap).map((w) => w.v));
      for (const v of playing) {
        if (!keep.has(v)) {
          v.pause();
          playing.delete(v);
        }
      }
      let started = 0;
      for (const v of keep) {
        if (playing.has(v)) continue;
        playing.add(v);
        // A few at a time, so the wall does not lurch into motion at once.
        if (started++ > 5) {
          playing.delete(v);
          continue;
        }
        v.play().catch(() => playing.delete(v));
      }
    };
    const timer = window.setInterval(tick, 350);
    s.tick = tick;
    tick();
    return () => {
      window.clearInterval(timer);
      s.tick = undefined;
      io.disconnect();
      for (const v of playing) v.pause();
    };
  }, [host, live]);

  return (
    <figure className="tunnel" data-paused={paused ? 'true' : 'false'}>
      <div className="tunnel__stage" ref={host} aria-hidden="true">
        <div className="tunnel__cam" ref={camRef}>
          {rows.map((row, r) => (
            <div className="tunnel__row" key={r} style={{ '--row': r } as CSSProperties}>
              {row.map((tile, k) => {
                const a = ssr[r]!.angles[k]!;
                return (
                  <div
                    className="tunnel__tile"
                    key={k}
                    style={{
                      transform: `rotateY(${a.toFixed(2)}deg) translateZ(calc(var(--R) * -1))`,
                      opacity: fog(a),
                    }}
                  >
                    <div
                      className="tunnel__face"
                      style={{ '--ratio': tile.ratio, '--scale': scaleOf(tile) } as CSSProperties}
                    >
                      {tile.kind === 'still' ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={tile.src}
                          alt=""
                          loading="lazy"
                          decoding="async"
                          draggable={false}
                        />
                      ) : tile.kind === 'clip' ? (
                        <video
                          src={tile.src}
                          poster={tile.poster}
                          muted
                          loop
                          playsInline
                          preload="none"
                          disablePictureInPicture
                          tabIndex={-1}
                        />
                      ) : (
                        <span
                          className="tunnel__slot"
                          data-tone={SLOT_TONES[(k + r * 2) % SLOT_TONES.length]}
                        >
                          <span className="tunnel__slotlabel">{tile.number}</span>
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
      <figcaption className="tunnel__caption">
        <span className="gl-sr">{label}</span>
        <button type="button" className="tunnel__toggle" onClick={() => setChoice(!paused)}>
          <span
            className="tunnel__toggleicon"
            data-state={paused ? 'paused' : 'playing'}
            aria-hidden="true"
          />
          {paused ? playLabel : pauseLabel}
        </button>
      </figcaption>
    </figure>
  );
}
