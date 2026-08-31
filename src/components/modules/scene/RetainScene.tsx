'use client';

import { useRef } from 'react';
import { SceneFrame } from './SceneFrame';
import { seg, useScene } from './useScene';

/**
 * RETAIN — a day on the schedule, held.
 *
 * The only one of the four drawings that is a picture of a real object the
 * reader already looks at every morning: a day column. Twelve slots down the
 * left, a waiting list on the right.
 *
 * The sequence is the module's whole job in order. Slots fill. Four of them
 * are flagged as at risk. Those four confirm. Then one books out anyway,
 * because some of them always do, and the top record on the waiting list moves
 * across into the gap it left.
 *
 * Showing the cancellation is deliberate. A drawing in which nothing goes
 * wrong would be describing a product that does not exist, and the backfill
 * only means anything if the reader has just watched the slot empty.
 *
 * Beats:
 *   0.00 - 0.28   the day fills
 *   0.28 - 0.48   four slots are flagged at risk
 *   0.48 - 0.68   those slots confirm
 *   0.68 - 0.80   slot 07 cancels
 *   0.80 - 1.00   the top waitlist record moves into it
 */

const SLOTS = 12;
const SLOT_X = 96;
const SLOT_W = 176;
const SLOT_H = 13;
const SLOT_GAP = 4;
const TOP = 26;
const WAIT_X = 300;
const WAIT_W = 84;

/** Which slots are flagged at risk, and which one books out anyway. */
const AT_RISK = [1, 4, 7, 9];
const CANCELS = 7;

const slotY = (i: number) => TOP + i * (SLOT_H + SLOT_GAP);
const time = (i: number) =>
  `${String(8 + Math.floor(i / 2)).padStart(2, '0')}:${i % 2 ? '30' : '00'}`;

