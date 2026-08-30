'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { usePrefersReducedMotion } from './useInView';

/**
 * The signature sequence.
 *
 * A single set of eight marks transforms through four states as the reader
 * scrolls past a tall section: scattered signals become an aligned queue, and
 * the queue resolves into the four-stage value staircase.
 *
 * Native scrolling is untouched — there is no pinning library and no scroll
 * hijack. The section is simply tall, the stage is `position: sticky`, and a
 * rAF-throttled scroll read maps the section's position to a state index. The
 * listener is attached only while the section is on screen.
 */

type MarkState = {
  x: number;
  y: number;
  w: number;
  h: number;
  o: number;
  /** Which stage colour token to use, 1–4. Undefined keeps the neutral tone. */
  stage?: 1 | 2 | 3 | 4;
};

const SCATTERED: MarkState[] = [
  { x: 14, y: 12, w: 14, h: 2.5, o: 0.22 },
  { x: 62, y: 25, w: 10, h: 2.5, o: 0.34 },
  { x: 132, y: 9, w: 16, h: 2.5, o: 0.2 },
  { x: 38, y: 45, w: 12, h: 2.5, o: 0.4 },
  { x: 96, y: 60, w: 14, h: 2.5, o: 0.26 },
  { x: 158, y: 37, w: 11, h: 2.5, o: 0.44 },
  { x: 74, y: 75, w: 15, h: 2.5, o: 0.24 },
  { x: 118, y: 50, w: 9, h: 2.5, o: 0.3 },
];

const QUEUED: MarkState[] = Array.from({ length: 8 }, (_, i) => ({
  x: 70,
  y: 8 + i * 9.5,
  w: 60,
  h: 2.5,
  o: 0.78,
}));

const BAR_WIDTHS = [160, 118, 99, 88];

const STAIRCASE: MarkState[] = Array.from({ length: 8 }, (_, i) => {
  if (i < 4) {
    return {
      x: 20,
      y: 10 + i * 18,
      w: BAR_WIDTHS[i] ?? 88,
      h: 11,
      o: 1,
      stage: (i + 1) as 1 | 2 | 3 | 4,
    };
  }
  // The remaining marks fold into the bar above them and fade out.
  const target = 10 + (i - 4) * 18;
  return { x: 20, y: target, w: BAR_WIDTHS[i - 4] ?? 88, h: 11, o: 0 };
});

const STATES: MarkState[][] = [SCATTERED, QUEUED, STAIRCASE, STAIRCASE];

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

export function RecoverySequence() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const reduced = usePrefersReducedMotion();
  // Start at the final state so a non-hydrated or reduced-motion render is
  // complete and correct.
  const [state, setState] = useState(FRAMES.length - 1);
  const [live, setLive] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || reduced) return;

    let frame = 0;
    let attached = false;

    const read = () => {
      frame = 0;
      const rect = section.getBoundingClientRect();
      const travel = rect.height - window.innerHeight;
      if (travel <= 0) return;
      const progress = Math.min(1, Math.max(0, -rect.top / travel));
      // Four equal bands. The last band is generous so the final state holds.
      const next = progress < 0.22 ? 0 : progress < 0.46 ? 1 : progress < 0.7 ? 2 : 3;
      setState((current) => (current === next ? current : next));
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(read);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        if (entry.isIntersecting && !attached) {
          attached = true;
          setLive(true);
          window.addEventListener('scroll', onScroll, { passive: true });
          read();
        } else if (!entry.isIntersecting && attached) {
          attached = false;
          window.removeEventListener('scroll', onScroll);
        }
      },
      { rootMargin: '10% 0px 10% 0px' }
    );

    observer.observe(section);
    const resize = new ResizeObserver(() => {
      if (attached) read();
    });
    resize.observe(section);

    return () => {
      observer.disconnect();
      resize.disconnect();
      window.removeEventListener('scroll', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [reduced]);

  // Before the observer fires, show the first frame so the sequence has
  // somewhere to travel from; reduced motion keeps the completed final state.
  const active = reduced ? FRAMES.length - 1 : live ? state : 0;
  const marks = STATES[active] ?? STAIRCASE;
  const showMarker = active >= 3;
  const frame = FRAMES[active] ?? FRAMES[FRAMES.length - 1]!;

  return (
    <div className="sequence" ref={sectionRef}>
      <div className="sequence__stage">
        <div className="two-col">
          <div>
            <p className="label label--accent" style={{ marginBottom: 18 }}>
              {`0${active + 1} / 04 · ${frame.step}`}
            </p>
            <h3 className="display d3" style={{ marginBottom: 18, maxWidth: '18ch' }}>
              {frame.title}
            </h3>
            <p className="small" style={{ maxWidth: '46ch' }} aria-live="polite">
              {frame.body}
            </p>
          </div>

          <div>
            <svg
              className="seqart"
              viewBox="0 0 200 88"
              role="img"
              aria-label="Scattered revenue signals consolidating into a queue and resolving into a four-stage value staircase: estimated, booked, attended, collected."
            >
              {marks.map((mark, i) => (
                <rect
                  key={i}
                  x={mark.x}
                  y={mark.y}
                  width={mark.w}
                  height={mark.h}
                  rx={1}
                  opacity={mark.o}
                  fill={mark.stage ? `var(--gl-stage-${mark.stage})` : 'var(--gl-signal)'}
                  style={{ transitionDelay: `${i * 45}ms` }}
                />
              ))}
              <line
                x1="108"
                y1="10"
                x2="108"
                y2="84"
                stroke="var(--gl-signal)"
                strokeWidth="0.8"
                strokeDasharray="2 3"
                opacity={showMarker ? 0.8 : 0}
                style={{ transition: 'opacity var(--gl-dur-slow) var(--gl-ease-out)' }}
              />
            </svg>
            <p className="micro" style={{ marginTop: 14 }}>
              Illustrative of the shape of the staircase. Proportions are not a benchmark and no
              client data appears on this website.
            </p>
          </div>
        </div>

        <ol className="sequence__rail">
          {FRAMES.map((f, i) => (
            <li
              className="sequence__step"
              key={f.step}
              data-active={i === active ? 'true' : 'false'}
              style={{ '--i': i } as CSSProperties}
            >
              <span className="label" style={{ display: 'block', marginBottom: 8 }}>
                {`0${i + 1}`}
              </span>
              <span className="label sequence__stepname">{f.step}</span>
            </li>
          ))}
        </ol>
      </div>
      <div className="sequence__spacer" aria-hidden="true" />
    </div>
  );
}
