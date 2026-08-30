'use client';

import type { CSSProperties, ElementType, ReactNode } from 'react';
import { useInView } from './useInView';

/**
 * The entry point for entrance motion.
 *
 * Five variants, each belonging to a kind of content. Applying one effect to
 * everything is what makes a page feel templated, so the variant is a
 * deliberate choice rather than a default:
 *
 *   line  — display type, rising out of a clipping mask
 *   rise  — prose and controls
 *   card  — panels, which settle with a touch of scale
 *   wipe  — rows and tables, revealed by a clip rather than a jump
 *   rule  — hairlines, drawn from the leading edge
 *   group — no effect; the element only carries `data-inview` for its children
 *
 * Everything renders in its final state until MotionProvider enables motion.
 */
export type RevealVariant = 'line' | 'rise' | 'card' | 'wipe' | 'rule' | 'group';

const VARIANT_CLASS: Record<RevealVariant, string> = {
  line: 'm-line',
  rise: 'm-rise',
  card: 'm-card',
  wipe: 'm-wipe',
  rule: 'm-rule',
  group: '',
};

export function Reveal({
  children,
  as: Tag = 'div',
  variant = 'rise',
  index = 0,
  className,
  style,
  rootMargin,
  id,
  role,
  ariaLabelledBy,
}: {
  children: ReactNode;
  as?: ElementType;
  variant?: RevealVariant;
  /** Stagger position, multiplied by the per-variant delay step. */
  index?: number;
  className?: string;
  style?: CSSProperties;
  rootMargin?: string;
  id?: string;
  role?: string;
  ariaLabelledBy?: string;
}) {
  const { ref, inView } = useInView<HTMLElement>(rootMargin);
  const classes = [VARIANT_CLASS[variant], className].filter(Boolean).join(' ');

  return (
    <Tag
      ref={ref}
      id={id}
      role={role}
      aria-labelledby={ariaLabelledBy}
      className={classes || undefined}
      data-inview={inView ? 'true' : 'false'}
      style={{ '--i': index, ...style } as CSSProperties}
    >
      {variant === 'wipe' ? <span className="m-wipe__inner">{children}</span> : children}
    </Tag>
  );
}

/**
 * A display heading whose lines rise independently.
 *
 * Each line is its own masked block, so the heading assembles rather than
 * fading in as one slab. Lines are supplied explicitly because a heading's line
 * breaks are a design decision, not something to measure at runtime.
 */
export function RevealLines({
  lines,
  as: Tag = 'h2',
  className,
  id,
  startIndex = 0,
}: {
  lines: ReactNode[];
  as?: ElementType;
  className?: string;
  id?: string;
  startIndex?: number;
}) {
  const { ref, inView } = useInView<HTMLElement>();

  return (
    <Tag ref={ref} id={id} className={className} data-inview={inView ? 'true' : 'false'}>
      {lines.map((line, i) => (
        <span
          className="m-line"
          key={i}
          data-inview={inView ? 'true' : 'false'}
          style={{ '--i': startIndex + i } as CSSProperties}
        >
          <span>{line}</span>
        </span>
      ))}
    </Tag>
  );
}
