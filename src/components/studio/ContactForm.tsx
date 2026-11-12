'use client';

import Link from 'next/link';
import { useId, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { STUDIO_CONTACT } from '@/content/studio';

/**
 * The contact form, in the same small app window as the free-sample form.
 *
 * Three fields. It posts to the ops site (STUDIO_CONTACT.requestUrl), which
 * stores the message for Trent to read and answer; success is shown only when
 * that server says it stored it (rule 5 in CLAUDE.md). Sent as text/plain so
 * the cross-origin post needs no preflight.
 */

type Field = 'name' | 'email' | 'message';
type Errors = Partial<Record<Field, string>>;
type Status =
  | { kind: 'idle' }
  | { kind: 'sending' }
  | { kind: 'success'; reference: string }
  | { kind: 'error'; message: string };

const C = STUDIO_CONTACT;

function Window({ children }: { children: ReactNode }) {
  return (
    <div className="sample__window">
      <div className="sample__titlebar" aria-hidden="true">
        <span className="sample__lights">
          <i />
          <i />
          <i />
        </span>
        <span className="sample__wintitle">{C.windowTitle}</span>
      </div>
      <div className="sample__body">{children}</div>
    </div>
  );
}

export function ContactForm() {
  const uid = useId();
  const id = (name: string) => `${uid}-${name}`;
  const startedAt = useRef<number>(0);
  const formRef = useRef<HTMLFormElement | null>(null);
  const [status, setStatus] = useState<Status>({ kind: 'idle' });
  const [errors, setErrors] = useState<Errors>({});

  if (status.kind === 'success') {
    return (
      <Window>
        <div className="sample__panel" role="status" tabIndex={-1} ref={(el) => el?.focus()}>
          <p className="sample__paneltitle">{C.success.title}</p>
          <p className="sample__panelbody">{C.success.body}</p>
          <p className="sample__ref">
            {C.success.reference} <span>{status.reference}</span>
          </p>
        </div>
      </Window>
    );
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const body = {
      name: String(data.get('name') ?? '').trim(),
      email: String(data.get('email') ?? '').trim(),
      message: String(data.get('message') ?? '').trim(),
      hp: String(data.get('hp') ?? ''),
      elapsed: startedAt.current ? Date.now() - startedAt.current : undefined,
    };
    const local: Errors = {};
    if (body.name.length < 2) local.name = C.errors.name;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) local.email = C.errors.email;
    if (body.message.length < 10) local.message = C.errors.message;
    if (Object.keys(local).length) {
      setErrors(local);
      setStatus({ kind: 'error', message: C.errors.generic });
      formRef.current?.querySelector<HTMLElement>(`[name="${Object.keys(local)[0]}"]`)?.focus();
      return;
    }

    setStatus({ kind: 'sending' });
    setErrors({});
    try {
      const res = await fetch(C.requestUrl, {
        method: 'POST',
        headers: { 'content-type': 'text/plain' },
        body: JSON.stringify(body),
      });
      const result = (await res.json()) as {
        status: string;
        reference?: string;
        message?: string;
        fieldErrors?: Errors;
      };
      if (result.status === 'success' && result.reference) {
        setStatus({ kind: 'success', reference: result.reference });
      } else {
        setErrors(result.fieldErrors ?? {});
        setStatus({ kind: 'error', message: result.message ?? C.errors.generic });
      }
    } catch {
      setStatus({ kind: 'error', message: C.errors.network });
    }
  }

  const field = (name: Field, label: string, control: ReactNode) => (
    <div className="sample__field" data-invalid={errors[name] ? 'true' : undefined}>
      <label className="sample__label" htmlFor={id(name)}>
        {label}
      </label>
      {control}
      {errors[name] ? (
        <p className="sample__error" id={id(`${name}-error`)}>
          {errors[name]}
        </p>
      ) : null}
    </div>
  );
  const described = (name: Field) => (errors[name] ? id(`${name}-error`) : undefined);

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
          {field(
            'name',
            C.fields.name,
            <input
              className="sample__input"
              id={id('name')}
              name="name"
              type="text"
              autoComplete="name"
              required
              aria-invalid={errors.name ? true : undefined}
              aria-describedby={described('name')}
            />
          )}
          {field(
            'email',
            C.fields.email,
            <input
              className="sample__input"
              id={id('email')}
              name="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              required
              aria-invalid={errors.email ? true : undefined}
              aria-describedby={described('email')}
            />
          )}
        </div>
        {field(
          'message',
          C.fields.message,
          <textarea
            className="sample__input sample__textarea"
            id={id('message')}
            name="message"
            rows={6}
            maxLength={2000}
            required
            aria-invalid={errors.message ? true : undefined}
            aria-describedby={described('message')}
          />
        )}

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
          {status.kind === 'sending' ? C.sending : C.submit}
          <span aria-hidden="true">&rarr;</span>
        </button>

        <p className="sample__fine">
          {C.fineprint} <Link href="/privacy">{C.privacy}</Link>
        </p>
      </form>
    </Window>
  );
}
