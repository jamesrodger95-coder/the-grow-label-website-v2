import type { Metadata } from 'next';
import Link from 'next/link';
import { studioAccent } from '@/components/studio/fonts';
import { StudioFooter, StudioHeader } from '@/components/studio/Sections';
import { STUDIO_CALL } from '@/content/studio';

/**
 * /call: the booking page linked from every email. Q's Calendly event is
 * embedded as a plain iframe, so no third-party script runs on our page.
 * The route's CSP (next.config.ts) allows frames from calendly.com only here.
 */

export const metadata: Metadata = {
  title: { absolute: STUDIO_CALL.meta.title },
  description: STUDIO_CALL.meta.description,
  alternates: { canonical: '/call' },
};

const embed = `${STUDIO_CALL.bookingUrl}?embed_type=Inline&embed_domain=www.thegrowlabel.com&hide_gdpr_banner=1&primary_color=4a3ac4`;

export default function CallPage() {
  return (
    <div className={`studio ${studioAccent.variable}`}>
      <StudioHeader />
      <section className="studio-sample studio-call" id="top" aria-labelledby="call-title">
        <div className="studio-shell studio-call__grid">
          <div className="studio-sample__copy">
            <p className="studio-eyebrow">{STUDIO_CALL.eyebrow}</p>
            <h1 className="studio-display" id="call-title">
              {STUDIO_CALL.title} <em>{STUDIO_CALL.emphasis}</em>
            </h1>
            <p className="studio-sample__lead">{STUDIO_CALL.lead}</p>
            <ul className="studio-call__points">
              {STUDIO_CALL.points.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
            <p className="studio-sample__lead studio-call__alt">
              {STUDIO_CALL.sampleNote} <Link href={STUDIO_CALL.sampleLink.href}>{STUDIO_CALL.sampleLink.label}</Link>
            </p>
          </div>
          <div className="studio-call__card">
            <div className="studio-call__bar">
              <b>{STUDIO_CALL.barTitle}</b>
              <span>{STUDIO_CALL.barNote}</span>
            </div>
            <div className="studio-call__frame">
              <p className="studio-call__wait">{STUDIO_CALL.loading}</p>
              <iframe src={embed} title="Book a call with The Grow Label" loading="eager" />
            </div>
          </div>
          <p className="studio-call__note">
            {STUDIO_CALL.fallback}{' '}
            <a href={STUDIO_CALL.bookingUrl} target="_blank" rel="noopener">
              {STUDIO_CALL.fallbackLink} <span aria-hidden="true">↗</span>
            </a>
          </p>
        </div>
      </section>
      <StudioFooter />
    </div>
  );
}
