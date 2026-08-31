'use client';

import { memo, useRef, useState, type CSSProperties } from 'react';
import { usePrefersReducedMotion } from './useInView';
import { seg, useScene } from '@/components/modules/scene/useScene';

/**
 * THE SIGNATURE SEQUENCE.
 *
 * Eight marks travel through three arrangements as the reader scrolls a tall
 * section: scattered signals become an aligned queue, and the queue resolves
 * into the four-stage value staircase.
 *
 * ---------------------------------------------------------------------------
 * WHAT WAS WRONG WITH THE PREVIOUS VERSION, since the same mistakes are easy
 * to make again:
 *
 *   1. It snapped between four discrete states. Scroll position chose an
 *      index, and CSS transitions animated between indices. The reader was
 *      TRIGGERING four animations rather than scrubbing one, which is why it
 *      felt disconnected from the scrollbar.
 *
 *   2. It transitioned the SVG geometry attributes `x`, `y`, `width` and
 *      `height`. Those are not compositor properties. Every frame of every
 *      transition forced the browser to recompute and repaint the geometry of
 *      eight rects on the main thread, and no amount of `will-change` can
 *      promote them, because there is nothing to promote: the shape itself is
 *      changing.
 *
 *   3. Four durations ran at once: 1200ms on geometry, 700ms on opacity and
 *      fill, a 220ms delay on the labels, plus a 45ms per-mark stagger. Frames
 *      landed in the middle of four unrelated curves.
 *
 *   4. It listened to `scroll`. Scroll events coalesce under momentum and are
 *      dispatched after the compositor has already moved the page, so even
 *      rAF-throttled the scene was always a frame behind the content.
 *
 * WHAT IT DOES NOW: `useScene` runs one rAF loop while the section is on
 * screen and reads the element's own rect at paint time. This component
 * interpolates every mark's position CONTINUOUSLY from that progress and
 * writes one `transform` and one `opacity` per mark. No CSS transitions
 * anywhere in the drawing, because a transition on a scroll-linked value makes
 * the scene lag the scrollbar by its own duration.
 *
 * Each mark is a 1x1 rect moved and sized by `translate(x,y) scale(w,h)`, so a
 * single compositor-friendly property carries both position and size.
 * ---------------------------------------------------------------------------
 */

type Mark = { x: number; y: number; w: number; h: number; o: number; stage?: 1 | 2 | 3 | 4 };

/**
 * The mark is drawn at the largest size it ever takes and scaled down from
 * there. A unit rect scaled UP re-rasterises every frame and renders soft;
 * scaling down from the natural size costs nothing and stays sharp.
 */
const BASE_W = 158;
const BASE_H = 11;

const BAR_X = 58;
const BAR_WIDTHS = [158, 116, 97, 86];
const BAR_Y = (i: number) => 10 + i * 18;

const SCATTERED: Mark[] = [
  { x: 18, y: 12, w: 18, h: 2.5, o: 0.22 },
  { x: 80, y: 25, w: 13, h: 2.5, o: 0.34 },
  { x: 172, y: 9, w: 21, h: 2.5, o: 0.2 },
  { x: 49, y: 45, w: 16, h: 2.5, o: 0.4 },
  { x: 125, y: 60, w: 18, h: 2.5, o: 0.26 },
  { x: 205, y: 37, w: 14, h: 2.5, o: 0.44 },
  { x: 96, y: 75, w: 20, h: 2.5, o: 0.24 },
  { x: 153, y: 50, w: 12, h: 2.5, o: 0.3 },
];

const QUEUED: Mark[] = Array.from({ length: 8 }, (_, i) => ({
  x: 91,
  y: 8 + i * 9.5,
  w: 78,
  h: 2.5,
  o: 0.78,
}));

const STAIRCASE: Mark[] = Array.from({ length: 8 }, (_, i) => {
  const k = i < 4 ? i : i - 4;
  return {
    x: BAR_X,
    y: BAR_Y(k),
    w: BAR_WIDTHS[k] ?? 86,
    h: 11,
    o: i < 4 ? 1 : 0,
    ...(i < 4 ? { stage: (i + 1) as 1 | 2 | 3 | 4 } : {}),
  };
});

const STAGE_LABELS = ['Estimated', 'Booked', 'Attended', 'Collected'];
const COLLECTED_EDGE = BAR_X + (BAR_WIDTHS[3] ?? 86);

