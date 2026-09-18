'use client';

import { useEffect, useRef } from 'react';
import { CALCULATOR, CALCULATOR_MODULES, RESULT } from '@/content/calculator';
import { count, type Answers, type Estimate } from '@/lib/calculator/model';
import { CalEmbed } from './CalEmbed';

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
 *
 * The layout breaks out of the two columns the questions ran in: the copy runs
 * full width and the calendar sits underneath it, because an embedded month
 * grid in an aside-width column collapses to a list of times. `.calc-layout`
 * does that with `:has(.calc--result)`, so no state has to cross from here to
 * the server-rendered aside beside it.
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
  const sent = useRef(false);

  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true });
    cardRef.current?.scrollIntoView({ block: 'start' });
  }, []);

  /**
   * The lead goes the moment the questions are finished, not when anything is
   * clicked.
   *
   * With a calendar embedded there is no click to hang it on — a booking
   * happens inside an iframe we do not hear from. And the answers are the whole
   * of what we need to build the assessment, so somebody who completes the
   * questions and never picks a time is still worth having. Sent once: the ref
   * guards a re-render, and the flag in sessionStorage guards a refresh.
   */
  useEffect(() => {
    if (sent.current) return;
    sent.current = true;

    const key = `gl-calculator-sent-${JSON.stringify(answers)}`;
    try {
      if (sessionStorage.getItem(key)) return;
    } catch {
      // No store; a duplicate is better than a lost lead.
    }

    void fetch('/api/calculator/lead', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ answers }),
    })
      .then(() => {
        try {
          sessionStorage.setItem(key, '1');
        } catch {
          // Nothing to remember it with.
        }
      })
      .catch(() => {
        // Best effort. Nothing about our plumbing is shown to the reader here:
        // they have a calendar in front of them and that is the job.
      });
  }, [answers]);

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
        <p className="lead calc__resultlead">{RESULT.lead}</p>
      </div>

      <div className="calc__summary">
        <div className="calc__gets">
          <p className="label" style={{ marginBottom: 14 }}>
            {RESULT.getsTitle}
          </p>
          <ul className="ticks">
            {RESULT.whatYouGet.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="calc__reading">
          <div className="calc__hours">
            <span className="calc__hoursvalue">{count(estimate.hoursReturned)}</span>
            <span className="label">{RESULT.hoursLabel}</span>
            <p className="micro">{RESULT.hoursNote}</p>
          </div>

          <div className="calc__points">
            <p className="label" style={{ marginBottom: 6 }}>
              {RESULT.pointsTitle}
            </p>
            <p className="micro calc__pointslead">{RESULT.pointsLead}</p>
            <ol className="calc__pointlist">
              {ranked.map(({ module }, i) => (
                <li className="calc__point" key={module.slug}>
                  <span className="calc__pointidx">{`0${i + 1}`}</span>
                  <span className="calc__pointname">{module.name}</span>
                </li>
              ))}
            </ol>
            <p className="micro calc__note">{RESULT.pointsNote}</p>
          </div>
        </div>
      </div>

      <CalEmbed bookingUrl={bookingUrl} />

      <div className="calc__after">
        {estimate.belowRecordThreshold ? (
          <p className="micro calc__warning">{RESULT.thresholdWarning}</p>
        ) : null}
        <p className="micro calc__note">{RESULT.disclaimer}</p>
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
