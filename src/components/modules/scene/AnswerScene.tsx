'use client';

import { useRef } from 'react';
import { SceneFrame } from './SceneFrame';
import { seg, useScene } from './useScene';

/**
 * ANSWER — the week's call load, and the calls that ring out of it.
 *
 * The drawing is a working week: five day columns, ten half-hour rows from
 * 08:00, and inside each cell one tick per call. A faint rule inside the cell
 * marks how many calls the desk can hold at once. Ticks to the left of it are
 * answered; ticks to the right are the calls that ring out, and they are the
 * ones the module catches.
 *
 * That encoding does the work of three separate diagrams at once. Volume
 * clustering is visible because the ticks pile up against Monday and Tuesday
 * mornings. Overflow is visible because it is literally the part of the row
 * that crosses the line. And recovery is visible because those same marks fill
 * in rather than new ones appearing somewhere else.
 *
 * Beats, across scroll progress:
 *   0.04 - 0.44   the week arrives, chronologically
 *   0.44 - 0.64   everything past the capacity rule is outlined: rang out
 *   0.66 - 0.96   the outlined calls fill in: answered anyway
 */

/* --- Geometry, in a 400 x 214 viewBox ----------------------------------- */
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
const SLOTS = 10; // 08:00 to 12:30, in half hours
const PLOT_X = 34;
const PLOT_Y = 22;
const COL_W = 73;
const ROW_H = 19;
const TICK_W = 10;
const TICK_H = 8;
const TICK_GAP = 4;
const MAX_CALLS = 5;
const CAPACITY = 2; // calls the desk can hold at once
const CAP_X = CAPACITY * (TICK_W + TICK_GAP) - TICK_GAP / 2;

/**
 * Where the week's demand actually sits: heavily into Monday and Tuesday
 * mornings, thinning through the week and across the day.
 *
 * The range runs 0 to 5 rather than 1 to 4 on purpose. An earlier version
 * gave every half hour at least one call, and the result was a field that
 * looked evenly busy: the clustering that is the whole point of this drawing
 * was legible only if you counted. Letting quiet slots reach zero is what
 * makes the Monday morning block read as a block.
 */
const DAY_WEIGHT = [1, 0.96, 0.58, 0.55, 0.48];
const SLOT_WEIGHT = [1, 1, 0.92, 0.8, 0.52, 0.34, 0.28, 0.44, 0.36, 0.22];

type Tick = {
  id: string;
  x: number;
  y: number;
  /** Chronological position, 0..1, used to stagger arrival. */
  order: number;
  /** True when this call is past the desk's capacity for its half hour. */
  missed: boolean;
};

function buildWeek(): Tick[] {
  const ticks: Tick[] = [];
  for (let d = 0; d < DAYS.length; d += 1) {
    for (let s = 0; s < SLOTS; s += 1) {
      const weight = (DAY_WEIGHT[d] ?? 0.5) * (SLOT_WEIGHT[s] ?? 0.5);
      const count = Math.max(0, Math.min(MAX_CALLS, Math.round(weight * 5.4 - 0.5)));
      for (let c = 0; c < count; c += 1) {
        ticks.push({
          id: `${d}-${s}-${c}`,
          x: PLOT_X + d * COL_W + c * (TICK_W + TICK_GAP),
          y: PLOT_Y + s * ROW_H,
          // Chronological: day first, then time of day.
          order: (d * SLOTS + s) / (DAYS.length * SLOTS),
          missed: c >= CAPACITY,
        });
      }
    }
  }
  return ticks;
}

/* The week is deterministic and takes no input, so it is built once at module
   scope rather than memoised per mount. */
const TICKS = buildWeek();
const MISSED = TICKS.filter((t) => t.missed).length;

