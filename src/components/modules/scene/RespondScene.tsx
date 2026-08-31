'use client';

import { useRef } from 'react';
import { SceneFrame } from './SceneFrame';
import { seg, useScene } from './useScene';

/**
 * RESPOND — elapsed time as the antagonist.
 *
 * Scroll IS time here. The reader's scroll drives a clock from the moment an
 * enquiry arrives to half an hour later, and the drawing is what that half
 * hour costs. Thirty bars, one per minute, whose height is the relative chance
 * of still reaching the person who sent it. A sweep line moves with the clock,
 * and every minute it passes goes out.
 *
 * That is the whole argument of the module, made physical: nothing is added,
 * something is lost, and the loss is a function of nothing but delay. The
 * first five bars are purple because that is the window Respond works inside.
 * Watching the purple get consumed first is the point.
 *
 * Beats:
 *   0.00 - 0.10   the field and the five-minute gate appear
 *   0.10 - 0.94   the clock runs, 0 to 30 minutes; minutes go out behind it
 *   0.94 - 1.00   what is left is held, and labelled
 */

const MINUTES = 30;
const PLOT_X = 44;
const PLOT_W = 336;
const BASE_Y = 176;
const PLOT_H = 132;
const BAR_W = 7;
const GATE = 5; // minutes

const x = (m: number) => PLOT_X + (m / MINUTES) * PLOT_W;

/**
 * Relative chance of still reaching the enquirer, indexed to 1.0 on arrival.
 *
 * Hyperbolic rather than exponential. An exponential fitted to the same
 * five-minute drop is at four per cent by minute ten, which left two thirds
 * of the chart empty and made the last twenty minutes look identical to each
 * other. The real shape is a steep fall and then a long, thin tail, and the
 * tail is worth drawing: it is what the reader recognises from an inbox.
 *
 * It is a shape, not a measurement, and the caption says so.
 */
const chance = (m: number) => 1 / (1 + m / 1.6);

type Bar = { m: number; h: number; inWindow: boolean };

const BARS: Bar[] = Array.from({ length: MINUTES }, (_, m) => ({
  m,
  h: Math.max(1.5, chance(m) * PLOT_H),
  inWindow: m < GATE,
}));

