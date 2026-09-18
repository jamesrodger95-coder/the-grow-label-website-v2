import type { CSSProperties } from 'react';
import { JOURNEY } from '@/content/calculator';

/**
 * THE JOURNEY — the calculator page's opening device.
 *
 * Three steps on one rail: the questions, the call, the assessment. It exists
 * because the cold email that brings people here promises a detailed revenue
 * assessment, and what this page opens with is a questionnaire. Without the
 * shape drawn out, the reader's first thought is that the two do not match.
 * With it, the questionnaire reads as the first move in something rather than
 * as a substitute for it.
 *
 * ---------------------------------------------------------------------------
 * HOW IT MOVES
 * ---------------------------------------------------------------------------
 * The same arrangement as the modules relay, and for the same reasons. A
 * server component: every beat is a CSS animation whose delay comes from the
 * step's own index, so the largest thing on the page costs no JavaScript, no
 * state and no bundle.
 *
 * Everything is authored in its FINAL state — all three steps lit, the rail
 * drawn full width — and the loop applies only under `[data-motion="on"]`. A
 * blocked bundle leaves three complete, readable steps rather than three empty
 * outlines waiting for a pulse that never arrives.
 *
 * One curve, one duration. The whole thing runs on `--gl-dur-ambient`, the only
 * duration allowed to loop, and each step's delay is that duration divided by
 * three rather than a number typed in. The verbs are draw (the rail) and
 * response (the step lighting). Nothing new.
 */
export function Journey() {
  return (
    <div className="journey">
      <p className="label journey__label">{JOURNEY.label}</p>

      {/* The rail. Drawn from the leading edge, with a pulse that runs its
          length once per loop and lights each step as it passes. */}
      <div className="journey__rail" aria-hidden="true">
        <span className="journey__line" />
        <span className="journey__pulse" />
      </div>

      <ol className="journey__steps">
        {JOURNEY.steps.map((step, i) => (
          <li className="jstep" key={step.index} style={{ '--s': i } as CSSProperties}>
            <span className="jstep__node" aria-hidden="true">
              <span className="jstep__nodedot" />
            </span>

            <span className="jstep__when">{step.when}</span>
            <span className="jstep__head">
              <span className="jstep__idx">{step.index}</span>
              <h2 className="jstep__name">{step.name}</h2>
            </span>
            <p className="jstep__detail">{step.detail}</p>
          </li>
        ))}
      </ol>

      <p className="micro journey__foot">{JOURNEY.foot}</p>
    </div>
  );
}
