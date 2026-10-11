'use client';

import { useRef, type ReactNode } from 'react';
import { useScene } from '@/components/modules/scene/useScene';

/**
 * A sentence that fills in, word by word, as it scrolls through the screen.
 *
 * Every word is rendered at full strength; the scene dims the ones the reader
 * has not reached yet, so with scripts blocked or reduced motion the line is
 * simply there. Only opacity is written.
 */
export function StatementWords({
  lines,
  pills,
}: {
  /** Each line's words; the second line is in purple. */
  lines: string[];
  /** One decorative piece of work set at the end of each line. */
  pills: ReactNode[];
}) {
  const words = lines.map((line) => line.split(' '));
  const total = words.reduce((a, w) => a + w.length, 0);

  // Each line's first word's index across the whole sentence.
  const offsets = words.map((_, l) => words.slice(0, l).reduce((a, w) => a + w.length, 0));

  const line = useRef<HTMLParagraphElement | null>(null);
  const host = useScene<HTMLDivElement>(
    (p) => {
      const el = line.current;
      if (!el) return;
      const spans = el.querySelectorAll<HTMLElement>('.statement__word');
      spans.forEach((span, i) => {
        const v = Math.min(1, Math.max(0, p * (total + 2) - i));
        span.style.opacity = (0.16 + 0.84 * v).toFixed(3);
      });
    },
    { from: 0.85, to: 0.3 }
  );

  return (
    <div ref={host}>
      <p className="statement__line" ref={line}>
        {words.map((row, l) => {
          const content = (
            <>
              {row.map((word, w) => {
                const i = offsets[l]! + w;
                return (
                  <span className="statement__word" key={i}>
                    {word}{' '}
                  </span>
                );
              })}
              {pills[l]}
            </>
          );
          return (
            <span className="statement__row" key={l}>
              {l === 1 ? <em>{content}</em> : content}
            </span>
          );
        })}
      </p>
    </div>
  );
}
