'use client';

import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { VIDEO_TESTIMONIALS, type VideoTestimonial } from '@/content/proof';

/**
 * Video testimonials.
 *
 * Nothing loads until a card is opened: the grid is inert thumbnails, and the
 * iframe is mounted only inside the modal, so no third-party player, cookie or
 * megabyte arrives on first paint. Audio never autoplays — the embed is created
 * on click, which is the only point a browser would allow sound anyway.
 *
 * Until a real `src` is supplied each card opens an honest empty state rather
 * than a broken player.
 */

function Thumb({ hue }: { hue: number }) {
  return (
    <svg viewBox="0 0 160 100" className="case__svg" role="img" aria-label="">
      <defs>
        <linearGradient id={`vg${hue}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={`hsl(${hue} 30% 93%)`} />
          <stop offset="100%" stopColor={`hsl(${hue} 26% 86%)`} />
        </linearGradient>
      </defs>
      <rect width="160" height="100" fill={`url(#vg${hue})`} />
      <circle cx="80" cy="42" r="15" fill={`hsl(${hue} 30% 78%)`} />
      <path d="M56 100c4-15 12-23 24-23s20 8 24 23Z" fill={`hsl(${hue} 30% 78%)`} />
    </svg>
  );
}

export function VideoTestimonials() {
  const [active, setActive] = useState<VideoTestimonial | null>(null);

  return (
    <section className="surface--paper on-light section" aria-labelledby="videos-title">
      <div className="shell">
        <div className="sec-head">
          <div>
            <span className="eyebrow sec-head__eyebrow">On camera</span>
            <h2 className="display d2" id="videos-title">
              Video testimonials, <em>when they are recorded.</em>
            </h2>
          </div>
          <p className="sec-head__aside">Nothing loads until you press play</p>
        </div>

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '12px 18px',
            alignItems: 'center',
            marginBottom: 32,
          }}
        >
          <span className="placeholder-tag">Placeholder</span>
          <p className="small" style={{ flex: '1 1 24rem', margin: 0 }}>
            Thumbnails and the player are in place. Each card opens an empty state until a real
            recording and a signed release exist for it.
          </p>
        </div>

        <div className="videos">
          {VIDEO_TESTIMONIALS.map((video) => (
            <button
              type="button"
              className="vcard"
              key={video.id}
              onClick={() => setActive(video)}
              aria-label={`Play testimonial from ${video.name}, ${video.role}`}
            >
              <span className="vcard__thumb">
                <span className="vcard__thumbinner">
                  <Thumb hue={video.hue} />
                </span>
                <span className="vcard__play" aria-hidden="true">
                  <svg width="17" height="19" viewBox="0 0 17 19">
                    <path d="M17 9.5 0 19V0z" fill="currentColor" />
                  </svg>
                </span>
                <span className="vcard__dur">{video.duration}</span>
              </span>
              <span className="vcard__body">
                <span className="vcard__name">{video.name}</span>
                <span className="vcard__role">
                  {video.role} · {video.org}
                </span>
              </span>
            </button>
          ))}
        </div>
      </div>

      <Modal open={active !== null} onClose={() => setActive(null)} labelledBy="video-modal-title">
        {active ? (
          <>
            {active.src ? (
              <div className="modal__video" style={{ padding: 0 }}>
                <iframe
                  src={active.src}
                  title={`Testimonial from ${active.name}`}
                  allow="accelerometer; encrypted-media; picture-in-picture"
                  allowFullScreen
                  loading="lazy"
                  style={{ width: '100%', height: '100%', border: 0 }}
                />
              </div>
            ) : (
              <div className="modal__video">
                <div>
                  <p className="label label--strong" style={{ marginBottom: 10 }}>
                    No recording yet
                  </p>
                  <p className="small" style={{ maxWidth: '38ch', color: 'inherit' }}>
                    This slot is wired and ready. Supply an embed URL in{' '}
                    <code>src/content/proof.ts</code> and the player appears here.
                  </p>
                </div>
              </div>
            )}
            <div className="modal__body">
              <h3 className="d4" id="video-modal-title">
                {active.name}
              </h3>
              <p className="small" style={{ marginTop: 6 }}>
                {active.role} · {active.org}
              </p>
              <p style={{ marginTop: 16 }}>
                <span className="placeholder-tag">Placeholder profile</span>
              </p>
            </div>
          </>
        ) : null}
      </Modal>
    </section>
  );
}
