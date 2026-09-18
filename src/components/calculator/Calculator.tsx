'use client';

import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import {
  CALCULATOR,
  QUESTIONS,
  SECONDS_PER_QUESTION,
  type ChoiceQuestionId,
  type Question,
} from '@/content/calculator';
import { DEFAULTS, estimate, type Answers } from '@/lib/calculator/model';
import { Result } from './Result';

/**
 * The nine questions, one per screen.
 *
 * A client component because it is genuinely interactive — the only kind this
 * site adds one for. What it does NOT do is hide meaning behind JavaScript:
 * the first question is in the server-rendered HTML, so a blocked bundle leaves
 * a readable page with a working route out of it.
 *
 * Entrance motion between questions reuses the rise verb rather than inventing
 * a transition. It cannot use `Reveal`, because `MotionProvider` marks
 * `[data-reveal]` elements once per route and a question mounted later would
 * never be marked — it would sit at opacity 0 for good. So the rule in
 * sections.css keys off `data-inview` exactly as the shared one does, and this
 * component sets that attribute itself.
 */

type Draft = Partial<Answers>;

const STORAGE_KEY = 'gl-calculator-v1';

type Stored = { step: number; answers: Draft; valueTouched: boolean };

function isComplete(draft: Draft): draft is Answers {
  return QUESTIONS.every((q) => {
    const value = draft[q.id];
    return q.kind === 'number' ? typeof value === 'number' && value > 0 : Boolean(value);
  });
}

