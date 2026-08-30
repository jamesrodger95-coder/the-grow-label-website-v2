'use client';

import { useCallback, useState, type CSSProperties } from 'react';
import { usePrefersReducedMotion } from './useInView';

/**
 * Isolated harness for the motion language. Each verb can be replayed on demand
 * so a regression is visible without scrolling the whole site.
 */

const MARKS = [
  { left: 6, top: 14, width: 44 },
  { left: 34, top: 30, width: 62 },
  { left: 14, top: 48, width: 38 },
  { left: 52, top: 62, width: 70 },
  { left: 28, top: 78, width: 50 },
];

const STAGES = [
  { name: 'Estimated', width: 100 },
  { name: 'Booked', width: 74 },
  { name: 'Attended', width: 62 },
  { name: 'Collected', width: 55 },
];

export function MotionLab() {
  const reduced = usePrefersReducedMotion();
  const [nonce, setNonce] = useState(0);
  const [playing, setPlaying] = useState(true);
  const replay = useCallback(() => setNonce((n) => n + 1), []);

  return (
    <div>
      <div
        style={{
          display: 'flex',
          gap: 14,
          flexWrap: 'wrap',
          alignItems: 'center',
          marginBottom: 40,
        }}
      >
        <button className="btn" type="button" onClick={replay}>
          Replay all
          <span className="btn__arrow" aria-hidden="true">
            &rarr;
          </span>
        </button>
        <button className="btn btn--ghost" type="button" onClick={() => setPlaying((p) => !p)}>
          {playing ? 'Show start state' : 'Show end state'}
          <span className="btn__arrow" aria-hidden="true">
            &rarr;
          </span>
        </button>
        <p className="micro" role="status">
          {reduced
            ? 'prefers-reduced-motion is on: every verb renders its authored end state.'
            : 'prefers-reduced-motion is off.'}
        </p>
      </div>

      <div className="dev-grid" key={nonce}>
        {/* Rise — prose and controls ------------------------------------------- */}
        <div className="dev-panel">
          <p className="label label--accent" style={{ marginBottom: 12 }}>
            Verb 01 — Detect
          </p>
          <div
            style={{
              position: 'relative',
              height: 150,
              marginBottom: 16,
              background: 'var(--gl-mist)',
              overflow: 'hidden',
            }}
          >
            {MARKS.map((m, i) => (
              <span
                key={i}
                className="m-rise"
                data-inview={playing ? 'true' : 'false'}
                style={
                  {
                    position: 'absolute',
                    left: `${m.left}%`,
                    top: `${m.top}%`,
                    width: m.width,
                    height: 2,
                    background: 'var(--gl-purple)',
                    '--i': i,
                  } as CSSProperties
                }
              />
            ))}
          </div>
          <p className="micro">
            Opacity 0→1 with a 10px rise, 45ms stagger, 680ms ease-out. Marks appear where they
            already are.
          </p>
        </div>

        {/* Verb 02 — Reveal ------------------------------------------- */}
        <div className="dev-panel">
          <p className="label label--accent" style={{ marginBottom: 12 }}>
            Wipe — rows and tables
          </p>
          <div
            style={{
              height: 150,
              marginBottom: 16,
              padding: 16,
              background: 'var(--gl-mist)',
              display: 'grid',
              alignContent: 'center',
              overflow: 'hidden',
            }}
          >
            {['Revenue that', 'should have been', 'captured.'].map((line, i) => (
              <span
                key={line}
                className="m-wipe display"
                data-inview={playing ? 'true' : 'false'}
                style={{ fontSize: 26, '--i': i } as CSSProperties}
              >
                {line}
              </span>
            ))}
          </div>
          <p className="micro">clip-path inset per line, 70ms stagger, 680ms ease-settle.</p>
        </div>

        {/* Parallax and drift --------------------------------------- */}
        <div className="dev-panel">
          <p className="label label--accent" style={{ marginBottom: 12 }}>
            Verb 02 — Consolidate
          </p>
          <div
            style={{
              position: 'relative',
              height: 150,
              marginBottom: 16,
              background: 'var(--gl-mist)',
              overflow: 'hidden',
            }}
          >
            {MARKS.map((m, i) => (
              <span
                key={i}
                style={
                  {
                    position: 'absolute',
                    left: playing ? '30%' : `${m.left}%`,
                    top: `${14 + i * 18}%`,
                    width: playing ? 90 : m.width,
                    height: 2,
                    background: 'var(--gl-purple)',
                    opacity: playing ? 0.85 : 0.35,
                    transition:
                      'left var(--gl-dur-scene) var(--gl-ease-settle), width var(--gl-dur-scene) var(--gl-ease-settle), opacity var(--gl-dur-slow) var(--gl-ease-out)',
                    transitionDelay: `${i * 60}ms`,
                  } as CSSProperties
                }
              />
            ))}
          </div>
          <p className="micro">
            Marks migrate to one column and equalise. 1100ms ease-settle, staggered.
          </p>
        </div>

        {/* Stage bars -------------------------------------------- */}
        <div className="dev-panel">
          <p className="label label--accent" style={{ marginBottom: 12 }}>
            Verb 03 — Settle
          </p>
          <div
            style={{
              height: 150,
              marginBottom: 16,
              padding: 16,
              background: 'var(--gl-mist)',
              display: 'grid',
              alignContent: 'center',
              gap: 10,
            }}
          >
            <div className="stagebar" data-inview={playing ? 'true' : 'false'}>
              {STAGES.map((s, i) => (
                <div className="stagebar__row" key={s.name} style={{ paddingBlock: 6 }}>
                  <span className="stagebar__name">{s.name}</span>
                  <span className="stagebar__track">
                    <span
                      className="stagebar__fill"
                      style={
                        {
                          '--w': `${s.width}%`,
                          '--c': `var(--stage-${i + 1})`,
                          '--i': i,
                        } as CSSProperties
                      }
                    />
                  </span>
                  <span className="stagebar__fig">{`${s.width}%`}</span>
                </div>
              ))}
            </div>
          </div>
          <p className="micro">scaleX from the left, 130ms stagger, 1100ms ease-settle.</p>
        </div>

        {/* Rule draw ---------------------------------------------------- */}
        <div className="dev-panel">
          <p className="label label--accent" style={{ marginBottom: 12 }}>
            Rule draw
          </p>
          <div
            style={{
              height: 150,
              marginBottom: 16,
              padding: 16,
              background: 'var(--gl-mist)',
              display: 'grid',
              alignContent: 'center',
              gap: 18,
            }}
          >
            {[0, 1, 2, 3].map((i) => (
              <span
                key={i}
                className="m-rule"
                data-inview={playing ? 'true' : 'false'}
                style={{ height: 1, background: 'var(--gl-edge)', '--i': i } as CSSProperties}
              />
            ))}
          </div>
          <p className="micro">scaleX 0→1 from the leading edge, 45ms stagger.</p>
        </div>

        {/* Button wipe -------------------------------------------------- */}
        <div className="dev-panel">
          <p className="label label--accent" style={{ marginBottom: 12 }}>
            Control feedback
          </p>
          <div
            style={{
              height: 150,
              marginBottom: 16,
              padding: 16,
              background: 'var(--gl-mist)',
              display: 'grid',
              alignContent: 'center',
              justifyItems: 'start',
              gap: 14,
            }}
          >
            <button className="btn" type="button">
              Hover or focus me
              <span className="btn__arrow" aria-hidden="true">
                &rarr;
              </span>
            </button>
            <button className="btn btn--ghost" type="button">
              Ghost variant
              <span className="btn__arrow" aria-hidden="true">
                &rarr;
              </span>
            </button>
          </div>
          <p className="micro">
            Wipe fires on hover and on focus-visible, so keyboard users get the same feedback.
          </p>
        </div>
      </div>
    </div>
  );
}
