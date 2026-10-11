'use client';

import Image from 'next/image';
import { useEffect, useId, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react';
import { useHasMounted, usePrefersReducedMotion } from '@/components/motion/useInView';
import { useScene } from '@/components/modules/scene/useScene';
import { STUDIO_INDUSTRIES, type Industry } from '@/content/studio';
import { LoopVideo } from './WorkGallery';

/**
 * Whatever you sell: one studio, six businesses.
 *
 * On a wide screen the section is tall and its stage is sticky, so scrolling
 * through it steps from one industry to the next. Each step types out an
 * example brief and then draws the outputs it would produce, joined to the
 * brief by lines. The tabs jump straight to a step. Nothing is hijacked: the
 * page scrolls at its own pace and the step follows the scroll position, read
 * at paint time by the shared scene ticker.
 *
 * On a phone, or with reduced motion, there is no sticky travel; the tabs
 * simply switch. With scripts blocked, every industry is listed in full.
 */

export type IndustryMedia = { src: string; poster?: string; kind: 'video' | 'image' };

const STEP_VH = 70;
const TYPE_MS = 24;

function ratioValue(r: string): number {
  const [w, h] = r.split(':').map(Number);
  return (w ?? 1) / (h ?? 1);
}

export function IndustrySwitch({
  items,
  media,
}: {
  items: Industry[];
  media: Record<string, IndustryMedia | undefined>;
}) {
  const uid = useId();
  const reduced = usePrefersReducedMotion();
  const [active, setActive] = useState(0);
  const ready = useHasMounted();
  const activeRef = useRef(0);
  const scrollMode = useRef(false);
  const typedRef = useRef<HTMLSpanElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const n = items.length;

  const section = useScene<HTMLElement>(
    (p) => {
      if (!scrollMode.current) return;
      const idx = Math.min(n - 1, Math.floor(p * n * 0.999));
      if (idx !== activeRef.current) {
        activeRef.current = idx;
        setActive(idx);
      }
    },
    // Progress runs from the section's top reaching the top of the viewport
    // to its foot reaching the bottom: (n - 1) steps of STEP_VH plus one screen.
    { from: 0, to: -((n - 1) * STEP_VH) / 100 }
  );

  // Sticky travel only where there is room for it and motion is welcome.
  useEffect(() => {
    const wide = window.matchMedia('(min-width: 961px)');
    const apply = () => {
      scrollMode.current = wide.matches && !reduced;
      section.current?.setAttribute('data-mode', scrollMode.current ? 'scroll' : 'tabs');
    };
    apply();
    wide.addEventListener('change', apply);
    return () => wide.removeEventListener('change', apply);
  }, [reduced, section]);

  // Type the brief, then let the outputs draw in.
  useEffect(() => {
    const el = typedRef.current;
    const stage = stageRef.current;
    if (!el || !stage) return;
    const text = items[active]?.brief ?? '';
    if (reduced) {
      el.textContent = text;
      stage.dataset.phase = 'done';
      return;
    }
    stage.dataset.phase = 'typing';
    let k = 0;
    el.textContent = '';
    const timer = window.setInterval(() => {
      k += 1;
      el.textContent = text.slice(0, k);
      if (k >= text.length) {
        window.clearInterval(timer);
        stage.dataset.phase = 'done';
      }
    }, TYPE_MS);
    return () => window.clearInterval(timer);
  }, [active, items, reduced]);

  const choose = (idx: number) => {
    if (scrollMode.current && section.current) {
      // Scroll to the middle of that step; the scroll position sets the step.
      const top = section.current.getBoundingClientRect().top + window.scrollY;
      const travel = section.current.offsetHeight - window.innerHeight;
      window.scrollTo({
        top: top + ((idx + 0.5) / n) * travel,
        behavior: reduced ? 'auto' : 'smooth',
      });
      return;
    }
    activeRef.current = idx;
    setActive(idx);
  };

  const onTabKey = (event: KeyboardEvent<HTMLButtonElement>, idx: number) => {
    const delta = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0;
    if (!delta && event.key !== 'Home' && event.key !== 'End') return;
    event.preventDefault();
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? n - 1 : (idx + delta + n) % n;
    tabRefs.current[next]?.focus();
    choose(next);
  };

  const current = items[active]!;

  return (
    <section
      className="ind"
      id="industries"
      ref={section}
      aria-labelledby={`${uid}-title`}
      data-ready={ready ? 'true' : undefined}
      style={{ '--steps': n, '--step-vh': `${STEP_VH}vh` } as CSSProperties}
    >
      <div className="ind__sticky">
        <div className="studio-shell ind__inner">
          <header className="ind__head">
            <p className="studio-eyebrow">{STUDIO_INDUSTRIES.eyebrow}</p>
            <h2 className="studio-display ind__title" id={`${uid}-title`}>
              {STUDIO_INDUSTRIES.title}
              <br />
              <em>{STUDIO_INDUSTRIES.emphasis}</em>
            </h2>
            <p className="ind__lead">{STUDIO_INDUSTRIES.lead}</p>
          </header>

          {/* Without scripts: every industry, in full. */}
          <ul className="ind__list">
            {items.map((item) => (
              <li key={item.slug}>
                <p className="ind__listlabel">{item.label}</p>
                <p className="ind__listbrief">{item.brief}</p>
                <p className="ind__listouts">
                  {item.outputs.map((o) => `${o.format} (${o.kind}, ${o.ratio})`).join(' · ')}
                </p>
              </li>
            ))}
          </ul>

          <div className="ind__stage" ref={stageRef} data-phase="done">
            <div className="ind__media" aria-hidden="true">
              {items.map((item, i) => {
                const m = media[item.slug];
                return (
                  <div
                    className="ind__shot"
                    key={item.slug}
                    data-active={i === active ? 'true' : 'false'}
                  >
                    {m?.kind === 'video' ? (
                      <LoopVideo src={m.src} poster={m.poster} />
                    ) : m?.kind === 'image' ? (
                      <Image src={m.src} alt="" fill sizes="(max-width: 960px) 100vw, 45vw" />
                    ) : (
                      <span className="ind__board">
                        <span className="ind__boardlabel">{item.label}</span>
                        <span className="ind__boardframes">
                          {item.outputs.map((o) => (
                            <span
                              key={o.format}
                              className="ind__boardframe"
                              style={{ '--ratio': ratioValue(o.ratio) } as CSSProperties}
                            />
                          ))}
                        </span>
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="ind__canvas">
              <div className="ind__prompt">
                <div className="ind__tabs" role="tablist" aria-label={STUDIO_INDUSTRIES.tabsLabel}>
                  {items.map((item, i) => (
                    <button
                      key={item.slug}
                      ref={(el) => {
                        tabRefs.current[i] = el;
                      }}
                      type="button"
                      role="tab"
                      id={`${uid}-tab-${i}`}
                      aria-selected={i === active}
                      aria-controls={`${uid}-panel`}
                      tabIndex={i === active ? 0 : -1}
                      className="ind__tab"
                      onClick={() => choose(i)}
                      onKeyDown={(e) => onTabKey(e, i)}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
                <div
                  className="ind__panel"
                  role="tabpanel"
                  id={`${uid}-panel`}
                  aria-labelledby={`${uid}-tab-${active}`}
                >
                  <p className="ind__brieflabel">{STUDIO_INDUSTRIES.briefLabel}</p>
                  <p className="ind__brief">
                    <span className="gl-sr">{current.brief}</span>
                    <span className="ind__typed" ref={typedRef} aria-hidden="true">
                      {current.brief}
                    </span>
                    <span className="ind__caret" aria-hidden="true" />
                  </p>
                  <span className="ind__send" aria-hidden="true">
                    &rarr;
                  </span>
                </div>
              </div>

              <svg
                className="ind__wires"
                viewBox="0 0 100 300"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                {[50, 150, 250].map((y, i) => (
                  <path
                    key={`${active}-${y}`}
                    d={`M0 150 C 55 150, 45 ${y}, 100 ${y}`}
                    pathLength={1}
                    style={{ '--i': i } as CSSProperties}
                  />
                ))}
              </svg>

              <div className="ind__outputs">
                <p className="ind__outlabel">{STUDIO_INDUSTRIES.outputsLabel}</p>
                <ul className="ind__nodes">
                  {current.outputs.map((o, i) => (
                    <li
                      className="ind__node"
                      key={`${current.slug}-${o.format}`}
                      style={{ '--i': i } as CSSProperties}
                    >
                      <span
                        className="ind__glyph"
                        style={{ '--ratio': ratioValue(o.ratio) } as CSSProperties}
                        aria-hidden="true"
                      />
                      <span className="ind__nodetext">
                        <span className="ind__nodeformat">{o.format}</span>
                        <span className="ind__nodemeta">{`${o.kind} · ${o.ratio}`}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <ol className="ind__progress" aria-hidden="true">
            {items.map((item, i) => (
              <li key={item.slug} data-active={i === active ? 'true' : 'false'} />
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
