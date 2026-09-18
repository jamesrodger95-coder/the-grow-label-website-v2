'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { CALCULATOR, CALCULATOR_MODULES, RESULT } from '@/content/calculator';
import {
  count,
  money,
  roundDownHundred,
  type Answers,
  type Estimate,
} from '@/lib/calculator/model';
import { ReportDownload } from './ReportDownload';

/**
 * The result, shown the moment the ninth question is answered and before
 * anything is asked for. Gating a modelled estimate behind an email is how a
 * tool like this loses the readers who were going to convert.
 */
export function Result({
  answers,
  estimate,
  onChange,
  onRestart,
}: {
  answers: Answers;
  estimate: Estimate;
  onChange: () => void;
  onRestart: () => void;
}) {
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const rowsRef = useRef<HTMLDivElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // The figure is the whole point of the screen, so the card's top is what
    // has to be in view — not the heading pinned to the top of the viewport
    // with the figure scrolled off it. Same arrangement as the questions.
    headingRef.current?.focus({ preventScroll: true });
    cardRef.current?.scrollIntoView({ block: 'start' });
    const el = rowsRef.current;
    if (!el) return undefined;
    // The bars draw once, on the same two-frame handshake the rest of the site
    // uses. Draw is a permitted verb for a track; the figures do not move.
    const frame = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.dataset.inview = 'true';
      });
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  const rows = CALCULATOR_MODULES.map((module) => {
    const value = estimate.modules.find((m) => m.slug === module.slug)?.value ?? 0;
    return { module, value: roundDownHundred(value) };
  });
  const largest = Math.max(...rows.map((r) => r.value), 1);

  return (
    <div className="calc calc--result" ref={cardRef}>
      <div className="calc__resulthead">
        <span className="eyebrow">{RESULT.eyebrow}</span>
        <h2 className="calc__figurelabel" id="calc-result-title" tabIndex={-1} ref={headingRef}>
          <span className="label label--accent">{RESULT.headlineLabel}</span>
          <span className="calc__figure">{money(estimate.headline)}</span>
          <span className="small">{RESULT.headlineSuffix}</span>
        </h2>
        <p className="micro calc__range">{RESULT.rangeLabel(money(estimate.upper))}</p>
        <p className="small calc__resultlead">{RESULT.lead}</p>
      </div>

      <div className="calc__hours">
        <span className="calc__hoursvalue">{count(estimate.hoursReturned)}</span>
        <span className="label">{RESULT.hoursLabel}</span>
        <p className="micro">{RESULT.hoursNote}</p>
      </div>

      <div className="calc__breakdown">
        <h3 className="display d4 calc__breakdowntitle">{RESULT.breakdownTitle}</h3>
        <div className="calc__rows" data-inview="false" ref={rowsRef}>
          {rows.map(({ module, value }, i) => (
            <div className="calc-row" key={module.slug}>
              <div className="calc-row__head">
                <span className="calc-row__name">{module.name}</span>
                <span className="calc-row__value">{money(value)}</span>
              </div>
              <span className="calc-row__track">
                <span
                  className="calc-row__fill"
                  style={
                    {
                      '--w': `${Math.max(2, (value / largest) * 100)}%`,
                      '--i': i,
                    } as React.CSSProperties
                  }
                />
              </span>
              <p className="micro calc-row__leak">{module.leak}</p>
            </div>
          ))}
        </div>
        <p className="micro calc__note">{RESULT.breakdownNote}</p>
        {estimate.belowRecordThreshold ? (
          <p className="micro calc__warning">{RESULT.thresholdWarning}</p>
        ) : null}
        <p className="micro calc__note">{RESULT.disclaimer}</p>
      </div>

      <ReportDownload answers={answers} estimate={estimate} />

      <div className="calc__after">
        <Link className="btn" href="/contact">
          {RESULT.assessmentCta}
          <span className="btn__arrow" aria-hidden="true">
            &rarr;
          </span>
        </Link>
        <div className="calc__afterlinks">
          <button className="calc__back" type="button" onClick={onChange}>
            {CALCULATOR.change}
          </button>
          <button className="calc__back" type="button" onClick={onRestart}>
            {CALCULATOR.restart}
          </button>
        </div>
      </div>
    </div>
  );
}
