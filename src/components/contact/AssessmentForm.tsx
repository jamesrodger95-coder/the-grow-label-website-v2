'use client';

import { useEffect, useId, useRef, useState, type FormEvent } from 'react';
import {
  SECTORS,
  SECTOR_LABELS,
  SITE_BANDS,
  SITE_LABELS,
  type ContactResult,
  type FieldErrors,
} from '@/lib/contact-fields';

/**
 * Assessment request form.
 *
 * Validation is authoritative on the server; the client mirrors the same rules
 * only to avoid a round trip. When no delivery provider is configured the form
 * says so plainly rather than simulating a successful submission.
 */

type Status = 'idle' | 'submitting' | 'success' | 'error' | 'unconfigured';

export function AssessmentForm({
  configured,
  dataNotice,
}: {
  configured: boolean;
  dataNotice: string;
}) {
  const formId = useId();
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState('');
  const [reference, setReference] = useState('');
  const [errors, setErrors] = useState<FieldErrors>({});
  // Set from an effect rather than during render: Date.now() is impure, and
  // the value is only meaningful once the form is actually on screen.
  const mountedAt = useRef<number>(0);
  const statusRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    mountedAt.current = Date.now();
  }, []);

  const fid = (name: string) => `${formId}-${name}`;
  const eid = (name: string) => `${formId}-${name}-error`;

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === 'submitting') return;

    const form = event.currentTarget;
    const data = new FormData(form);
    const payload = {
      name: String(data.get('name') ?? ''),
      email: String(data.get('email') ?? ''),
      organisation: String(data.get('organisation') ?? ''),
      role: String(data.get('role') ?? ''),
      sector: String(data.get('sector') ?? ''),
      sites: String(data.get('sites') ?? ''),
      message: String(data.get('message') ?? ''),
      website: String(data.get('website') ?? ''),
      elapsed: mountedAt.current === 0 ? 0 : Date.now() - mountedAt.current,
    };

    setStatus('submitting');
    setErrors({});
    setMessage('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = (await res.json()) as ContactResult;

      if (result.status === 'success') {
        setStatus('success');
        setReference(result.reference);
        form.reset();
        mountedAt.current = Date.now();
      } else if (result.status === 'unconfigured') {
        setStatus('unconfigured');
        setMessage(result.message);
      } else {
        setStatus('error');
        setMessage(result.message);
        setErrors(result.fieldErrors ?? {});
        const firstKey = Object.keys(result.fieldErrors ?? {})[0];
        if (firstKey) {
          document.getElementById(fid(firstKey))?.focus();
          return;
        }
      }
    } catch {
      setStatus('error');
      setMessage('The request could not be sent. Check your connection and try again.');
    }

    statusRef.current?.focus();
  }

  if (!configured) {
    return (
      <div className="form__status" role="status">
        <p className="label label--accent" style={{ marginBottom: 12 }}>
          Form unavailable
        </p>
        <p className="small" style={{ marginBottom: 16 }}>
          This deployment has no delivery provider configured, so the form is switched off rather
          than accepting details it cannot send anywhere.
        </p>
        <p className="small">
          Set <code className="mono">CONTACT_WEBHOOK_URL</code>, or{' '}
          <code className="mono">RESEND_API_KEY</code> together with{' '}
          <code className="mono">CONTACT_TO_EMAIL</code>, to enable it.
        </p>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="form__status" role="status" tabIndex={-1} ref={statusRef}>
        <p className="label label--accent" style={{ marginBottom: 12 }}>
          Request received
        </p>
        <p className="small" style={{ marginBottom: 12 }}>
          Your request has been sent. Reference <strong className="mono">{reference}</strong>.
        </p>
        <p className="small">
          We reply to every request. If it is a fit, the next step is a scoping call to agree the
          data window for the assessment.
        </p>
      </div>
    );
  }

  const invalid = (name: keyof FieldErrors) => Boolean(errors[name]);

  return (
    <form className="form" onSubmit={onSubmit} noValidate>
      <div
        className={`form__status${status === 'error' ? ' form__status--error' : ''}`}
        role={status === 'error' || status === 'unconfigured' ? 'alert' : 'status'}
        tabIndex={-1}
        ref={statusRef}
        hidden={status !== 'error' && status !== 'unconfigured'}
      >
        <p className="label" style={{ marginBottom: 10 }}>
          {status === 'unconfigured' ? 'Nothing was sent' : 'Check these details'}
        </p>
        <p className="small">{message}</p>
      </div>

      <div className="form__row">
        <div className="field">
          <label className="field__label" htmlFor={fid('name')}>
            Name <span className="field__req">*</span>
          </label>
          <input
            className="field__control"
            id={fid('name')}
            name="name"
            type="text"
            autoComplete="name"
            required
            aria-invalid={invalid('name')}
            aria-describedby={invalid('name') ? eid('name') : undefined}
          />
          {invalid('name') ? (
            <p className="field__error" id={eid('name')}>
              <span aria-hidden="true">&times;</span>
              {errors.name}
            </p>
          ) : null}
        </div>

        <div className="field">
          <label className="field__label" htmlFor={fid('email')}>
            Work email <span className="field__req">*</span>
          </label>
          <input
            className="field__control"
            id={fid('email')}
            name="email"
            type="email"
            autoComplete="email"
            required
            aria-invalid={invalid('email')}
            aria-describedby={invalid('email') ? eid('email') : undefined}
          />
          {invalid('email') ? (
            <p className="field__error" id={eid('email')}>
              <span aria-hidden="true">&times;</span>
              {errors.email}
            </p>
          ) : null}
        </div>
      </div>

      <div className="form__row">
        <div className="field">
          <label className="field__label" htmlFor={fid('organisation')}>
            Organisation <span className="field__req">*</span>
          </label>
          <input
            className="field__control"
            id={fid('organisation')}
            name="organisation"
            type="text"
            autoComplete="organization"
            required
            aria-invalid={invalid('organisation')}
            aria-describedby={invalid('organisation') ? eid('organisation') : undefined}
          />
          {invalid('organisation') ? (
            <p className="field__error" id={eid('organisation')}>
              <span aria-hidden="true">&times;</span>
              {errors.organisation}
            </p>
          ) : null}
        </div>

        <div className="field">
          <label className="field__label" htmlFor={fid('role')}>
            Role
          </label>
          <input
            className="field__control"
            id={fid('role')}
            name="role"
            type="text"
            autoComplete="organization-title"
          />
        </div>
      </div>

      <div className="form__row">
        <div className="field">
          <label className="field__label" htmlFor={fid('sector')}>
            Sector <span className="field__req">*</span>
          </label>
          <select
            className="field__control"
            id={fid('sector')}
            name="sector"
            defaultValue="veterinary"
            required
          >
            {SECTORS.map((value) => (
              <option key={value} value={value}>
                {SECTOR_LABELS[value]}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label className="field__label" htmlFor={fid('sites')}>
            Sites <span className="field__req">*</span>
          </label>
          <select
            className="field__control"
            id={fid('sites')}
            name="sites"
            defaultValue="2-5"
            required
          >
            {SITE_BANDS.map((value) => (
              <option key={value} value={value}>
                {SITE_LABELS[value]}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="field">
        <label className="field__label" htmlFor={fid('message')}>
          What are you trying to recover? <span className="field__req">*</span>
        </label>
        <textarea
          className="field__control"
          id={fid('message')}
          name="message"
          rows={6}
          required
          minLength={20}
          maxLength={2000}
          aria-invalid={invalid('message')}
          aria-describedby={`${fid('message')}-hint${invalid('message') ? ` ${eid('message')}` : ''}`}
        />
        <p className="field__hint" id={`${fid('message')}-hint`}>
          {dataNotice}
        </p>
        {invalid('message') ? (
          <p className="field__error" id={eid('message')}>
            <span aria-hidden="true">&times;</span>
            {errors.message}
          </p>
        ) : null}
      </div>

      {/* Honeypot — visually and programmatically removed from the form flow. */}
      <div className="honeypot" aria-hidden="true">
        <label htmlFor={fid('website')}>Website</label>
        <input id={fid('website')} name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div>
        <button className="btn" type="submit" disabled={status === 'submitting'}>
          {status === 'submitting' ? 'Sending…' : 'Send request'}
          <span className="btn__arrow" aria-hidden="true">
            &rarr;
          </span>
        </button>
      </div>
    </form>
  );
}
