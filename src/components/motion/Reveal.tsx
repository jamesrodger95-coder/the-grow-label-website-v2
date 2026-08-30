'use client';

import type { CSSProperties, ElementType, ReactNode } from 'react';
import { useInView } from './useInView';

/**
 * The single entry point for entrance motion.
 *
 * `variant` selects one of the three motion verbs; nothing else is available,
 * which is what keeps the motion language coherent. The element renders in its
 * final state until MotionProvider has enabled motion, so this never delays or
 * hides meaningful content.
 */
export type RevealVariant = 'detect' | 'reveal' | 'rule' | 'group';

const VARIANT_CLASS: Record<RevealVariant, string> = {
  detect: 'm-detect',
  reveal: 'm-reveal',
  rule: 'm-rule',
  group: '',
};

export function Reveal({
  children,
  as: Tag = 'div',
  variant = 'detect',
  index = 0,
  className,
  style,
  rootMargin,
  id,
}: {
  children: ReactNode;
  as?: ElementType;
  variant?: RevealVariant;
  /** Stagger position. Multiplied by the per-variant delay step. */
  index?: number;
  className?: string;
  style?: CSSProperties;
  rootMargin?: string;
  id?: string;
}) {
  const { ref, inView } = useInView<HTMLElement>(rootMargin);
  const classes = [VARIANT_CLASS[variant], className].filter(Boolean).join(' ');

  return (
    <Tag
      ref={ref}
      id={id}
      className={classes || undefined}
      data-inview={inView ? 'true' : 'false'}
      style={{ '--i': index, ...style } as CSSProperties}
    >
      {children}
    </Tag>
  );
}
