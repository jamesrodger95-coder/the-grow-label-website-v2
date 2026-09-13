'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { usePrefersReducedMotion } from '@/components/motion/useInView';

/**
 * The hero's signature panel.
 *
 * A practice day schedule — the one artifact a practice owner or operations
 * manager looks at every day. Three ghosted slots fill with recovered
 * appointments once, staggered, when the panel comes on screen, and the
 * counter ticks up as each one lands. Then everything is static. Purple means
 * one thing on this page: revenue that came back.
 *
 * Underneath, the four value stages, unchanged.
 *
 * Motion is CSS transitions driven by a single `is-live` class, using the house
 * easing and duration tokens. The only script is an IntersectionObserver that
 * flips the class (so nothing plays off-screen), a ResizeObserver that drops to
 * two providers when the panel is narrow, and the existing pointer tilt.
 *
 * ---------------------------------------------------------------------------
 * THE NO-JAVASCRIPT STATE
 * ---------------------------------------------------------------------------
 * Rule 4 of this codebase: every animated element renders in its FINAL state by
 * default, and motion is opted into after first paint. So the arrangement here
 * is inverted from the obvious one.
 *
 * The recovered appointments are painted, and the counter reads its finished
 * total, until `armed` becomes true — which only happens inside an effect, so
 * only when React is actually running. A blocked bundle therefore leaves the
 * schedule complete with all three recoveries in it and the count correct,
 * rather than three empty dashed outlines and a number three short.
 *
 * `armed` flipping resets the count to its pre-recovery value a beat before the
 * observer fires, which is what makes the tick-up read as a tick-up rather than
 * as a correction.
 */

const SLOT = 12; // px per 15 minutes
const VIEW_SLOTS = 19; // 8:00 → 12:45 visible; the afternoon sits below the scroll line
const STAGGER_MS = 220;
const RECOVERIES = 3;

type State = 'conf' | 'unconf' | 'canc' | 'rec';
type Appt = [start: number, end: number, type: string, state: State]; // minutes from 8:00

const COLUMNS: { name: string; room: string; appts: Appt[] }[] = [
  {
    name: 'Dr KM',
    room: 'Surgery 1',
    appts: [
      [0, 30, 'Consult', 'conf'],
      [30, 120, 'Crown prep', 'conf'],
      [135, 150, 'Follow-up', 'unconf'],
      [165, 225, 'Dental', 'rec'],
      [240, 270, 'Consult', 'conf'],
      [285, 375, 'Crown prep', 'conf'],
    ],
  },
  {
    name: 'Dr AP',
    room: 'Surgery 2',
    appts: [
      [15, 30, 'Vaccination', 'conf'],
      [30, 60, 'Vaccination', 'conf'],
      [80, 140, 'Dental', 'unconf'],
      [165, 195, 'Consult', 'canc'],
      [210, 270, 'Follow-up', 'rec'],
    ],
  },
  {
    name: 'Hyg SR',
    room: 'Op 3',
    appts: [
      [0, 45, 'Hygiene', 'conf'],
      [45, 90, 'Hygiene', 'conf'],
      [105, 150, 'Hygiene', 'unconf'],
      [180, 225, 'Hygiene', 'rec'],
      [240, 300, 'Hygiene', 'conf'],
    ],
  },
  {
    name: 'RVN JL',
    room: 'Op 4',
    appts: [
      [30, 45, 'Vaccination', 'conf'],
      [60, 75, 'Follow-up', 'conf'],
      [90, 120, 'Consult', 'conf'],
      [195, 225, 'Vaccination', 'canc'],
      [255, 285, 'Consult', 'unconf'],
    ],
  },
];
const COMPACT_COLUMNS = [COLUMNS[0]!, COLUMNS[2]!];
const RECOVERED_BASE = 3; // already recovered this week before the three that land
const HOURS = [0, 60, 120, 180, 240];
const NOW_MIN = 160; // 10:40 — the today line

const STAGES = [
  { name: 'Estimated', width: '100%', value: '100', tone: 'var(--gl-stage-1)' },
  { name: 'Booked', width: '74%', value: '74', tone: 'var(--gl-stage-2)' },
  { name: 'Attended', width: '61%', value: '61', tone: 'var(--gl-stage-3)' },
  { name: 'Collected', width: '52%', value: '52', tone: 'var(--gl-stage-4)' },
];

const fmt = (m: number) => {
  const h = 8 + Math.floor(m / 60);
  const mm = m % 60;
  return `${h}:${mm < 10 ? '0' + mm : mm}`;
};

