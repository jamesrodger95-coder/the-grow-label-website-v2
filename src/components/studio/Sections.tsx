import Image from 'next/image';
import Link from 'next/link';
import type { CSSProperties, ReactNode } from 'react';
import { Reveal, RevealLines } from '@/components/motion/Reveal';
import {
  STUDIO_BAND,
  STUDIO_FOOTER,
  STUDIO_HERO,
  STUDIO_MAKE,
  STUDIO_NAV,
  STUDIO_PROCESS,
  STUDIO_SAMPLE,
  STUDIO_STATEMENT,
  STUDIO_WORK,
} from '@/content/studio';
import type { ReelTile, WorkItem } from '@/lib/studio-media';
import { CalEmbed } from '@/components/calculator/CalEmbed';
import { StatementWords } from './StatementWords';
import { Tunnel } from './Tunnel';
import { LoopVideo, WorkGallery } from './WorkGallery';

/**
 * The /AI page's sections, in order. Server components; the client code is
 * the tunnel, the industry switcher, the gallery, the statement and the form.
 */

function Mark({ light = false }: { light?: boolean }) {
  return (
    <Image
      className="studio-logo__mark"
      src={light ? '/logo-mark-light.png' : '/logo-mark.png'}
      alt=""
      width={19}
      height={22}
      priority
    />
  );
}

function creditOf(item: WorkItem): string | undefined {
  if (!item.credit) return undefined;
  return item.credit.kind === 'client' ? item.credit.brand : STUDIO_WORK.concept;
}

function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="studio-eyebrow">{children}</p>;
}

/** A display heading whose second half is in purple. */
function Display({ id, title, emphasis }: { id: string; title: string; emphasis: string }) {
  return (
    <RevealLines
      as="h2"
      id={id}
      className="studio-display"
      lines={[title, <em key="e">{emphasis}</em>]}
    />
  );
}

/** One frame of work, or its reserved frame, at the piece's own shape. */
function Frame({ item, tone }: { item: WorkItem; tone: number }) {
  const [w, h] = item.ratio.split(':').map(Number);
  const style = { '--ratio': (w ?? 1) / (h ?? 1) } as CSSProperties;
  return (
    <span className="studio-frame" style={style}>
      {!item.src ? (
        <span className="work__slot" data-tone={tone}>
          <span className="work__slotlabel">{`${item.id.toUpperCase()} · ${item.ratio}`}</span>
        </span>
      ) : item.media === 'video' ? (
        <LoopVideo src={item.src} poster={item.poster} />
      ) : (
        <Image src={item.src} alt="" fill sizes="(max-width: 720px) 90vw, 40vw" />
      )}
    </span>
  );
}

export function StudioHeader() {
  return (
    <header className="studio-bar">
      <div className="studio-shell studio-bar__inner">
        <a className="studio-logo" href="#top" aria-label={`${STUDIO_NAV.brand}, back to top`}>
          <Mark />
          <span className="studio-logo__word">{STUDIO_NAV.brand}</span>
          <span className="studio-logo__tag">{STUDIO_NAV.tag}</span>
        </a>
        <nav className="studio-bar__links" aria-label="Page">
          {STUDIO_NAV.links.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>
        <a className="studio-btn studio-btn--small" href={STUDIO_NAV.cta.href}>
          {STUDIO_NAV.cta.label}
        </a>
      </div>
    </header>
  );
}

export function StudioHero({ tiles, live }: { tiles: ReelTile[]; live: boolean }) {
  return (
    <section className="studio-hero" id="top" aria-labelledby="studio-title">
      <div className="studio-shell studio-hero__copy">
        <Reveal as="p" className="studio-eyebrow" variant="rise">
          {STUDIO_HERO.eyebrow}
        </Reveal>
        <RevealLines
          as="h1"
          id="studio-title"
          className="studio-hero__title"
          lines={[
            STUDIO_HERO.titleLine,
            <>
              {STUDIO_HERO.titleRest} <em>{STUDIO_HERO.titleEmphasis}</em>
            </>,
          ]}
        />
      </div>

      <Tunnel
        tiles={tiles}
        live={live}
        label={live ? STUDIO_HERO.reelLabel : STUDIO_HERO.reelSlotsLabel}
        pauseLabel={STUDIO_HERO.pause}
        playLabel={STUDIO_HERO.play}
      />

      <Reveal className="studio-shell studio-hero__foot" variant="rise" index={2}>
        <p className="studio-hero__lead">{STUDIO_HERO.lead}</p>
        <div className="studio-hero__actions">
          <a className="studio-btn" href={STUDIO_HERO.primary.href}>
            {STUDIO_HERO.primary.label}
            <span aria-hidden="true">&rarr;</span>
          </a>
          <a className="studio-btn studio-btn--ghost" href={STUDIO_HERO.secondary.href}>
            {STUDIO_HERO.secondary.label}
          </a>
        </div>
        <p className="studio-hero__note">{STUDIO_HERO.note}</p>
      </Reveal>
    </section>
  );
}

/** Who the work is for, drifting past under the hero. */
export function StudioBand() {
  const run = (copy: number) => (
    <span className="band__run" aria-hidden={copy > 0 ? 'true' : undefined} key={copy}>
      {STUDIO_BAND.map((label) => (
        <span className="band__item" key={label}>
          {label}
          <span className="band__dot" aria-hidden="true" />
        </span>
      ))}
    </span>
  );
  return (
    <div className="studio-band">
      <div className="band__track">{[run(0), run(1), run(2)]}</div>
    </div>
  );
}

export function StudioWork({ items }: { items: WorkItem[] }) {
  return (
    <section className="studio-work" id="work" aria-labelledby="work-title">
      <div className="studio-shell">
        <div className="studio-head">
          <div>
            <Eyebrow>{STUDIO_WORK.eyebrow}</Eyebrow>
            <Display id="work-title" title={STUDIO_WORK.title} emphasis={STUDIO_WORK.emphasis} />
          </div>
          <Reveal as="p" className="studio-head__lead" index={1}>
            {STUDIO_WORK.lead}
          </Reveal>
        </div>
        <WorkGallery items={items} />
      </div>
    </section>
  );
}

/**
 * A single sentence across the full width that fills in as it is read, with
 * two pieces of the reel set into the line like words.
 */
/** The two widescreen pieces set into the statement, by portfolio id. */
const STATEMENT_PILLS = ['w44', 'w05'];

export function StudioStatement({ items }: { items: WorkItem[] }) {
  const pill = (id: string, tone: number) => {
    const item = items.find((w) => w.id === id && w.src);
    return (
      <span className="statement__pill" data-tone={tone} aria-hidden="true" key={id}>
        {item?.media === 'image' ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.src} alt="" loading="lazy" decoding="async" />
        ) : item ? (
          <LoopVideo src={item.src!} poster={item.poster} />
        ) : null}
      </span>
    );
  };
  return (
    <div className="studio-statement">
      <div className="studio-shell">
        <StatementWords
          lines={[STUDIO_STATEMENT.before, STUDIO_STATEMENT.after]}
          pills={STATEMENT_PILLS.map((id, i) => pill(id, i + 2))}
        />
      </div>
    </div>
  );
}

