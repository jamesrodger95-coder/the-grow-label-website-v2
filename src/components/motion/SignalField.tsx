import type { CSSProperties } from 'react';
import { PointerSignals } from './PointerSignals';

/**
 * The hero's scattered revenue signals.
 *
 * Server-rendered and decorative. The entrance is a pure CSS animation, so the
 * hero paints complete with no JavaScript on the critical path; the only client
 * code is the small pointer-proximity enhancement, which does nothing until it
 * loads and nothing at all on touch or under reduced motion.
 *
 * Positions sit in the corridor between the headline and the capacity column,
 * so the marks never collide with either. Widths and opacities vary because the
 * point is that real signals arrive at different strengths.
 */

type Mark = {
  /** Percentage position within the field. */
  left: number;
  top: number;
  width: number;
  opacity: number;
  /** Horizontal offset the mark travels from as it consolidates. */
  drift: number;
};

const MARKS: Mark[] = [
  { left: 51, top: 14, width: 46, opacity: 0.3, drift: -30 },
  { left: 60, top: 24, width: 62, opacity: 0.44, drift: 34 },
  { left: 54, top: 35, width: 38, opacity: 0.34, drift: -20 },
  { left: 64, top: 45, width: 70, opacity: 0.58, drift: 26 },
  { left: 56, top: 55, width: 50, opacity: 0.38, drift: -34 },
  { left: 66, top: 65, width: 42, opacity: 0.6, drift: 20 },
  { left: 58, top: 76, width: 58, opacity: 0.32, drift: -26 },
  { left: 50, top: 86, width: 34, opacity: 0.26, drift: 22 },
];

export function SignalField() {
  return (
    <div className="signalfield" aria-hidden="true">
      <div className="signalfield__grid" />
      {MARKS.map((mark, i) => (
        <span
          key={`${mark.left}-${mark.top}`}
          data-mark=""
          className="signalfield__mark"
          style={
            {
              left: `${mark.left}%`,
              top: `${mark.top}%`,
              width: mark.width,
              '--o': mark.opacity,
              '--dx': `${mark.drift}px`,
              '--i': i,
            } as CSSProperties
          }
        />
      ))}
      <PointerSignals />
    </div>
  );
}
