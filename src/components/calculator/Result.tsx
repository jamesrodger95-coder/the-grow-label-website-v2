'use client';

import { useEffect, useRef } from 'react';
import { CALCULATOR, CALCULATOR_MODULES, RESULT } from '@/content/calculator';
import { count, type Answers, type Estimate } from '@/lib/calculator/model';
import { BookCall } from './BookCall';

/**
 * Where the nine questions land: a booking, not a result.
 *
 * The revenue figure the model produced is deliberately absent. It is the
 * reason for the call, and a reader who already has it has no reason to turn
 * up — so what is shown instead is the part that is true, specific to their
 * answers, and costs nothing to give: the hours their front desk spends on
 * this work today, and which of the four modules their own answers point at.
 *
 * The ordering of those modules is real — it comes from their own estimate —
 * but the figures behind it are not printed. That is the line this screen
 * holds: everything on it is honest, and none of it is the number.
 */
export function Result({
  answers,
  estimate,
  bookingUrl,
  onChange,
  onRestart,
}: {
  answers: Answers;
  estimate: Estimate;
  bookingUrl?: string;
  onChange: () => void;
  onRestart: () => void;
}) {
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true });
    cardRef.current?.scrollIntoView({ block: 'start' });
  }, []);

  /** Largest first. The order is the reader's own, the figures stay with us. */
  const ranked = [...CALCULATOR_MODULES]
    .map((module) => ({
      module,
      value: estimate.modules.find((m) => m.slug === module.slug)?.value ?? 0,
    }))
    .sort((a, b) => b.value - a.value);

  return (
    <div className="calc calc--result" ref={cardRef}>
      <div className="calc__resulthead">
        <span className="eyebrow">{RESULT.eyebrow}</span>
        <h2 className="display d2 calc__booktitle" tabIndex={-1} ref={headingRef}>
          {RESULT.titleLines[0]} <em>{RESULT.titleLines[1]}</em>
        </h2>
        <p className="small calc__resultlead">{RESULT.lead}</p>
      </div>

      <BookCall answers={answers} bookingUrl={bookingUrl} />

      <div className="calc__hours">
        <span className="calc__hoursvalue">{count(estimate.hoursReturned)}</span>
        <span className="label">{RESULT.hoursLabel}</span>
        <p className="micro">{RESULT.hoursNote}</p>
      </div>

      <div className="calc__points">
        <h3 className="display d4 calc__breakdowntitle">{RESULT.pointsTitle}</h3>
        <p className="small calc__pointslead">{RESULT.pointsLead}</p>
        <ol className="calc__pointlist">
          {ranked.map(({ module }, i) => (
            <li className="calc__point" key={module.slug}>
              <span className="calc__pointidx">{`0${i + 1}`}</span>
              <span className="calc__pointname">{module.name}</span>
              <span className="micro calc__pointleak">{module.leak}</span>
            </li>
          ))}
        </ol>
        <p className="micro calc__note">{RESULT.pointsNote}</p>
        {estimate.belowRecordThreshold ? (
          <p className="micro calc__warning">{RESULT.thresholdWarning}</p>
        ) : null}
        <p className="micro calc__note">{RESULT.disclaimer}</p>
      </div>

      <div className="calc__after">
        <div className="calc__afterlinks">
          <button className="calc__back" type="button" onClick={onChange}>
            {RESULT.change}
          </button>
          <button className="calc__back" type="button" onClick={onRestart}>
            {CALCULATOR.restart}
          </button>
        </div>
      </div>
    </div>
  );
}