export function StudioMake({ items }: { items: WorkItem[] }) {
  return (
    <section className="studio-make" id="make" aria-labelledby="make-title">
      <div className="studio-shell">
        <Eyebrow>{STUDIO_MAKE.eyebrow}</Eyebrow>
        <Display id="make-title" title={STUDIO_MAKE.title} emphasis={STUDIO_MAKE.emphasis} />

        <ol className="make__list">
          {STUDIO_MAKE.items.map((entry, i) => {
            const matching = items.filter((w) => entry.treatments.includes(w.treatment));
            const piece = matching.find((w) => w.src) ?? matching[0];
            return (
              <li className="make__row" key={entry.index} data-side={i % 2 ? 'left' : 'right'}>
                <Reveal className="make__copy">
                  <span className="make__index">{entry.index}</span>
                  <h3 className="make__title">{entry.title}</h3>
                  <p className="make__body">{entry.body}</p>
                </Reveal>
                {piece ? (
                  <Reveal className="make__media" index={1}>
                    <Frame item={piece} tone={i + 1} />
                    <span className="make__credit">
                      {piece.src
                        ? [piece.title ?? piece.treatment, creditOf(piece)]
                            .filter(Boolean)
                            .join(' · ')
                        : `${piece.treatment} · ${STUDIO_WORK.slot}`}
                    </span>
                  </Reveal>
                ) : null}
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

export function StudioProcess() {
  return (
    <section className="studio-process" id="process" aria-labelledby="process-title">
      <div className="studio-shell">
        <div className="studio-head">
          <div>
            <Eyebrow>{STUDIO_PROCESS.eyebrow}</Eyebrow>
            <Display
              id="process-title"
              title={STUDIO_PROCESS.title}
              emphasis={STUDIO_PROCESS.emphasis}
            />
          </div>
        </div>
        <Reveal className="process__rule" variant="rule">
          {null}
        </Reveal>
        <ol className="process__steps">
          {STUDIO_PROCESS.steps.map((step, i) => (
            <Reveal as="li" className="process__step" key={step.index} index={i}>
              <span className="process__index">{step.index}</span>
              <h3 className="process__title">{step.title}</h3>
              <p className="process__body">{step.body}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function StudioSample() {
  return (
    <section className="studio-sample" id="sample" aria-labelledby="sample-title">
      <div className="studio-shell studio-sample__grid">
        <div className="studio-sample__copy">
          <Eyebrow>{STUDIO_SAMPLE.eyebrow}</Eyebrow>
          <Display
            id="sample-title"
            title={STUDIO_SAMPLE.title}
            emphasis={STUDIO_SAMPLE.emphasis}
          />
          <Reveal as="p" className="studio-sample__lead" index={1}>
            {STUDIO_SAMPLE.lead}
          </Reveal>
          <ul className="studio-sample__points">
            {STUDIO_SAMPLE.points.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </div>
        <Reveal className="studio-sample__form" index={1}>
          <CalEmbed bookingUrl={STUDIO_SAMPLE.bookingUrl} hideDetails />
        </Reveal>
      </div>
    </section>
  );
}

export function StudioFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="studio-footer">
      <div className="studio-shell">
        <p className="studio-footer__big" aria-hidden="true">
          {STUDIO_FOOTER.wordmark[0]} <em>{STUDIO_FOOTER.wordmark[1]}</em>
        </p>
      </div>
      <div className="studio-shell studio-footer__inner">
        <a
          className="studio-logo studio-logo--light"
          href="#top"
          aria-label={`${STUDIO_NAV.brand}, back to top`}
        >
          <Mark light />
          <span className="studio-logo__word">{STUDIO_NAV.brand}</span>
        </a>
        <p className="studio-footer__line">{STUDIO_FOOTER.line}</p>
        <nav className="studio-footer__legal" aria-label="Legal">
          {STUDIO_FOOTER.legal.map((link) => (
            <Link key={link.href} href={link.href}>
              {link.label}
            </Link>
          ))}
          <span>{`© ${year} ${STUDIO_NAV.brand}`}</span>
        </nav>
      </div>
    </footer>
  );
}
