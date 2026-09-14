import Link from 'next/link';
import type { ReactNode } from 'react';
import { Reveal } from '@/components/motion/Reveal';

/**
 * Server-rendered design-system primitives. None of these are client
 * components: they are structure and type only, and any motion they take part
 * in is driven by the `Reveal` wrapper or by CSS.
 */

/* -------------------------------------------------------------------------- */
/* Section header                                                             */
/* -------------------------------------------------------------------------- */

/**
 * The opening of a section.
 *
 * There is deliberately no section counter. A reader does not need to be told
 * they are on section three of five, and a numbered spine only carries meaning
 * where the order itself does — which, outside the four value stages, it does
 * not. The eyebrow names the subject instead.
 */
export function SectionHeader({
  eyebrow,
  aside,
  title,
  emphasis,
  id,
  headingLevel = 2,
}: {
  eyebrow?: string;
  aside?: string;
  title: string;
  emphasis?: string;
  id?: string;
  headingLevel?: 2 | 3;
}) {
  const Heading = headingLevel === 3 ? 'h3' : 'h2';
  return (
    <div className="sec-head">
      <div>
        {eyebrow ? <span className="eyebrow sec-head__eyebrow">{eyebrow}</span> : null}
        <Heading className="display d2" id={id}>
          {title}
          {emphasis ? (
            <>
              {' '}
              <em>{emphasis}</em>
            </>
          ) : null}
        </Heading>
      </div>
      {aside ? <p className="sec-head__aside">{aside}</p> : null}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Actions                                                                    */
/* -------------------------------------------------------------------------- */

export function ActionLink({
  href,
  children,
  variant = 'solid',
  block = false,
  external = false,
}: {
  href: string;
  children: ReactNode;
  variant?: 'solid' | 'ghost';
  block?: boolean;
  external?: boolean;
}) {
  const className = `btn${variant === 'ghost' ? ' btn--ghost' : ''}`;
  const style = block ? { justifyContent: 'space-between' as const, width: '100%' } : undefined;
  const content = (
    <>
      {children}
      <span className="btn__arrow" aria-hidden="true">
        &rarr;
      </span>
    </>
  );

  if (external) {
    return (
      <a className={className} style={style} href={href} rel="noopener noreferrer" target="_blank">
        {content}
      </a>
    );
  }
  return (
    <Link className={className} style={style} href={href}>
      {content}
    </Link>
  );
}

export function TextLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link className="tlink" href={href}>
      {children}
      <span aria-hidden="true">&rarr;</span>
    </Link>
  );
}

/* -------------------------------------------------------------------------- */
/* Ledger row                                                                 */
/* -------------------------------------------------------------------------- */

