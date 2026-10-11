'use client';

import Image from 'next/image';
import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from 'react';
import { STUDIO_WORK, TREATMENT_FILTER, type WorkFilter } from '@/content/studio';
import type { WorkItem } from '@/lib/studio-media';

/**
 * The portfolio: a filterable, editorial grid and a larger viewer.
 *
 * A frame whose file has not arrived is a reserved frame, not a button: there
 * is nothing to open, so it is not offered. The viewer steps through the
 * pieces that are both present and inside the current filter.
 *
 * The viewer is a native <dialog> opened with showModal(), which gives the
 * focus containment, the inert background and the Escape key for free.
 */

type Filter = 'all' | WorkFilter;

/** How many pieces show before "Show all". */
const INITIAL = 12;

function ratioValue(ratio: WorkItem['ratio']): number {
  const [w, h] = ratio.split(':').map(Number);
  return (w ?? 1) / (h ?? 1);
}

function creditLabel(item: WorkItem): string | undefined {
  if (!item.credit) return undefined;
  return item.credit.kind === 'client' ? item.credit.brand : STUDIO_WORK.concept;
}

/** Plays while on screen, muted and looping; paused otherwise. */
function useInViewPlayback(enabled: boolean) {
  const ref = useRef<HTMLVideoElement | null>(null);
  useEffect(() => {
    const video = ref.current;
    if (!video || !enabled || typeof IntersectionObserver === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) video.play().catch(() => {});
        else video.pause();
      },
      { threshold: 0.5 }
    );
    io.observe(video);
    return () => {
      io.disconnect();
      video.pause();
    };
  }, [enabled]);
  return ref;
}

/**
 * A silent loop that plays only while on screen. Used where a piece of work
 * illustrates a section rather than being offered to open.
 */
export function LoopVideo({ src, poster }: { src: string; poster?: string }) {
  const ref = useInViewPlayback(true);
  return (
    <video
      ref={ref}
      src={src}
      poster={poster}
      muted
      loop
      playsInline
      preload="none"
      tabIndex={-1}
      aria-hidden="true"
    />
  );
}