const FRAMES = [
  {
    step: 'Detect',
    title: 'The signals already exist.',
    body: 'A call that lasted eight seconds. A form submitted at 21:40. A recall that came due in March and is still open. Each one is already in your systems, and none of them is on anybody’s list.',
  },
  {
    step: 'Consolidate',
    title: 'Scattered events become a worked queue.',
    body: 'Duplicates are collapsed, an estimated value is attached from your own fee schedule, and every item gets an owner and a due time. Until an event has a deadline, nobody can be held to it.',
  },
  {
    step: 'Settle',
    title: 'Value moves stage by stage, on evidence.',
    body: 'An item is promoted only when a system record says so: an appointment in the practice management system, an attendance status, a payment in the ledger. Never on inference.',
  },
  {
    step: 'Hold',
    title: 'One of these four numbers is revenue.',
    body: 'Collected value is the only figure that describes money in the account. The distance between it and the three above it is the operational conversation worth having.',
  },
];

/** Linear interpolation between two arrangements of the same eight marks. */
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Ease each mark's own travel so the middle of the scrub is not linear. */
const smooth = (t: number) => t * t * (3 - 2 * t);

export function RecoverySequence() {
  const reduced = usePrefersReducedMotion();
  const markRefs = useRef<(SVGRectElement | null)[]>([]);
  const labelRef = useRef<SVGGElement | null>(null);
  const markerRef = useRef<SVGGElement | null>(null);
  const stepRefs = useRef<(HTMLLIElement | null)[]>([]);
  const cache = useRef<string[]>([]);
  const bandRef = useRef(-1);

  /**
   * The copy beside the diagram is content, so it goes through React. It
   * changes at most three times across the whole scroll, not once a frame:
   * the draw callback only calls setState when the band index actually
   * changes, which is what keeps a per-frame loop free of renders.
   */
  const [band, setBand] = useState(FRAMES.length - 1);

  const hostRef = useScene<HTMLDivElement>(
    (p) => {
      // Two legs: scatter to queue, then queue to staircase. The last stretch
      // holds, so the finished staircase is on screen long enough to read.
      const legA = smooth(seg(p, 0.02, 0.42));
      const legB = smooth(seg(p, 0.42, 0.8));

      for (let i = 0; i < 8; i += 1) {
        const a = SCATTERED[i]!;
        const b = QUEUED[i]!;
        const c = STAIRCASE[i]!;

        const x = lerp(lerp(a.x, b.x, legA), c.x, legB);
        const y = lerp(lerp(a.y, b.y, legA), c.y, legB);
        const w = lerp(lerp(a.w, b.w, legA), c.w, legB);
        const h = lerp(lerp(a.h, b.h, legA), c.h, legB);
        const o = lerp(lerp(a.o, b.o, legA), c.o, legB);

        const el = markRefs.current[i];
        if (!el) continue;
        // One transform carries position and size, because the rect is a unit
        // square. Rounded to a tenth: below that the value cannot be seen and
        // the write would cost a style recalculation for nothing.
        const t = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) scale(${(w / BASE_W).toFixed(4)}, ${(h / BASE_H).toFixed(4)})`;
        const key = `${t}|${o.toFixed(2)}`;
        if (cache.current[i] === key) continue;
        cache.current[i] = key;
        el.style.transform = t;
        el.style.opacity = o.toFixed(2);
      }

      // Stage names arrive with the staircase; the money marker after it.
      const labels = seg(p, 0.5, 0.68).toFixed(2);
      if (cache.current[8] !== labels) {
        cache.current[8] = labels;
        if (labelRef.current) labelRef.current.style.opacity = labels;
      }
      const marker = seg(p, 0.78, 0.92).toFixed(2);
      if (cache.current[9] !== marker) {
        cache.current[9] = marker;
        if (markerRef.current) markerRef.current.style.opacity = marker;
      }

      // The rail tracks progress continuously, written straight to the DOM.
      const next = p < 0.24 ? 0 : p < 0.5 ? 1 : p < 0.78 ? 2 : 3;
      if (bandRef.current !== next) {
        bandRef.current = next;
        for (let i = 0; i < stepRefs.current.length; i += 1) {
          stepRefs.current[i]?.setAttribute('data-active', i === next ? 'true' : 'false');
        }
        setBand(next);
      }
    },
    // A long window: this scene is the page's centrepiece and deserves a real
    // scrub rather than resolving in half a screen.
    { from: 0.95, to: -0.55 }
  );

  const frame = FRAMES[band] ?? FRAMES[FRAMES.length - 1]!;

  /**
   * Reduced motion gets a static stacked list: all four steps, in order, with
   * the diagram already resolved. Nothing is hidden behind a preference.
   */
  if (reduced) {
    return (
      <div className="scene scene--static">
        <ol className="scene__list">
          {FRAMES.map((f, i) => (
            <li className="scene__listitem" key={f.step}>
              <p className="label label--accent">{`0${i + 1} / 04 · ${f.step}`}</p>
              <h3 className="display d3">{f.title}</h3>
              <p className="small">{f.body}</p>
            </li>
          ))}
        </ol>
        <div>
          <SequenceArt
            marks={STAIRCASE}
            labelOpacity={1}
            markerOpacity={1}
            markRefs={null}
            labelRef={null}
            markerRef={null}
          />
          <p className="micro" style={{ marginTop: 14 }}>
            Illustrative of the shape of the staircase. Proportions are not a benchmark and no
            client data appears on this website.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="scene" ref={hostRef}>
      <div className="scene__stage">
        <div className="two-col">
          <div>
            <p className="label label--accent" style={{ marginBottom: 18 }}>
              {`0${band + 1} / 04 · ${frame.step}`}
            </p>
            <h3 className="display d3" style={{ marginBottom: 18, maxWidth: '18ch' }}>
              {frame.title}
            </h3>
            <p className="small" style={{ maxWidth: '46ch' }} aria-live="polite">
              {frame.body}
            </p>
          </div>

          <div>
            <SequenceArt
              marks={STAIRCASE}
              labelOpacity={1}
              markerOpacity={1}
              markRefs={markRefs}
              labelRef={labelRef}
              markerRef={markerRef}
            />
            <p className="micro" style={{ marginTop: 14 }}>
              Illustrative of the shape of the staircase. Proportions are not a benchmark and no
              client data appears on this website.
            </p>
          </div>
        </div>

        <ol className="scene__rail">
          {FRAMES.map((f, i) => (
            <li
              className="scene__step"
              key={f.step}
              ref={(el) => {
                stepRefs.current[i] = el;
              }}
              data-active={i === band ? 'true' : 'false'}
              style={{ '--i': i } as CSSProperties}
            >
              <span className="label" style={{ display: 'block', marginBottom: 8 }}>
                {`0${i + 1}`}
              </span>
              <span className="label scene__stepname">{f.step}</span>
            </li>
          ))}
        </ol>
      </div>
      <div className="scene__spacer" aria-hidden="true" />
    </div>
  );
}

/**
 * The drawing. Authored in its FINAL state, so a blocked bundle or a
 * reduced-motion preference leaves a complete, labelled staircase.
 */
const SequenceArt = memo(function SequenceArt({
  marks,
  labelOpacity,
  markerOpacity,
  markRefs,
  labelRef,
  markerRef,
}: {
  marks: Mark[];
  labelOpacity: number;
  markerOpacity: number;
  markRefs: React.RefObject<(SVGRectElement | null)[]> | null;
  labelRef: React.RefObject<SVGGElement | null> | null;
  markerRef: React.RefObject<SVGGElement | null> | null;
}) {
  return (
    <svg
      className="seqart"
      viewBox="0 0 260 92"
      role="img"
      aria-label="Scattered revenue signals consolidating into a queue and resolving into a four-stage value staircase: estimated, then booked, then attended, then collected, each smaller than the one above it."
    >
      {marks.map((mark, i) => (
        <rect
          key={i}
          ref={(el) => {
            if (markRefs) markRefs.current[i] = el;
          }}
          className="seqart__mark"
          x={0}
          y={0}
          width={BASE_W}
          height={BASE_H}
          fill={mark.stage ? `var(--gl-stage-${mark.stage})` : 'var(--gl-purple)'}
          style={{
            transform: `translate(${mark.x}px, ${mark.y}px) scale(${mark.w / BASE_W}, ${mark.h / BASE_H})`,
            opacity: mark.o,
          }}
        />
      ))}

      <g
        ref={labelRef}
        className="seqart__labels"
        style={{ opacity: labelOpacity }}
        aria-hidden="true"
        fill="var(--gl-slate)"
      >
        {STAGE_LABELS.map((label, i) => (
          <text key={label} x={50} y={BAR_Y(i) + 8.4} textAnchor="end">
            {label}
          </text>
        ))}
      </g>

      <g ref={markerRef} style={{ opacity: markerOpacity }} aria-hidden="true">
        <line
          x1={COLLECTED_EDGE}
          y1={BAR_Y(0) - 4}
          x2={COLLECTED_EDGE}
          y2={BAR_Y(3) + 16}
          stroke="var(--gl-purple)"
          strokeWidth="0.7"
          strokeDasharray="2 3"
          opacity="0.85"
        />
        <text
          className="seqart__marker"
          x={COLLECTED_EDGE + 4}
          y={BAR_Y(3) + 20}
          fill="var(--gl-purple)"
        >
          Money in the account
        </text>
      </g>
    </svg>
  );
});
