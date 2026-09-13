'use client';

import { useRef, useState, type CSSProperties } from 'react';
import { TESTIMONIALS, type Testimonial } from '@/content/testimonials';
import { QUOTES_SECTION } from '@/content/proof';

/**
 * Written testimonials on two rails moving in opposition.
 *
 * The rails are CSS animations on a duplicated track, so the loop has no
 * visible seam without a scroll listener. They pause on hover and on keyboard
 * focus, and the arrows step through the set for anyone who would rather not
 * wait for a card to come round.
 *
 * There is no play/pause control. It existed to satisfy the rule that motion
 * carrying content must be stoppable, and it does not need a button to do
 * that: the rails stop under the pointer, stop on focus, stop entirely under
 * `prefers-reduced-motion`, and collapse to a swipeable track below 720px. A
 * third control in the header bought nothing those four already covered.
 *
 * Below 720px and under reduced motion the rails become one horizontally
 * swipeable track: cheaper on a phone, and a better fit for a thumb than
 * content that moves away while it is being read.
 */

function Avatar({ hue, name }: { hue: number; name: string }) {
  const initials = name
    .split(' ')
    .filter((word) => !/^(dr|mr|mrs|ms|prof)\.?$/i.test(word))
    .slice(0, 2)
    .map((w) => w[0])
    .join('');
  return (
    <span className="quote__avatar" aria-hidden="true">
      <svg viewBox="0 0 48 48" width="42" height="42" aria-hidden="true" focusable="false">
        <rect width="48" height="48" fill={`hsl(${hue} 32% 92%)`} />
        <text
          x="24"
          y="24"
          textAnchor="middle"
          dominantBaseline="central"
          fontSize="15"
          fontWeight="500"
          fill={`hsl(${hue} 42% 44%)`}
        >
          {initials}
        </text>
      </svg>
    </span>
  );
}

function QuoteCard({ item }: { item: Testimonial }) {
  return (
    <figure className="quote">
      <div className="quote__head">
        <svg className="quote__mark" viewBox="0 0 24 20" aria-hidden="true">
          <path
            fill="currentColor"
            d="M0 20V11.6C0 5.6 3.2 1.2 9 0l1.2 3C6.7 4.1 5 6.2 5 9h4v11H0Zm13.8 0V11.6C13.8 5.6 17 1.2 22.8 0L24 3c-3.5 1.1-5.2 3.2-5.2 6h4v11h-9Z"
          />
        </svg>
      </div>
      <blockquote className="quote__text">
        <p>{item.quote}</p>
      </blockquote>
      <figcaption className="quote__who">
        <Avatar hue={item.hue} name={item.name} />
        <span>
          <span className="quote__name">{item.name}</span>
          <span className="quote__role">{item.role}</span>
        </span>
      </figcaption>
    </figure>
  );
}

export function Testimonials() {
  const [paused, setPaused] = useState(false);
  const [offset, setOffset] = useState(0);
  const railRef = useRef<HTMLDivElement | null>(null);

  const half = Math.ceil(TESTIMONIALS.length / 2);
  const rowA = TESTIMONIALS.slice(0, half);
  const rowB = TESTIMONIALS.slice(half);

  // Manual navigation reorders the set, which works whether the rails are
  // animating or the track has collapsed to a swipeable row on mobile.
  const step = (direction: 1 | -1) => {
    setPaused(true);
    setOffset((current) => (current + direction + TESTIMONIALS.length) % TESTIMONIALS.length);
    const track = railRef.current?.querySelector<HTMLElement>('.rail-row');
    if (track && track.scrollWidth > track.clientWidth) {
      track.scrollBy({ left: direction * 340, behavior: 'smooth' });
    }
  };

  const rotate = (items: Testimonial[]) => items.map((_, i) => items[(i + offset) % items.length]!);

  return (
    <section className="surface--white on-light section" aria-labelledby="quotes-title">
      <div className="shell">
        <div className="sec-head">
          <div>
            <span className="eyebrow sec-head__eyebrow">{QUOTES_SECTION.eyebrow}</span>
            <h2 className="display d2" id="quotes-title">
              {QUOTES_SECTION.title} <em>{QUOTES_SECTION.emphasis}</em>
            </h2>
          </div>
          <div className="rails__controls" role="group" aria-label="Testimonial controls">
            <button
              type="button"
              className="railbtn"
              onClick={() => step(-1)}
              aria-label="Previous testimonial"
            >
              <span aria-hidden="true">&larr;</span>
            </button>
            <button
              type="button"
              className="railbtn"
              onClick={() => step(1)}
              aria-label="Next testimonial"
            >
              <span aria-hidden="true">&rarr;</span>
            </button>
          </div>
        </div>
      </div>

      <div
        className="rails"
        ref={railRef}
        data-paused={paused ? 'true' : 'false'}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocusCapture={() => setPaused(true)}
        onBlurCapture={() => setPaused(false)}
      >
        <div className="rail-row" style={{ '--rail-dur': '72s' } as CSSProperties}>
          {[...rotate(rowA), ...rotate(rowA)].map((item, i) => (
            <QuoteCard item={item} key={`a${i}`} />
          ))}
        </div>
        <div
          className="rail-row rail-row--second"
          style={{ '--rail-dur': '86s', '--rail-dir': 'reverse' } as CSSProperties}
        >
          {[...rotate(rowB), ...rotate(rowB)].map((item, i) => (
            <QuoteCard item={item} key={`b${i}`} />
          ))}
        </div>
      </div>
    </section>
  );
}