export function LedgerRow({
  index,
  title,
  detail,
  tag,
}: {
  index: string;
  title: string;
  detail: string;
  tag?: string;
}) {
  return (
    <div className="lrow">
      <span className="lrow__idx">{index}</span>
      <span className="lrow__key">{title}</span>
      <span className="lrow__val">{detail}</span>
      {tag ? <span className="lrow__tag">{tag}</span> : <span aria-hidden="true" />}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Key/value strip                                                            */
/* -------------------------------------------------------------------------- */

export function KeyValueStrip({ items }: { items: readonly { key: string; detail: string }[] }) {
  return (
    <dl className="kv">
      {items.map((item) => (
        <div className="kv__cell" key={item.key}>
          <dt className="label kv__key">{item.key}</dt>
          <dd className="micro" style={{ margin: 0 }}>
            {item.detail}
          </dd>
        </div>
      ))}
    </dl>
  );
}

/* -------------------------------------------------------------------------- */
/* Numbered step list                                                         */
/* -------------------------------------------------------------------------- */

/**
 * A numbered list of steps.
 *
 * `glow` opts a list into lighting its numbers as they arrive: each row
 * becomes its own `Reveal`, so it carries `data-inview` on ITSELF — which is
 * the whole trick, and the one the motion notes warn about, because CSS that
 * keys off a parent's attribute lights every row at once. The number then
 * takes the purple response as it lands, and stays lit.
 *
 * It is opt-in rather than the default because most of the step lists on this
 * site are reference material — the controls on `/platform`, what we cannot
 * claim — where a row lighting up as you reach it would be decoration. It is
 * used where the list is the section's argument and is read in order.
 */
export function StepList({
  items,
  headingLevel = 3,
  glow = false,
}: {
  items: readonly { index: string; title: string; detail: string }[];
  headingLevel?: 3 | 4;
  glow?: boolean;
}) {
  const Heading = headingLevel === 4 ? 'h4' : 'h3';
  return (
    <div className="steps">
      {items.map((item, i) =>
        glow ? (
          <Reveal className="step step--glow" key={item.index} variant="rise" index={i}>
            <span className="step__num">{item.index}</span>
            <Heading className="step__title">{item.title}</Heading>
            <p className="small">{item.detail}</p>
          </Reveal>
        ) : (
          <div className="step" key={item.index}>
            <span className="step__num">{item.index}</span>
            <Heading className="step__title">{item.title}</Heading>
            <p className="small">{item.detail}</p>
          </div>
        )
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Capacity column                                                            */
/* -------------------------------------------------------------------------- */

export type SlotState = 'filled' | 'open' | 'recovered';

export function CapacityColumn({
  slots,
  label,
  note,
  openLabel,
}: {
  slots: readonly SlotState[];
  label?: string;
  note?: string;
  openLabel?: string;
}) {
  return (
    <div className="capblock">
      {label ? (
        <div className="capblock__head">
          <span className="label">{label}</span>
          {openLabel ? <span className="label label--accent">{openLabel}</span> : null}
        </div>
      ) : null}
      <div className="capcol" aria-hidden="true">
        {slots.map((state, i) => (
          <span
            // Slots are positional and never reordered.
            key={i}
            className={
              state === 'open'
                ? 'capslot capslot--open'
                : state === 'recovered'
                  ? 'capslot capslot--recovered'
                  : 'capslot'
            }
            style={{ '--i': i } as React.CSSProperties}
          />
        ))}
      </div>
      {note ? (
        <div className="capblock__foot">
          <p className="micro">{note}</p>
        </div>
      ) : null}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Four-stage value bar — the signature proof device                          */
/* -------------------------------------------------------------------------- */

export type StageRow = {
  name: string;
  /** 0–100. Illustrative proportions only; never a benchmark. */
  width: number;
  figure: string;
};

export function StageBar({
  rows,
  caption,
  labelledBy,
}: {
  rows: readonly StageRow[];
  caption?: string;
  labelledBy?: string;
}) {
  return (
    <div>
      {/* The bar itself is the observed element: the fills key off
          `.stagebar[data-inview="true"]`, so putting the observer on a wrapper
          would leave them at scaleX(0) and invisible. */}
      <Reveal
        as="div"
        variant="group"
        className="stagebar"
        role="group"
        ariaLabelledBy={labelledBy}
      >
        {rows.map((row, i) => (
          <div className="stagebar__row" key={row.name}>
            <span className="stagebar__name">{row.name}</span>
            <span className="stagebar__track">
              <span
                className="stagebar__fill"
                style={
                  {
                    '--w': `${row.width}%`,
                    '--c': `var(--stage-${i + 1})`,
                    '--i': i,
                  } as React.CSSProperties
                }
              />
            </span>
            <span className="stagebar__fig">{row.figure}</span>
          </div>
        ))}
      </Reveal>
      {caption ? (
        <p className="micro" style={{ marginTop: 16 }}>
          {caption}
        </p>
      ) : null}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Pull statement                                                             */
/* -------------------------------------------------------------------------- */

export function PullStatement({
  label,
  title,
  emphasis,
  body,
}: {
  label?: string;
  title: string;
  emphasis?: string;
  body?: string;
}) {
  return (
    <div className="pull">
      {label ? (
        <p className="label label--accent" style={{ marginBottom: 20 }}>
          {label}
        </p>
      ) : null}
      <p className="pull__text">
        {title}
        {emphasis ? (
          <>
            {' '}
            <em>{emphasis}</em>
          </>
        ) : null}
      </p>
      {body ? (
        <p className="small" style={{ marginTop: 24, maxWidth: '62ch' }}>
          {body}
        </p>
      ) : null}
    </div>
  );
}
