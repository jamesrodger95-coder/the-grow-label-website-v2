'use client';

import { useId, useState, type FormEvent } from 'react';
import { REPORT, RESULT } from '@/content/calculator';
import type { LeadResult } from '@/lib/calculator/lead-fields';
import type { Answers, Estimate } from '@/lib/calculator/model';

/**
 * Email capture, and the report itself.
 *
 * Two things are deliberately separate here. The lead goes to a CRM and can
 * fail; the report is built in this browser and cannot. So a deployment with
 * nowhere to send the lead says exactly that — it never reports a capture that
 * did not happen — and hands over the report anyway, because withholding it
 * would be punishing the reader for our own configuration.
 *
 * The PDF library is imported inside the click handler. It is the heaviest
 * thing this feature touches and it must not be on the critical path of a page
 * most people will open from a cold email on a phone.
 */

type Status = 'idle' | 'working' | 'done' | 'unconfigured' | 'failed';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function ReportDownload({ answers, estimate }: { answers: Answers; estimate: Estimate }) {
  const formId = useId();
  const [status, setStatus] = useState<Status>('idle');
  const [emailError, setEmailError] = useState('');
  const [message, setMessage] = useState('');

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === 'working') return;

    const data = new FormData(event.currentTarget);
    const email = String(data.get('email') ?? '').trim();
    const practiceName = String(data.get('practiceName') ?? '').trim();
    const website = String(data.get('website') ?? '');

    if (!EMAIL.test(email)) {
      setEmailError(RESULT.emailError);
      document.getElementById(`${formId}-email`)?.focus();
      return;
    }

    setEmailError('');
    setStatus('working');
    setMessage('');

    // The lead first, so a slow CRM does not sit behind a 300KB import.
    let outcome: Status = 'done';
    let detail = '';
    try {
      const res = await fetch('/api/calculator/lead', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email, practiceName, answers, website }),
      });
      const result = (await res.json()) as LeadResult;
      if (result.status === 'unconfigured') {
        outcome = 'unconfigured';
        detail = RESULT.unconfigured;
      } else if (result.status === 'error') {
        outcome = 'failed';
        detail = RESULT.failed;
      }
    } catch {
      outcome = 'failed';
      detail = RESULT.failed;
    }

    try {
      const { buildReport } = await import('@/lib/calculator/report');
      const bytes = await buildReport({ answers, estimate, practiceName });
      const blob = new Blob([bytes as BlobPart], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = REPORT.filename;
      document.body.append(link);
      link.click();
      link.remove();
      // Revoked on the next task, so the download has certainly started.
      setTimeout(() => URL.revokeObjectURL(url), 0);
    } catch {
      setStatus('failed');
      setMessage('The report could not be generated in this browser. Please try again.');
      return;
    }

    setStatus(outcome);
    setMessage(detail);
  }

  return (
    <div className="calc__report">
      <h3 className="display d4">{RESULT.reportTitle}</h3>
      <p className="small calc__reportlead">{RESULT.reportLead}</p>

      {status === 'done' || status === 'unconfigured' || status === 'failed' ? (
        <div
          className={`form__status${status === 'failed' ? ' form__status--error' : ''}`}
          role="status"
        >
          <p className="label" style={{ marginBottom: 10 }}>
            {status === 'done' ? 'Report downloaded' : 'Nothing was sent'}
          </p>
          <p className="small">{message || RESULT.reportReady}</p>
          {status !== 'done' ? (
            <p className="small" style={{ marginTop: 10 }}>
              {RESULT.reportReady}
            </p>
          ) : null}
        </div>
      ) : (
        <form className="form calc__reportform" onSubmit={onSubmit} noValidate>
          <div className="field-group">
            <label className="field__label" htmlFor={`${formId}-email`}>
              {RESULT.emailLabel} <span className="field__req">*</span>
            </label>
            <input
              className="field__control"
              id={`${formId}-email`}
              name="email"
              type="email"
              autoComplete="email"
              required
              aria-invalid={Boolean(emailError)}
              aria-describedby={emailError ? `${formId}-email-error` : `${formId}-privacy`}
            />
            {emailError ? (
              <p className="field__error" id={`${formId}-email-error`}>
                <span aria-hidden="true">&times;</span>
                {emailError}
              </p>
            ) : null}
          </div>

          <div className="field-group">
            <label className="field__label" htmlFor={`${formId}-name`}>
              {RESULT.nameLabel}
            </label>
            <input
              className="field__control"
              id={`${formId}-name`}
              name="practiceName"
              type="text"
              autoComplete="organization"
              aria-describedby={`${formId}-namehelp`}
            />
            <p className="field__hint" id={`${formId}-namehelp`}>
              {RESULT.nameHelp}
            </p>
          </div>

          {/* Honeypot — visually and programmatically removed from the flow. */}
          <div className="honeypot" aria-hidden="true">
            <label htmlFor={`${formId}-website`}>Website</label>
            <input
              id={`${formId}-website`}
              name="website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
            />
          </div>

          <div>
            <button className="btn" type="submit" disabled={status === 'working'}>
              {status === 'working' ? RESULT.reportPreparing : RESULT.reportCta}
              <span className="btn__arrow" aria-hidden="true">
                &rarr;
              </span>
            </button>
          </div>

          <p className="micro" id={`${formId}-privacy`}>
            {RESULT.privacy}
          </p>
        </form>
      )}
    </div>
  );
}
