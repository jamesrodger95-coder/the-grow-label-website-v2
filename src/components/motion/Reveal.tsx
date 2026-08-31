import type { CSSProperties, ElementType, ReactNode } from 'react';

/**
 * The entry point for entrance motion.
 *
 * A SERVER COMPONENT. It renders markup and nothing else.
 *
 * It used to be a client component holding `useInView`, which meant one React
 * component, one piece of state and one IntersectionObserver per revealed
 * element. The homepage renders about 118 of them, so that was 118 components
 * to hydrate and 66 observers to register, all to answer the same question and
 * set the same attribute. Lighthouse attributed 767ms of script evaluation and
 * a 476ms total blocking time to the homepage, most of it hydration.
 *
 * Now the element ships as plain HTML carrying `data-reveal`, and
 * `MotionProvider` runs ONE observer across all of them, writing
 * `data-inview="true"` straight to the DOM as each arrives. No hydration, no
 * state, no per-element observer.
 *
 * Variants, each belonging to a kind of content:
 *
 *   line  — display type, rising out of a clipping mask
 *   rise  — prose and controls
 *   card  — panels (resolves to rise; kept as a call site)
 *   wipe  — rows and tables (resolves to rise; kept as a call site)
 *   rule  — hairlines, drawn from the leading edge
 *   group — no effect; the element only carries state for its children
 *
 * Everything renders in its final state until MotionProvider enables motion,
 * so a blocked bundle leaves a complete page.
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
  id?: string;
  role?: string;
  ariaLabelledBy?: string;
}) {
  const classes = [VARIANT_CLASS[variant], className].filter(Boolean).join(' ');

  return (
    <Tag
      id={id}
      role={role}
      aria-labelledby={ariaLabelledBy}
      className={classes || undefined}
      data-reveal=""
      data-inview="false"
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
 *
 * The observer in MotionProvider marks the heading and every `.m-line` inside
 * it, so the lines do not need a selector that reaches through an unqualified
 * ancestor.
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
  return (
    <Tag id={id} className={className} data-reveal="" data-inview="false">
      {lines.map((line, i) => (
        <span
          className="m-line"
          key={i}
          data-inview="false"
          style={{ '--i': startIndex + i } as CSSProperties}
        >
          <span>{line}</span>
        </span>
      ))}
    </Tag>
  );
}
