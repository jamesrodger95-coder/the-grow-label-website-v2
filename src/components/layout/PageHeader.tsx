import { Reveal } from '@/components/motion/Reveal';
import { KeyValueStrip } from '@/components/primitives';

/**
 * The opening block for every secondary route. Always on the void ground, so
 * each page starts in the same register as the homepage and then establishes
 * its own rhythm.
 */
export function PageHeader({
  label,
  meta,
  title,
  emphasis,
  lead,
  strip,
  aside,
  children,
}: {
  label: string;
  meta?: string;
  title: string;
  emphasis?: string;
  lead: string;
  strip?: readonly { key: string; detail: string }[];
  /** Optional companion content, shown beside the title on wide viewports. */
  aside?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <section className="phead surface--void on-dark" aria-labelledby="page-title">
      <div className="shell">
        <div className="phead__inner">
          <div className="phead__meta">
            <span className="label label--accent">{label}</span>
            {meta ? <span className="small">{meta}</span> : null}
          </div>

          <div className={aside ? 'phead__body phead__body--split' : 'phead__body'}>
            <div>
              <Reveal variant="reveal">
                <h1 className="display d2 phead__title" id="page-title">
                  {title}
                  {emphasis ? (
                    <>
                      {' '}
                      <em>{emphasis}</em>
                    </>
                  ) : null}
                </h1>
              </Reveal>
              <Reveal as="p" className="lead phead__lead" index={1}>
                {lead}
              </Reveal>
              {children}
            </div>
            {aside ? <Reveal index={2}>{aside}</Reveal> : null}
          </div>

          {strip ? (
            <Reveal index={3} style={{ marginTop: 'clamp(36px, 4vw, 64px)' }}>
              <KeyValueStrip items={strip} />
            </Reveal>
          ) : null}
        </div>
      </div>
    </section>
  );
}