export function AnswerScene() {
  const ticks = TICKS;
  const missedCount = MISSED;

  const baseRefs = useRef<(SVGRectElement | null)[]>([]);
  const ringRefs = useRef<(SVGRectElement | null)[]>([]);
  const fillRefs = useRef<(SVGRectElement | null)[]>([]);
  const capRef = useRef<SVGGElement | null>(null);
  const countRefs = useRef<(HTMLElement | null)[]>([]);
  // Last written value per element, so a frame only touches what changed.
  const cache = useRef<Float32Array>(new Float32Array(0));

  const hostRef = useScene<HTMLDivElement>((p) => {
    if (cache.current.length !== ticks.length * 3 + 3) {
      cache.current = new Float32Array(ticks.length * 3 + 3).fill(-1);
    }
    const c = cache.current;

    // Write only when the value has actually moved. Rounding to 1/100 keeps
    // sub-perceptual changes from costing a style recalculation.
    const put = (el: Element | null, i: number, v: number) => {
      if (!el) return;
      const q = Math.round(v * 100) / 100;
      if (c[i] === q) return;
      c[i] = q;
      (el as SVGElement).style.opacity = String(q);
    };

    let arrived = 0;
    let outlined = 0;
    let caught = 0;

    for (let i = 0; i < ticks.length; i += 1) {
      const tick = ticks[i]!;

      // Arrival, staggered chronologically across the first beat.
      const aStart = 0.04 + tick.order * 0.34;
      const a = seg(p, aStart, aStart + 0.08);

      if (!tick.missed) {
        put(baseRefs.current[i]!, i * 3, a);
        if (a > 0.5) arrived += 1;
        continue;
      }

      // A missed call arrives the same way, then is outlined, then filled.
      const oStart = 0.44 + tick.order * 0.16;
      const o = seg(p, oStart, oStart + 0.06);
      const fStart = 0.66 + tick.order * 0.24;
      const f = seg(p, fStart, fStart + 0.07);

      put(baseRefs.current[i]!, i * 3, a * (1 - o));
      put(ringRefs.current[i]!, i * 3 + 1, o * (1 - f));
      put(fillRefs.current[i]!, i * 3 + 2, f);

      if (a > 0.5) arrived += 1;
      if (o > 0.5) outlined += 1;
      if (f > 0.5) caught += 1;
    }

    // The capacity rule appears with the outlining beat, which is the moment
    // it starts to mean something.
    put(capRef.current, ticks.length * 3, seg(p, 0.4, 0.5));

    const totals = [arrived, outlined, caught];
    for (let i = 0; i < totals.length; i += 1) {
      const el = countRefs.current[i];
      const v = totals[i]!;
      if (el && c[ticks.length * 3 + i] !== v) {
        c[ticks.length * 3 + i] = v;
        el.textContent = String(v);
      }
    }
  });

  return (
    <div ref={hostRef}>
      <SceneFrame
        label="One week of inbound calls"
        onReadout={(el, i) => {
          countRefs.current[i] = el;
        }}
        /* The third figure deliberately describes a change in record-keeping
           rather than a rate of recovery. "Rang out 22 / answered 22" would
           read as a claim to catch every call, which is not a claim this site
           makes anywhere. Every call producing a record is a design fact. */
        readouts={[
          { key: 'Calls on the line', value: String(ticks.length) },
          { key: 'Arrive with nobody free', value: String(missedCount) },
          { key: 'Now leave a record', value: String(missedCount), tone: 'signal' },
        ]}
        note="Illustrative of the shape of a week, not a measurement. Half-hour slots from 08:00. Each tick is one call; the rule inside a row is how many the desk can hold at once."
      >
        <svg
          className="mplot"
          viewBox="0 0 400 232"
          role="img"
          aria-label="A working week of inbound calls, plotted as five day columns and ten half-hour rows. Calls cluster into Monday and Tuesday mornings. The calls that arrive while the desk is already occupied are marked as ringing out, and are then shown answered."
        >
          {/* Day headings */}
          {DAYS.map((day, d) => (
            <text
              className="mplot__axis"
              key={day}
              x={PLOT_X + d * COL_W}
              y={12}
              textAnchor="start"
            >
              {day}
            </text>
          ))}

          {/* Half-hour labels, on the hour only */}
          {Array.from({ length: SLOTS }, (_, s) =>
            s % 2 === 0 ? (
              <text
                className="mplot__axis"
                key={s}
                x={24}
                y={PLOT_Y + s * ROW_H + TICK_H}
                textAnchor="end"
              >
                {`${8 + s / 2}:00`}
              </text>
            ) : null
          )}

          {/* The zone past the desk's capacity.
              Drawn as a shaded band rather than a rule: a line between the
              second and third tick read as a column divider, where a band
              reads as a region, which is what it is. Anything sitting inside
              it is a call that arrived with nobody free to take it. */}
          <g ref={capRef} style={{ opacity: 1 }} aria-hidden="true">
            {DAYS.map((day, d) => (
              <g key={day}>
                <rect
                  className="mplot__cap"
                  x={PLOT_X + d * COL_W + CAP_X}
                  y={PLOT_Y - 6}
                  width={(MAX_CALLS - CAPACITY) * (TICK_W + TICK_GAP) - TICK_GAP + 4}
                  height={(SLOTS - 1) * ROW_H + TICK_H + 12}
                />
                <line
                  className="mplot__capedge"
                  x1={PLOT_X + d * COL_W + CAP_X}
                  y1={PLOT_Y - 6}
                  x2={PLOT_X + d * COL_W + CAP_X}
                  y2={PLOT_Y + (SLOTS - 1) * ROW_H + TICK_H + 6}
                />
              </g>
            ))}
            <text
              className="mplot__axis mplot__caplabel"
              x={PLOT_X + CAP_X + 2}
              y={PLOT_Y + (SLOTS - 1) * ROW_H + TICK_H + 20}
            >
              Beyond the desk
            </text>
          </g>

          {/* The calls */}
          {ticks.map((tick, i) => (
            <g key={tick.id}>
              <rect
                ref={(el) => {
                  baseRefs.current[i] = el;
                }}
                className="mplot__tick"
                x={tick.x}
                y={tick.y}
                width={TICK_W}
                height={TICK_H}
                rx={1.5}
                style={{ opacity: 1 }}
              />
              {tick.missed ? (
                <>
                  <rect
                    ref={(el) => {
                      ringRefs.current[i] = el;
                    }}
                    className="mplot__tick-ring"
                    x={tick.x + 0.5}
                    y={tick.y + 0.5}
                    width={TICK_W - 1}
                    height={TICK_H - 1}
                    rx={1.5}
                    style={{ opacity: 0 }}
                  />
                  <rect
                    ref={(el) => {
                      fillRefs.current[i] = el;
                    }}
                    className="mplot__tick-caught"
                    x={tick.x}
                    y={tick.y}
                    width={TICK_W}
                    height={TICK_H}
                    rx={1.5}
                    style={{ opacity: 1 }}
                  />
                </>
              ) : null}
            </g>
          ))}
        </svg>
      </SceneFrame>
    </div>
  );
}
