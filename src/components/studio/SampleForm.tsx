'use client';

import Link from 'next/link';
import { useId, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { BUSINESS_OPTIONS, STUDIO_SAMPLE } from '@/content/studio';
import {
  SAMPLE_PREFERENCES,
  SAMPLE_PREFERENCE_LABELS,
  type SampleFieldErrors,
  type SampleInput,
  type SampleResult,
} from '@/lib/sample-fields';

/**
 * The free-sample request, framed as a small app window.
 *
 * Six fields and one choice. With no delivery provider configured the form is
 * not rendered at all and the window says so, rather than accepting details it
 * cannot send (rule 5 in CLAUDE.md). The server checks again on every post, so
 * a provider removed after the build still produces an honest answer.
 */

type Status =
  | { kind: 'idle' }
  | { kind: 'sending' }
  | { kind: 'success'; reference: string }
  | { kind: 'error'; message: string }
  | { kind: 'unconfigured' };

const F = STUDIO_SAMPLE.fields;

function Window({ children }: { children: ReactNode }) {
  return (
    <div className="sample__window">
      <div className="sample__titlebar" aria-hidden="true">
        <span className="sample__lights">
          <i />
          <i />
          <i />
        </span>
        <span className="sample__wintitle">{STUDIO_SAMPLE.windowTitle}</span>
      </div>
      <div className="sample__body">{children}</div>
    </div>
  );
}

export function SampleForm({ configured }: { configured: boolean }) {
  const uid = useId();
  const id = (name: string) => `${uid}-${name}`;
  const startedAt = useRef<number>(0);
  const formRef = useRef<HTMLFormElement | null>(null);
  const [status, setStatus] = useState<Status>(
    configured ? { kind: 'idle' } : { kind: 'unconfigured' }
  );
  const [errors, setErrors] = useState<SampleFieldErrors>({});

  if (status.kind === 'unconfigured') {
    return (
      <Window>
        <div className="sample__panel" role="status">
          <p className="sample__paneltitle">{STUDIO_SAMPLE.unconfigured.title}</p>
          <p className="sample__panelbody">{STUDIO_SAMPLE.unconfigured.body}</p>
        </div>
      </Window>
    );
  }

  if (status.kind === 'success') {
    return (
      <Window>
        <div className="sample__panel" role="status" tabIndex={-1} ref={(el) => el?.focus()}>
          <p className="sample__paneltitle">{STUDIO_SAMPLE.success.title}</p>
          <p className="sample__panelbody">{STUDIO_SAMPLE.success.body}</p>
          <p className="sample__ref">
            {STUDIO_SAMPLE.success.reference} <span>{status.reference}</span>
          </p>
        </div>
      </Window>
    );
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const body: SampleInput = {
      name: String(data.get('name') ?? ''),
      email: String(data.get('email') ?? ''),
      brand: String(data.get('brand') ?? ''),
      business: String(data.get('business') ?? '') as SampleInput['business'],
      productUrl: String(data.get('productUrl') ?? ''),
      preference: String(data.get('preference') ?? '') as SampleInput['preference'],
      hp: String(data.get('hp') ?? ''),
      elapsed: startedAt.current ? Date.now() - startedAt.current : undefined,
    };

    setStatus({ kind: 'sending' });
    setErrors({});
    try {
      const res = await fetch('/api/sample', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(body),
      });
      const result = (await res.json()) as SampleResult;
      if (result.status === 'success') {
        setStatus({ kind: 'success', reference: result.reference });
      } else if (result.status === 'unconfigured') {
        setStatus({ kind: 'unconfigured' });
      } else {
        setErrors(result.fieldErrors ?? {});
        setStatus({ kind: 'error', message: result.message });
        const first = Object.keys(result.fieldErrors ?? {})[0];
        if (first) formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      }
    } catch {
      setStatus({ kind: 'error', message: STUDIO_SAMPLE.errors.network });
    }
  }

  const describedBy = (name: keyof SampleInput, hint?: boolean) =>
    [hint ? id(`${name}-hint`) : null, errors[name] ? id(`${name}-error`) : null]
      .filter(Boolean)
      .join(' ') || undefined;

  /** Label, control, optional hint and error, all tied together. */
  const field = (name: keyof SampleInput, label: string, control: ReactNode, hint?: string) => {
    const error = errors[name];
    return (
      <div className="sample__field" data-invalid={error ? 'true' : undefined}>
        <label className="sample__label" htmlFor={id(name)}>
          {label}
        </label>
        {control}
        {hint ? (
          <p className="sample__hint" id={id(`${name}-hint`)}>
            {hint}
          </p>
        ) : null}
        {error ? (
          <p className="sample__error" id={id(`${name}-error`)}>
            {error}
          </p>
        ) : null}
      </div>
    );
  };

  const input = (
    name: 'name' | 'email' | 'brand' | 'productUrl',
    props: { type: string; autoComplete: string; inputMode?: 'url' | 'email'; hint?: boolean }
  ) => (
    <input
      className="sample__input"
      id={id(name)}
      name={name}
      type={props.type}
      inputMode={props.inputMode}
      autoComplete={props.autoComplete}
      required
      aria-invalid={errors[name] ? true : undefined}
      aria-describedby={describedBy(name, props.hint)}
    />
  );

  return (
    <Window>
      <form
        ref={formRef}
        className="sample__form"
        noValidate
        onSubmit={onSubmit}
        onFocus={() => {
          if (!startedAt.current) startedAt.current = Date.now();
        }}
      >
        <div className="sample__row">
          {field('name', F.name, input('name', { type: 'text', autoComplete: 'name' }))}
          {field(
            'email',
            F.email,
            input('email', { type: 'email', autoComplete: 'email', inputMode: 'email' })
          )}
        </div>
        <div className="sample__row">
          {field('brand', F.brand, input('brand', { type: 'text', autoComplete: 'organization' }))}
          {field(
            'business',
            F.business,
            <select
              className="sample__input sample__select"
              id={id('business')}
              name="business"
              required
              defaultValue=""
              aria-invalid={errors.business ? true : undefined}
              aria-describedby={describedBy('business')}
            >
              <option value="" disabled>
                {F.businessPlaceholder}
              </option>
              {BUSINESS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          )}
        </div>
        {field(
          'productUrl',
          F.productUrl,
          input('productUrl', { type: 'text', autoComplete: 'url', inputMode: 'url', hint: true }),
          F.productUrlHint
        )}

        <fieldset className="sample__choice" aria-describedby={describedBy('preference')}>
          <legend className="sample__label">{F.preference}</legend>
          <div className="sample__options">
            {SAMPLE_PREFERENCES.map((value, i) => (
              <label className="sample__option" key={value}>
                <input
                  type="radio"
                  name="preference"
                  value={value}
                  defaultChecked={i === 0}
                  required
                />
                <span>{SAMPLE_PREFERENCE_LABELS[value]}</span>
              </label>
            ))}
          </div>
          {errors.preference ? (
            <p className="sample__error" id={id('preference-error')}>
              {errors.preference}
            </p>
          ) : null}
        </fieldset>

        {/* Honeypot: off screen, out of the tab order, ignored by autofill. */}
        <div className="sample__hp" aria-hidden="true">
          <label htmlFor={id('hp')}>Leave this empty</label>
          <input id={id('hp')} name="hp" type="text" tabIndex={-1} autoComplete="off" />
        </div>

        {status.kind === 'error' ? (
          <p className="sample__alert" role="alert">
            {status.message}
          </p>
        ) : null}

        <button className="sample__submit" type="submit" disabled={status.kind === 'sending'}>
          {status.kind === 'sending' ? STUDIO_SAMPLE.sending : STUDIO_SAMPLE.submit}
          <span aria-hidden="true">&rarr;</span>
        </button>

        <p className="sample__fine">
          {STUDIO_SAMPLE.fineprint} <Link href="/privacy">{STUDIO_SAMPLE.privacy}</Link>
        </p>
      </form>
    </Window>
  );
}