export function RetainScene() {
  const bookedRefs = useRef<(SVGRectElement | null)[]>([]);
  const riskRefs = useRef<(SVGRectElement | null)[]>([]);
  const heldRefs = useRef<(SVGRectElement | null)[]>([]);
  const openRef = useRef<SVGRectElement | null>(null);
  const refillRef = useRef<SVGRectElement | null>(null);
  const moverRef = useRef<SVGGElement | null>(null);
  const waitRefs = useRef<(SVGGElement | null)[]>([]);
  const readRefs = useRef<(HTMLElement | null)[]>([]);
  const cache = useRef<Float32Array>(new Float32Array(SLOTS * 3 + 10).fill(-1));

  const hostRef = useScene<HTMLDivElement>((p) => {
    const c = cache.current;
    const put = (el: Element | null, i: number, v: number) => {
      if (!el) return;
      const q = Math.round(v * 100) / 100;
      if (c[i] === q) return;
      c[i] = q;
      (el as SVGElement).style.opacity = String(q);
    };

    let confirmed = 0;

    for (let i = 0; i < SLOTS; i += 1) {
      const order = i / SLOTS;
      const fill = seg(p, 0.02 + order * 0.2, 0.1 + order * 0.2);
      const isRisk = AT_RISK.includes(i);
      const isCancel = i === CANCELS;

      if (!isRisk) {
        put(bookedRefs.current[i]!, i * 3, fill);
        continue;
      }

      const risk = seg(p, 0.28 + order * 0.1, 0.36 + order * 0.1);
      const held = seg(p, 0.48 + order * 0.12, 0.58 + order * 0.12);
      // The one that books out anyway empties again at the end.
      const gone = isCancel ? seg(p, 0.68, 0.78) : 0;

      put(bookedRefs.current[i]!, i * 3, fill * (1 - risk));
      put(riskRefs.current[i]!, i * 3 + 1, risk * (1 - held));
      put(heldRefs.current[i]!, i * 3 + 2, held * (1 - gone));
      if (held > 0.5 && gone < 0.5) confirmed += 1;
    }

    // The empty slot, visible only between the cancellation and the backfill.
    const emptied = seg(p, 0.7, 0.8);
    const refilled = seg(p, 0.9, 0.99);
    put(openRef.current, SLOTS * 3, emptied * (1 - refilled));

    // The waiting-list record travels into the gap. Transform only.
    //
    // It then hands over to a full-width fill rather than sitting in the slot
    // at its own size: a waiting-list card is a record, and a booked slot is
    // a booked slot. Letting the small card stand in for the filled
    // appointment left the row looking part-filled, which is the opposite of
    // what just happened.
    const travel = seg(p, 0.84, 0.96);
    const key = SLOTS * 3 + 1;
    const tq = Math.round(travel * 100) / 100;
    if (c[key] !== tq || c[SLOTS * 3 + 7] !== refilled) {
      c[key] = tq;
      c[SLOTS * 3 + 7] = refilled;
      if (moverRef.current) {
        const dx = (SLOT_X + SLOT_W - 52 - WAIT_X) * tq;
        const dy = (slotY(CANCELS) - TOP) * tq;
        moverRef.current.style.transform = `translate(${dx}px, ${dy}px)`;
        moverRef.current.style.opacity = String(Math.min(1, travel * 12) * (1 - refilled));
      }
      put(refillRef.current, SLOTS * 3 + 8, refilled);
    }

    // The rest of the list closes up behind it.
    for (let i = 0; i < 2; i += 1) {
      const el = waitRefs.current[i];
      const shift = travel * (SLOT_H + SLOT_GAP + 6);
      const sq = Math.round(shift * 10) / 10;
      if (el && c[SLOTS * 3 + 2 + i] !== sq) {
        c[SLOTS * 3 + 2 + i] = sq;
        el.style.transform = `translateY(${-sq}px)`;
      }
    }

    const totals = [confirmed, emptied > 0.5 && refilled < 0.5 ? 1 : 0, refilled > 0.5 ? 1 : 0];
    for (let i = 0; i < 3; i += 1) {
      const el = readRefs.current[i];
      const v = totals[i]!;
      if (el && c[SLOTS * 3 + 4 + i] !== v) {
        c[SLOTS * 3 + 4 + i] = v;
        el.textContent = String(v);
      }
    }
  });

  return (
    <div ref={hostRef}>
      <SceneFrame
        label="One day on the schedule"
        onReadout={(el, i) => {
          readRefs.current[i] = el;
        }}
        readouts={[
          { key: 'Confirmed ahead', value: String(AT_RISK.length - 1) },
          { key: 'Booked out anyway', value: '1' },
          { key: 'Refilled from the list', value: '1', tone: 'signal' },
        ]}
        note="Illustrative of the shape of a day, not a measurement. Twelve half-hour slots from 08:00. A slot flagged at risk is one where the confirmation has not come back."
      >
        <svg
          className="mplot"
          viewBox="0 0 400 214"
          role="img"
          aria-label="A day of twelve appointment slots. Four are flagged as at risk because no confirmation has come back, and are then confirmed. One books out anyway, leaving the slot open, and the first record on the waiting list moves across to fill it."
        >
          <text className="mplot__axis" x={SLOT_X} y={16}>
            Today
          </text>
          <text className="mplot__axis" x={WAIT_X} y={16}>
            Waiting list
          </text>

          {Array.from({ length: SLOTS }, (_, i) => (
            <g key={i}>
              <text
                className="mplot__axis"
                x={SLOT_X - 8}
                y={slotY(i) + SLOT_H - 3}
                textAnchor="end"
              >
                {time(i)}
              </text>
              {/* The track a slot sits in, always visible. */}
              <rect
                className="mplot__slot"
                x={SLOT_X}
                y={slotY(i)}
                width={SLOT_W}
                height={SLOT_H}
                rx={2.5}
              />
              <rect
                ref={(el) => {
                  bookedRefs.current[i] = el;
                }}
                className="mplot__booked"
                x={SLOT_X}
                y={slotY(i)}
                width={SLOT_W}
                height={SLOT_H}
                rx={2.5}
                style={{ opacity: AT_RISK.includes(i) ? 0 : 1 }}
              />
              {AT_RISK.includes(i) ? (
                <>
                  <rect
                    ref={(el) => {
                      riskRefs.current[i] = el;
                    }}
                    className="mplot__risk"
                    x={SLOT_X + 0.5}
                    y={slotY(i) + 0.5}
                    width={SLOT_W - 1}
                    height={SLOT_H - 1}
                    rx={2.5}
                    style={{ opacity: 0 }}
                  />
                  <rect
                    ref={(el) => {
                      heldRefs.current[i] = el;
                    }}
                    className="mplot__held"
                    x={SLOT_X}
                    y={slotY(i)}
                    width={SLOT_W}
                    height={SLOT_H}
                    rx={2.5}
                    style={{ opacity: i === CANCELS ? 0 : 1 }}
                  />
                </>
              ) : null}
            </g>
          ))}

          {/* The gap left behind, between cancellation and backfill. */}
          <rect
            ref={openRef}
            className="mplot__open"
            x={SLOT_X + 0.5}
            y={slotY(CANCELS) + 0.5}
            width={SLOT_W - 1}
            height={SLOT_H - 1}
            rx={2.5}
            style={{ opacity: 0 }}
          />

          {/* The slot once the waiting-list record has landed in it. */}
          <rect
            ref={refillRef}
            className="mplot__held"
            x={SLOT_X}
            y={slotY(CANCELS)}
            width={SLOT_W}
            height={SLOT_H}
            rx={2.5}
            style={{ opacity: 1 }}
          />

          {/* The waiting list. The top record is the one that moves. */}
          <g
            ref={moverRef}
            /* Settled state: the record has already handed over to the
               full-width fill, so the travelling card itself is gone. */
            style={{
              transform: `translate(${SLOT_X + SLOT_W - 52 - WAIT_X}px, ${slotY(CANCELS) - TOP}px)`,
              opacity: 0,
            }}
          >
            <rect className="mplot__held" x={WAIT_X} y={TOP} width={52} height={SLOT_H} rx={2.5} />
          </g>
          {[0, 1].map((i) => (
            <g
              key={i}
              ref={(el) => {
                waitRefs.current[i] = el;
              }}
              style={{ transform: `translateY(${-(SLOT_H + SLOT_GAP + 6)}px)` }}
            >
              <rect
                className="mplot__wait"
                x={WAIT_X}
                y={TOP + (i + 1) * (SLOT_H + SLOT_GAP + 6)}
                width={WAIT_W}
                height={SLOT_H}
                rx={2.5}
              />
            </g>
          ))}
        </svg>
      </SceneFrame>
    </div>
  );
}
