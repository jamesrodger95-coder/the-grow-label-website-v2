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
  children,
}: {
  label: string;
  meta?: string;
  title: string;
  emphasis?: string;
  lead: string;
  strip?: readonly { key: string; detail: string }[];
  children?: React.ReactNode;
}) {
  return (
    <section className="phead surface--void on-dark" aria-labelledby="page-title">
      <div className="shell">
        <div className="phead__inner">
          <div className="phead__meta">
            <span className="label label--accent">{label}</span>
            {meta ? <span className="label">{meta}</span> : null}
          </div>
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
          {strip ? (
            <Reveal index={2} style={{ marginTop: 'clamp(36px, 4vw, 64px)' }}>
              <KeyValueStrip items={strip} />
            </Reveal>
          ) : null}
        </div>
      </div>
    </section>
  );
}