export function Calculator({ bookingUrl }: { bookingUrl?: string }) {
  const groupId = useId();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Draft>({});
  const [done, setDone] = useState(false);
  const [numberError, setNumberError] = useState('');
  /** Whether the reader has chosen an appointment value themselves. */
  const valueTouched = useRef(false);
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const questionRef = useRef<HTMLDivElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  /** Suppresses the entrance on the very first paint and after a restore. */
  const restored = useRef(false);
  const moved = useRef(false);

  /* --- Restore ---------------------------------------------------------- */
  /**
   * Answers survive a refresh, which is the whole point of the store, and the
   * restore has to happen in an effect rather than in a `useState` initialiser:
   * this component is server-rendered, the server has no sessionStorage, and
   * reading it during the first render would make the client's markup disagree
   * with the server's. The cascading render the rule warns about is one render,
   * once, on a page that has just loaded.
   */
  useEffect(() => {
    restored.current = true;
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as Stored;
      if (!parsed || typeof parsed !== 'object') return;
      const nextAnswers = parsed.answers ?? {};
      /* eslint-disable react-hooks/set-state-in-effect -- see the note above. */
      setAnswers(nextAnswers);
      valueTouched.current = Boolean(parsed.valueTouched);
      if (isComplete(nextAnswers) && parsed.step >= QUESTIONS.length) {
        setDone(true);
      } else {
        setStep(Math.min(Math.max(0, parsed.step ?? 0), QUESTIONS.length - 1));
      }
      /* eslint-enable react-hooks/set-state-in-effect */
    } catch {
      // A malformed or unavailable store is not worth a broken page.
    }
  }, []);

  /* --- Persist ---------------------------------------------------------- */
  useEffect(() => {
    if (!restored.current) return;
    try {
      const payload: Stored = {
        step: done ? QUESTIONS.length : step,
        answers,
        valueTouched: valueTouched.current,
      };
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // Private mode, or a full store. The flow still works in memory.
    }
  }, [answers, step, done]);

  /* --- Entrance, and where focus goes ----------------------------------- */
  useEffect(() => {
    const el = questionRef.current;
    if (el) {
      // Two frames, matching MotionProvider: one to paint the start state, one
      // to let the transition apply before the attribute flips.
      const first = requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          el.dataset.inview = 'true';
        });
      });
      // Focus follows the question so a screen reader announces the new one.
      // Not on first paint: moving focus into a widget nobody has touched yet
      // would drag the page down to it on load.
      //
      // The scroll is taken over rather than left to the browser. Focusing a
      // heading scrolls it to the top of the viewport, which on a phone put
      // the question itself above the fold and left the reader looking at the
      // middle of the option list. The card is scrolled instead, and only when
      // it is not already sitting somewhere sensible.
      if (moved.current) {
        headingRef.current?.focus({ preventScroll: true });
        const card = cardRef.current;
        if (card) {
          const { top } = card.getBoundingClientRect();
          if (top < 0 || top > window.innerHeight * 0.4) card.scrollIntoView({ block: 'start' });
        }
      }
      moved.current = true;
      return () => cancelAnimationFrame(first);
    }
    return undefined;
  }, [step, done]);

  const question = QUESTIONS[step] as Question;

  const setChoice = useCallback((id: ChoiceQuestionId, value: string) => {
    setAnswers((prev) => {
      const next: Draft = { ...prev, [id]: value } as Draft;
      // Choosing a practice type sets the appointment value the questions
      // open on, so that answer is one tap for most people. It stops doing
      // that the moment the reader has set the value themselves.
      if (id === 'practice' && !valueTouched.current) {
        next.value = DEFAULTS[value as Answers['practice']].value;
      }
      if (id === 'value') valueTouched.current = true;
      return next;
    });
  }, []);

  const advance = useCallback(() => {
    setNumberError('');
    if (step >= QUESTIONS.length - 1) {
      setDone(true);
      return;
    }
    setStep((s) => s + 1);
  }, [step]);

  const submitQuestion = useCallback(() => {
    if (question.kind === 'number') {
      const value = answers.weeklyAppointments;
      if (typeof value !== 'number' || !Number.isFinite(value) || value < question.min) {
        setNumberError(question.error);
        return;
      }
    } else if (!answers[question.id]) {
      return;
    }
    advance();
  }, [advance, answers, question]);

  const back = useCallback(() => {
    setNumberError('');
    if (done) {
      setDone(false);
      setStep(QUESTIONS.length - 1);
      return;
    }
    setStep((s) => Math.max(0, s - 1));
  }, [done]);

  const restart = useCallback(() => {
    setAnswers({});
    valueTouched.current = false;
    setDone(false);
    setStep(0);
    setNumberError('');
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      // Nothing to clear.
    }
  }, []);

  const result = useMemo(() => (isComplete(answers) ? estimate(answers) : null), [answers]);

  if (done && result && isComplete(answers)) {
    return (
      <Result
        answers={answers}
        estimate={result}
        bookingUrl={bookingUrl}
        onChange={() => {
          setDone(false);
          setStep(0);
        }}
        onRestart={restart}
      />
    );
  }

  const answered = question.kind === 'number' ? answers.weeklyAppointments : answers[question.id];
  const last = step === QUESTIONS.length - 1;
  const secondsLeft = (QUESTIONS.length - step) * SECONDS_PER_QUESTION;
  // The question you are on counts as progress. At `step / length` the track
  // is empty on the first question, which reads as a control that has not
  // loaded rather than as a start.
  const progress = ((step + 1) / QUESTIONS.length) * 100;

  return (
    <div className="calc" ref={cardRef}>
      <div className="calc__head">
        <p className="calc__count">
          <span className="label">
            {CALCULATOR.progressLabel} {step + 1} {CALCULATOR.of} {QUESTIONS.length}
          </span>
          <span className="micro calc__time">{CALCULATOR.timeRemaining(secondsLeft)}</span>
        </p>
        <div
          className="calc__progress"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={QUESTIONS.length}
          aria-valuenow={step + 1}
          aria-label={`${CALCULATOR.progressLabel} ${step + 1} ${CALCULATOR.of} ${QUESTIONS.length}`}
        >
          <span className="calc__progressfill" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="calc__q" data-inview="false" key={question.id} ref={questionRef}>
        <form
          className="calc__form"
          onSubmit={(event) => {
            event.preventDefault();
            submitQuestion();
          }}
        >
          <fieldset className="calc__set">
            <legend className="calc__legend">
              <h2
                className="display d3 calc__title"
                id={`${groupId}-title`}
                tabIndex={-1}
                ref={headingRef}
              >
                {question.title}
              </h2>
            </legend>
            {question.help ? (
              <p className="small calc__help" id={`${groupId}-help`}>
                {question.help}
              </p>
            ) : null}

            {question.kind === 'choice' ? (
              <div className="calc__opts">
                {question.options.map((option) => {
                  const id = `${groupId}-${question.id}-${option.value}`;
                  const checked = answers[question.id] === option.value;
                  return (
                    <div className="calc__opt" key={option.value} data-checked={checked}>
                      <input
                        className="calc__radio"
                        type="radio"
                        id={id}
                        name={`${groupId}-${question.id}`}
                        value={option.value}
                        checked={checked}
                        aria-describedby={question.help ? `${groupId}-help` : undefined}
                        onChange={() => setChoice(question.id, option.value)}
                        /**
                         * Advance on a real tap or click, and only then.
                         * `detail` is 0 for a click synthesised from the
                         * keyboard, which is what arrowing through a radio
                         * group produces — advancing there would make the group
                         * impossible to navigate. Keyboard users choose, then
                         * press Enter or move to Continue.
                         */
                        onClick={(event) => {
                          if (event.detail > 0) advance();
                        }}
                      />
                      <label className="calc__optlabel" htmlFor={id}>
                        <span className="calc__optmark" aria-hidden="true" />
                        <span>
                          <span className="calc__opttext">{option.label}</span>
                          {option.note ? (
                            <span className="micro calc__optnote">{option.note}</span>
                          ) : null}
                        </span>
                      </label>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="calc__number">
                <label className="gl-sr" htmlFor={`${groupId}-weekly`}>
                  {question.title}
                </label>
                <input
                  className="field__control calc__input"
                  id={`${groupId}-weekly`}
                  name="weeklyAppointments"
                  type="number"
                  inputMode="numeric"
                  autoComplete="off"
                  min={question.min}
                  max={question.max}
                  step={1}
                  placeholder={question.placeholder}
                  value={answers.weeklyAppointments ?? ''}
                  aria-invalid={Boolean(numberError)}
                  aria-describedby={`${groupId}-help${numberError ? ` ${groupId}-error` : ''}`}
                  onChange={(event) => {
                    const raw = event.currentTarget.value;
                    setNumberError('');
                    setAnswers((prev) => ({
                      ...prev,
                      weeklyAppointments: raw === '' ? undefined : Number(raw),
                    }));
                  }}
                />
                <span className="micro calc__suffix">{question.suffix}</span>
                {numberError ? (
                  <p className="field__error calc__error" id={`${groupId}-error`} role="alert">
                    <span aria-hidden="true">&times;</span>
                    {numberError}
                  </p>
                ) : null}
              </div>
            )}
          </fieldset>

          <div className="calc__actions">
            <button className="btn" type="submit" disabled={!answered}>
              {last ? CALCULATOR.finish : CALCULATOR.next}
              <span className="btn__arrow" aria-hidden="true">
                &rarr;
              </span>
            </button>
            {step > 0 ? (
              <button className="calc__back" type="button" onClick={back}>
                <span aria-hidden="true">&larr;</span> {CALCULATOR.back}
              </button>
            ) : null}
          </div>
        </form>
      </div>
    </div>
  );
}