export function RecoveryField() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [compact, setCompact] = useState(false);
  const [armedState, setArmed] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [counted, setCounted] = useState(0);
  const reduced = usePrefersReducedMotion();

  // Reduced motion is derived, not stored. Writing the end state into three
  // pieces of state from inside an effect is a cascading render, and the
  // answer is the same one every time: there is nothing to arm, the panel is
  // already live, and all three recoveries have landed.
  const armed = !reduced && armedState;
  const live = reduced || playing;
  const landed = reduced ? RECOVERIES : counted;

  // Two providers when the panel itself is narrow, not the viewport.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      if (entry) setCompact(entry.contentRect.width < 480);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Play once, only when the panel is on screen. Under reduced motion there is
  // nothing to schedule — the end state is derived above.
  useEffect(() => {
    if (reduced) return;
    const el = ref.current;
    if (!el) return;
    const timers: number[] = [];
    // Arming is what hands the final state over to the animation: the count
    // drops back to its pre-recovery value at the same moment the CSS pulls
    // the blocks to transparent. Until this runs — bundle blocked, hydration
    // failed — the panel stays finished.
    //
    // Two frames, matching MotionProvider, because that is when
    // `data-motion="on"` lands. Arming earlier would show the count at three
    // while the blocks were still painted, for the couple of frames between.
    let first = 0;
    let second = 0;
    first = requestAnimationFrame(() => {
      second = requestAnimationFrame(() => setArmed(true));
    });
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        timers.push(
          window.setTimeout(() => {
            setPlaying(true);
            for (let i = 0; i < RECOVERIES; i++) {
              timers.push(window.setTimeout(() => setCounted(i + 1), 420 + i * STAGGER_MS));
            }
          }, 500)
        );
      },
      { threshold: 0.35 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      timers.forEach(clearTimeout);
      cancelAnimationFrame(first);
      if (second) cancelAnimationFrame(second);
    };
  }, [reduced]);

  // Pointer tilt, desktop only. Unchanged.
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

  const columns = compact ? COMPACT_COLUMNS : COLUMNS;
  // Before arming, the count reads its finished total — see the note above.
  const recovered = RECOVERED_BASE + (armed ? landed : RECOVERIES);
  let recIndex = 0;

  return (
    <div
      className={`field${live ? ' is-live' : ''}${reduced ? ' is-instant' : ''}`}
      ref={ref}
      style={
        {
          '--slot': `${SLOT}px`,
          '--view-h': `${VIEW_SLOTS * SLOT}px`,
          transform:
            'perspective(1400px) rotateX(var(--tilt-x, 0deg)) rotateY(var(--tilt-y, 0deg))',
          transition: 'transform var(--gl-dur-orchestrated) var(--gl-ease)',
        } as CSSProperties
      }
    >
      <div className="field__head">
        <span className="field__nav">
          <span className="field__navbtn" aria-hidden="true">
            &lsaquo;
          </span>
          <span className="field__navbtn" aria-hidden="true">
            &rsaquo;
          </span>
          <span className="field__date">Tue 15 Sep</span>
          {!compact && <span className="field__view">Day · {columns.length} providers</span>}
        </span>
        <span className="field__count">
          <span className="field__dot" aria-hidden="true" />
          {recovered} recovered this week
        </span>
      </div>

      <div className="sched" aria-hidden="true">
        <div className="sched__cols">
          <span className="sched__gutter" />
          {columns.map((c) => (
            <span className="sched__col" key={c.name}>
              <b>{c.name}</b>
              {!compact && <span>{c.room}</span>}
            </span>
          ))}
        </div>

        <div className="sched__grid">
          {HOURS.map((m) => (
            <span
              className="sched__hour"
              key={m}
              style={{ '--y': `${(m / 15) * SLOT}px` } as CSSProperties}
            >
              {fmt(m)}
            </span>
          ))}
          {Array.from({ length: VIEW_SLOTS - 1 }, (_, i) => (i + 1) * 15)
            .filter((m) => m % 60)
            .map((m) => (
              <span
                className={m % 30 ? 'sched__rule sched__rule--q' : 'sched__rule'}
                key={m}
                style={{ '--y': `${(m / 15) * SLOT}px` } as CSSProperties}
              />
            ))}

          <div className="sched__lanes">
            {columns.map((c) => (
              <div className="sched__lane" key={c.name}>
                {c.appts.map(([s, e, type, st]) => {
                  const style = {
                    '--top': `${(s / 15) * SLOT + 1}px`,
                    '--h': `${((e - s) / 15) * SLOT - 2}px`,
                  } as CSSProperties;
                  const short = e - s < 30 ? ' appt--short' : '';
                  if (st !== 'rec') {
                    return (
                      <span className={`appt appt--${st}${short}`} key={s} style={style}>
                        <b>{fmt(s)}</b> <span>{type}</span>
                      </span>
                    );
                  }
                  const i = recIndex++;
                  return (
                    <span key={s}>
                      <span className="appt appt--ghost" style={style} />
                      <span
                        className={`appt appt--rec${short}`}
                        style={{ ...style, '--i': i } as CSSProperties}
                      >
                        <b>{fmt(s)}</b> <span>{type}</span>
                        <em className="appt__tag">Recovered</em>
                      </span>
                    </span>
                  );
                })}
              </div>
            ))}
          </div>

          <span
            className="sched__now"
            style={{ '--y': `${(NOW_MIN / 15) * SLOT}px` } as CSSProperties}
          />
        </div>
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
          Illustrative of the shape a day and a recovery report take. Example appointments and index
          values, not currency, not patients, and not a client figure.
        </p>
      </div>

      <p className="gl-sr">
        A practice day schedule in which three missed appointments return as recovered bookings,
        then value is reported at four separate stages, estimated then booked then attended then
        collected, each smaller than the one above it.
      </p>
    </div>
  );
}