function Piece({
  item,
  index,
  hidden,
  onOpen,
}: {
  item: WorkItem;
  index: number;
  hidden: boolean;
  onOpen: (id: string) => void;
}) {
  const videoRef = useInViewPlayback(Boolean(item.src) && item.media === 'video');
  const windowRef = useRef<HTMLSpanElement | null>(null);
  const credit = creditLabel(item);
  const file = item.src
    ? item.src.split('/').pop()
    : `${item.id}.${item.media === 'video' ? 'mp4' : 'jpg'}`;

  // A small lean towards the pointer. Transform only, and none at all for a
  // reader who has asked for less motion.
  const lean = (event: PointerEvent<HTMLLIElement>) => {
    const el = windowRef.current;
    if (!el || event.pointerType !== 'mouse') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const rect = el.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(900px) rotateX(${(-y * 7).toFixed(2)}deg) rotateY(${(x * 9).toFixed(2)}deg)`;
  };
  const settle = () => {
    if (windowRef.current) windowRef.current.style.transform = '';
  };
  const style = { '--ratio': ratioValue(item.ratio), '--i': index } as CSSProperties;

  const media = !item.src ? (
    <span className="work__slot" data-tone={index % 6}>
      <span className="work__slotlabel">{`${item.id.toUpperCase()} · ${item.ratio}`}</span>
    </span>
  ) : item.media === 'video' ? (
    <video
      ref={videoRef}
      src={item.src}
      poster={item.poster}
      muted
      loop
      playsInline
      preload="none"
      tabIndex={-1}
      aria-hidden="true"
    />
  ) : (
    <Image src={item.src} alt="" fill sizes="(max-width: 720px) 50vw, 33vw" />
  );

  const caption = (
    <span className="work__caption">
      <span className="work__title">{item.title ?? item.treatment}</span>
      <span className="work__meta">
        {[
          item.title ? item.treatment : null,
          item.category,
          credit ?? (item.src ? null : STUDIO_WORK.slot),
        ]
          .filter(Boolean)
          .join(' · ')}
      </span>
    </span>
  );

  return (
    <li
      className="work__item"
      data-ratio={item.ratio}
      data-filter={TREATMENT_FILTER[item.treatment]}
      hidden={hidden}
      style={style}
      onPointerMove={lean}
      onPointerLeave={settle}
    >
      {item.src ? (
        <button
          type="button"
          className="work__open"
          onClick={() => onOpen(item.id)}
          aria-label={`${STUDIO_WORK.open}: ${item.title ?? item.treatment}${credit ? `, ${credit}` : ''}`}
        >
          <span className="work__window" ref={windowRef}>
            <span className="work__bar" aria-hidden="true">
              <i />
              <i />
              <i />
              <span className="work__file">{file}</span>
            </span>
            <span className="work__frame">{media}</span>
          </span>
          {caption}
        </button>
      ) : (
        <div className="work__open work__open--slot">
          <span className="work__window" ref={windowRef}>
            <span className="work__bar" aria-hidden="true">
              <i />
              <i />
              <i />
              <span className="work__file">{file}</span>
            </span>
            <span className="work__frame">{media}</span>
          </span>
          {caption}
        </div>
      )}
    </li>
  );
}

export function WorkGallery({ items }: { items: WorkItem[] }) {
  const [filter, setFilter] = useState<Filter>('all');
  const [openId, setOpenId] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const openerRef = useRef<HTMLElement | null>(null);

  const [expanded, setExpanded] = useState(false);
  const matching = items.filter(
    (i) => filter === 'all' || TREATMENT_FILTER[i.treatment] === filter
  );
  // The first twelve of whatever is selected, until the reader asks for all.
  const shown = expanded ? matching : matching.slice(0, INITIAL);
  const viewable = shown.filter((i) => i.src);
  const at = viewable.findIndex((i) => i.id === openId);
  const current = at >= 0 ? viewable[at] : undefined;

  const open = (id: string) => {
    openerRef.current = document.activeElement as HTMLElement | null;
    setOpenId(id);
  };

  const close = () => setOpenId(null);

  const step = (delta: number) => {
    if (viewable.length === 0 || at < 0) return;
    const next = viewable[(at + delta + viewable.length) % viewable.length];
    if (next) setOpenId(next.id);
  };

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (current) {
      if (!dialog.open) dialog.showModal();
      return;
    }
    // Closed by the button, the backdrop or Escape: put focus back where the
    // reader was, then forget it.
    if (dialog.open) dialog.close();
    openerRef.current?.focus();
    openerRef.current = null;
  }, [current]);

  return (
    <>
      <div className="work__filters" role="group" aria-label={STUDIO_WORK.filterLabel}>
        {STUDIO_WORK.filters.map((f) => (
          <button
            key={f.id}
            type="button"
            className="work__filter"
            aria-pressed={filter === f.id}
            onClick={() => setFilter(f.id as Filter)}
          >
            {f.label}
          </button>
        ))}
      </div>

      <ul className="work__grid">
        {items.map((item, i) => (
          <Piece key={item.id} item={item} index={i} hidden={!shown.includes(item)} onOpen={open} />
        ))}
      </ul>

      {matching.length > shown.length ? (
        <div className="work__more">
          <button type="button" className="work__filter" onClick={() => setExpanded(true)}>
            {`${STUDIO_WORK.showAll} (${matching.length})`}
          </button>
        </div>
      ) : null}

      <dialog
        ref={dialogRef}
        className="viewer"
        aria-labelledby="viewer-title"
        onClose={close}
        onKeyDown={(event) => {
          if (event.key === 'ArrowRight') step(1);
          if (event.key === 'ArrowLeft') step(-1);
        }}
        onClick={(event) => {
          // A click on the backdrop lands on the dialog element itself.
          if (event.target === event.currentTarget) close();
        }}
      >
        {current ? (
          <div className="viewer__inner">
            <div className="viewer__bar">
              <p className="viewer__count" aria-live="polite">
                {`${at + 1} ${STUDIO_WORK.viewer.of} ${viewable.length}`}
              </p>
              <button type="button" className="viewer__close" onClick={close} autoFocus>
                {STUDIO_WORK.viewer.close}
                <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
                  <path
                    d="M1 1l12 12M13 1L1 13"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>

            <div
              className="viewer__stage"
              style={{ '--ratio': ratioValue(current.ratio) } as CSSProperties}
            >
              {current.media === 'video' ? (
                <video
                  key={current.id}
                  src={current.src}
                  poster={current.poster}
                  controls
                  muted
                  autoPlay
                  loop
                  playsInline
                />
              ) : (
                <Image
                  key={current.id}
                  src={current.src!}
                  alt={current.title ?? current.treatment}
                  fill
                  sizes="90vw"
                />
              )}
            </div>

            <div className="viewer__foot">
              <div>
                <h2 className="viewer__title" id="viewer-title">
                  {current.title ?? current.treatment}
                </h2>
                <p className="viewer__meta">
                  {[
                    current.title ? current.treatment : null,
                    current.category,
                    creditLabel(current),
                  ]
                    .filter(Boolean)
                    .join(' · ')}
                </p>
              </div>
              {viewable.length > 1 ? (
                <div className="viewer__nav">
                  <button
                    type="button"
                    className="viewer__step"
                    onClick={() => step(-1)}
                    aria-label={STUDIO_WORK.viewer.previous}
                  >
                    <span aria-hidden="true">&larr;</span>
                  </button>
                  <button
                    type="button"
                    className="viewer__step"
                    onClick={() => step(1)}
                    aria-label={STUDIO_WORK.viewer.next}
                  >
                    <span aria-hidden="true">&rarr;</span>
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        ) : null}
      </dialog>
    </>
  );
}
