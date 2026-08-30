'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { usePrefersReducedMotion } from '@/components/motion/useInView';

/**
 * The hero's signature animation.
 *
 * A field of small marks stands for the contact events a practice already
 * generates. A sweep crosses it; each mark it reaches lengthens and turns from
 * grey to purple — detected. Underneath, the four value stages fill in
 * sequence, and only the last one is money. That is the whole product argument
 * in one loop: fragmented demand, detected, then verified stage by stage.
 *
 * The entire loop is CSS. Each mark's `animation-delay` is derived from its
 * column, which is what produces the sweep without a single frame of
 * JavaScript — so the hero paints complete and the animation costs nothing on
 * the critical path.
 *
 * The only script is a pointer tilt on large screens, which nudges the panel a
 * degree or two toward the cursor.
 */

const COLS = 14;
const ROWS = 8;
const MOBILE_COLS = 9;
const MOBILE_ROWS = 6;

/** Marks that stay grey: the demand this pass did not reach. */
const MISSED = new Set([3, 11, 19, 26, 34, 41, 52, 58, 67, 73, 84, 91, 99, 106]);

const STAGES = [
  { name: 'Estimated', width: '100%', value: '100', tone: 'var(--gl-stage-1)' },
  { name: 'Booked', width: '74%', value: '74', tone: 'var(--gl-stage-2)' },
  { name: 'Attended', width: '61%', value: '61', tone: 'var(--gl-stage-3)' },
  { name: 'Collected', width: '52%', value: '52', tone: 'var(--gl-stage-4)' },
];

export function RecoveryField() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [compact, setCompact] = useState(false);
  const reduced = usePrefersReducedMotion();

  // Fewer marks on small screens: same idea, a fraction of the elements.
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 640px)');
    const sync = () => setCompact(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  // Pointer tilt, desktop only.
  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;
    if (!window.matchMedia('(min-width: 1024px) and (pointer: fine)').matches) return;

    let frame = 0;
    let pending: { x: number; y: number } | null = null;

    const apply = () => {
      frame = 0;
      if (!pending) return;
      const rect = el.getBoundingClientRect();
      const dx = (pending.x - (rect.left + rect.width / 2)) / rect.width;
      const dy = (pending.y - (rect.top + rect.height / 2)) / rect.height;
      el.style.setProperty('--tilt-x', `${(-dy * 3).toFixed(2)}deg`);
      el.style.setProperty('--tilt-y', `${(dx * 4).toFixed(2)}deg`);
    };

    const onMove = (event: PointerEvent) => {
      pending = { x: event.clientX, y: event.clientY };
      if (!frame) frame = requestAnimationFrame(apply);
    };
    const reset = () => {
      el.style.setProperty('--tilt-x', '0deg');
      el.style.setProperty('--tilt-y', '0deg');
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerleave', reset);
    return () => {
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerleave', reset);
      if (frame) cancelAnimationFrame(frame);
      reset();
    };
  }, [reduced]);

  const cols = compact ? MOBILE_COLS : COLS;
  const rows = compact ? MOBILE_ROWS : ROWS;
  const total = cols * rows;

  return (
    <div
      className="field"
      ref={ref}
      style={
        {
          '--cols': cols,
          transform:
            'perspective(1400px) rotateX(var(--tilt-x, 0deg)) rotateY(var(--tilt-y, 0deg)) translate3d(0, var(--field-y, 0px), 0)',
          transition: 'transform 500ms cubic-bezier(0.22, 1, 0.36, 1)',
        } as CSSProperties
      }
    >
      <div className="field__head">
        <span className="field__live">
          <span className="field__dot" aria-hidden="true" />
          Signal detection
        </span>
        <span className="field__count">
          {total - Math.round(total * 0.12)} of {total} reached
        </span>
      </div>

      <div className="field__grid" aria-hidden="true">
        {Array.from({ length: total }, (_, i) => {
          const col = i % cols;
          const missed = MISSED.has(i);
          return (
            <span
              key={i}
              className={missed ? 'field__tick field__tick--miss' : 'field__tick'}
              style={{ '--c': col } as CSSProperties}
            />
          );
        })}
        <span className="field__sweep" />
      </div>

      <div className="field__foot">
        <div className="field__stages">
          {STAGES.map((stage, i) => (
            <div className="field__stage" key={stage.name}>
              <span className="field__stagename">{stage.name}</span>
              <span className="field__stagetrack">
                <span
                  className="field__stagefill"
                  style={{ '--w': stage.width, '--c': stage.tone, '--i': i } as CSSProperties}
                />
              </span>
              <span className="field__stageval">{stage.value}</span>
            </div>
          ))}
        </div>
        <p className="field__note">
          Illustrative of the shape a recovery report takes. Index values, not currency, and not a
          client figure.
        </p>
      </div>

      <p className="gl-sr">
        An animated diagram: contact events are detected across a field, then value is reported at
        four separate stages — estimated, booked, attended and collected — each smaller than the one
        above it.
      </p>
    </div>
  );
}