export function RespondScene() {
  const barRefs = useRef<(SVGRectElement | null)[]>([]);
  const sweepRef = useRef<SVGGElement | null>(null);
  const readRefs = useRef<(HTMLElement | null)[]>([]);
  const cache = useRef<Float32Array>(new Float32Array(MINUTES + 6).fill(-1));

  const hostRef = useScene<HTMLDivElement>((p) => {
    const c = cache.current;

    // The clock. Held at 0 for the first beat so the field can be read before
    // anything starts being taken away.
    const elapsed = seg(p, 0.1, 0.72) * MINUTES;

    /**
     * The last beat brings the five-minute window back to full and holds the
     * rest dim. Two reasons. It ends on the argument rather than on an empty
     * chart, and it means the settled state is a complete, readable picture:
     * under reduced motion `useScene` draws progress 1 once and never
     * animates, and a scene whose end state is "everything faded out" would
     * hand those readers a blank.
     */
    const restore = seg(p, 0.78, 0.96);

    for (let i = 0; i < BARS.length; i += 1) {
      const bar = BARS[i]!;
      // A minute goes out as the sweep crosses it, over one minute of travel
      // so the edge is soft rather than a hard switch.
      const spent = seg(elapsed, bar.m, bar.m + 1);
      const dimmed = 1 - spent * 0.78;
      const o = bar.inWindow ? dimmed + (1 - dimmed) * restore : dimmed;
      const q = Math.round(o * 100) / 100;
      if (c[i] === q) continue;
      c[i] = q;
      const el = barRefs.current[i];
      if (el) el.style.opacity = String(q);
    }

    // The sweep line rides the clock on a transform, so it costs nothing.
    const sx = Math.round(((elapsed / MINUTES) * PLOT_W + Number.EPSILON) * 10) / 10;
    if (c[MINUTES] !== sx || c[MINUTES + 2] !== restore) {
      c[MINUTES] = sx;
      c[MINUTES + 2] = restore;
      if (sweepRef.current) {
        sweepRef.current.style.transform = `translateX(${sx}px)`;
        // The sweep retires once it has made its point, so the settled frame
        // is the window and the tail rather than a marker parked at the edge.
        sweepRef.current.style.opacity = String(1 - restore);
      }
    }

    // Readouts.
    const mm = Math.floor(elapsed);
    const ss = Math.floor((elapsed - mm) * 60);
    if (c[MINUTES + 1] !== elapsed) {
      c[MINUTES + 1] = elapsed;
      const clock = readRefs.current[0];
      if (clock)
        clock.textContent = `${String(mm).padStart(2, '0')}:${String(ss).padStart(2, '0')}`;
      const left = readRefs.current[2];
      if (left) left.textContent = `${Math.round(chance(elapsed) * 100)}`;
    }
  });

  return (
    <div ref={hostRef}>
      <SceneFrame
        label="Thirty minutes after an enquiry arrives"
        onReadout={(el, i) => {
          readRefs.current[i] = el;
        }}
        readouts={[
          { key: 'Elapsed', value: '30:00' },
          { key: 'Respond works inside', value: '5 min', tone: 'signal' },
          { key: 'Relative chance left', value: '5' },
        ]}
        note="Illustrative of the shape of a decay, not a measurement. Each bar is one minute; height is the relative chance of still reaching the person who sent the enquiry, indexed to the moment it arrived."
      >
        <svg
          className="mplot"
          viewBox="0 0 400 214"
          role="img"
          aria-label="Thirty bars, one for each minute after an enquiry arrives. Bar height is the relative chance of still reaching the enquirer, and it falls steeply. The first five minutes, the window Respond works inside, are marked; a sweep line runs across the chart and every minute behind it is spent."
        >
          {/* The five-minute window */}
          <rect
            className="mplot__window"
            x={x(0) - 2}
            y={BASE_Y - PLOT_H - 8}
            width={x(GATE) - x(0) + 2}
            height={PLOT_H + 8}
            rx={3}
          />
          <text className="mplot__axis mplot__windowlabel" x={x(0)} y={BASE_Y - PLOT_H - 14}>
            The window Respond works inside
          </text>

          {/* One bar per minute */}
          {BARS.map((bar, i) => (
            <rect
              key={bar.m}
              ref={(el) => {
                barRefs.current[i] = el;
              }}
              className={bar.inWindow ? 'mplot__min mplot__min--window' : 'mplot__min'}
              x={x(bar.m) + (x(1) - x(0) - BAR_W) / 2}
              y={BASE_Y - bar.h}
              width={BAR_W}
              height={bar.h}
              rx={1.5}
              style={{ opacity: 1 }}
            />
          ))}

          {/* Baseline and minute labels */}
          <line
            className="mplot__base"
            x1={PLOT_X - 4}
            y1={BASE_Y}
            x2={PLOT_X + PLOT_W}
            y2={BASE_Y}
          />
          {[0, 5, 10, 15, 20, 25, 30].map((m) => (
            <text className="mplot__axis" key={m} x={x(m)} y={BASE_Y + 14} textAnchor="middle">
              {m === 0 ? '0' : `${m}`}
            </text>
          ))}
          <text className="mplot__axis" x={PLOT_X + PLOT_W / 2} y={BASE_Y + 28} textAnchor="middle">
            Minutes since the enquiry arrived
          </text>

          {/* The sweep. Moved with a transform, never with an x attribute. */}
          <g ref={sweepRef} style={{ transform: `translateX(${PLOT_W}px)`, opacity: 0 }}>
            <line
              className="mplot__sweep"
              x1={PLOT_X}
              y1={BASE_Y - PLOT_H - 8}
              x2={PLOT_X}
              y2={BASE_Y + 4}
            />
            <circle className="mplot__sweepdot" cx={PLOT_X} cy={BASE_Y + 4} r={2.5} />
          </g>
        </svg>
      </SceneFrame>
    </div>
  );
}
