import Link from 'next/link';
import { Reveal, RevealLines } from '@/components/motion/Reveal';
import { TextLink } from '@/components/primitives';
import { CASES_SECTION } from '@/content/proof';
import { CASE_STUDIES, type CaseStudy } from '@/content/illustrative';

/**
 * Case studies.
 *
 * Six write-ups, three per sector, each opening a full study at
 * `/case-studies/<slug>`. The whole card is the link — a nested anchor inside a
 * clickable card gives keyboard users two stops for one destination.
 *
 * The artwork is generated from each card's hue: a quiet abstraction of the
 * four-stage bar, so the section carries the same visual idea as the hero
 * without needing photography that does not exist.
 */
function CaseArt({ hue, widths }: { hue: number; widths: number[] }) {
  return (
    <svg className="case__svg" viewBox="0 0 160 100" aria-hidden="true" focusable="false">
      <rect width="160" height="100" fill={`hsl(${hue} 34% 96%)`} />
      {[...Array(9)].map((_, i) => (
        <rect
          key={`g${i}`}
          x={14 + i * 15}
          y="0"
          width="1"
          height="100"
          fill={`hsl(${hue} 30% 88%)`}
          opacity="0.7"
        />
      ))}
      {widths.map((w, i) => (
        <rect
          key={i}
          x="16"
          y={26 + i * 14}
          width={(w / 100) * 128}
          height="8"
          rx="4"
          fill={`hsl(${hue} 62% ${58 - i * 7}%)`}
          opacity={0.35 + i * 0.2}
        />
      ))}
    </svg>
  );
}

/** The four stage figures, as proportions of the estimated figure. */
function stageWidths(study: CaseStudy): number[] {
  const values = study.stages.map((s) => Number(s.value.replace(/[^\d.]/g, '')));
  const top = values[0] ?? 0;
  if (!top) return [92, 68, 55, 44];
  return values.map((v) => Math.max(12, Math.round((v / top) * 92)));
}

export function CaseStudies() {
  return (
    <section
      className="surface--white on-light section"
      id="case-studies"
      aria-labelledby="cases-title"
    >
      <div className="shell">
        <div className="sec-head">
          <div>
            <RevealLines
              as="h2"
              id="cases-title"
              className="display d2"
              lines={CASES_SECTION.titleLines.map((line, i) =>
                i === 1 ? <em key={line}>{line}</em> : line
              )}
            />
          </div>
        </div>

        <Reveal as="p" className="lead" variant="rise" style={{ marginBottom: 28 }}>
          {CASES_SECTION.lead}
        </Reveal>

        <div className="cases">
          {CASE_STUDIES.map((study, i) => (
            <Reveal key={study.slug} variant="card" index={i % 3}>
              <Link className="case" href={`/case-studies/${study.slug}`}>
                <span className="case__art">
                  <span className="case__artinner">
                    <CaseArt hue={study.hue} widths={stageWidths(study)} />
                  </span>
                </span>
                <span className="case__body">
                  <span className="case__sector">{`${study.sector} · ${study.shape}`}</span>
                  <span className="case__title">{study.title}</span>
                  <span className="small">{study.summary}</span>

                  <span className="case__figures">
                    {study.headline.map((figure) => (
                      <span className="case__figure" key={figure.label}>
                        <span className="case__figurevalue">{figure.value}</span>
                        <span className="case__figurelabel">{figure.label}</span>
                      </span>
                    ))}
                  </span>

                  <span className="case__meta">
                    {study.chips.map((chip) => (
                      <span className="case__chip" key={chip}>
                        {chip}
                      </span>
                    ))}
                  </span>
                  <span className="case__cta">
                    Read the study <span aria-hidden="true">&rarr;</span>
                  </span>
                </span>
              </Link>
            </Reveal>
          ))}
        </div>

        <Reveal
          variant="rise"
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '14px 20px',
            alignItems: 'center',
            marginTop: 32,
          }}
        >
          <TextLink href="/case-studies">All six case studies in one place</TextLink>
          <TextLink href="/contact">Request an assessment on your own data</TextLink>
        </Reveal>
      </div>
    </section>
  );
}
