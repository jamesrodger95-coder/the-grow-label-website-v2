import type { CSSProperties } from 'react';
import { Reveal, RevealLines } from '@/components/motion/Reveal';
import { TextLink } from '@/components/primitives';
import { CASE_STUDIES } from '@/content/proof';

/**
 * Case studies.
 *
 * Cards are structured for real case-study pages: sector, title, summary,
 * module chips and a link. Until those pages exist the link is absent and the
 * card is marked as a placeholder rather than pointing at a dead route.
 *
 * The artwork is generated from each card's hue — a quiet abstraction of the
 * four-stage bar, so the section carries the same visual idea as the hero
 * without needing photography that does not exist.
 */
function CaseArt({ hue }: { hue: number }) {
  const bars = [92, 68, 55, 44];
  return (
    <svg className="case__svg" viewBox="0 0 160 100" role="img" aria-label="">
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
      {bars.map((w, i) => (
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

export function CaseStudies() {
  return (
    <section className="surface--white on-light section" aria-labelledby="cases-title">
      <div className="shell">
        <div className="sec-head">
          <div>
            <Reveal variant="rise">
              <span className="eyebrow sec-head__eyebrow">Case studies</span>
            </Reveal>
            <RevealLines
              as="h2"
              id="cases-title"
              className="display d2"
              lines={['The work, written up', <em key="e">once it can be evidenced.</em>]}
            />
          </div>
          <p className="sec-head__aside">Three in preparation</p>
        </div>

        <Reveal as="p" className="lead" variant="rise" style={{ marginBottom: 40 }}>
          Each of these is a real workflow we can describe today and a case study we can publish
          once a client has approved the figures behind it. The frames are built; the numbers are
          not invented to fill them.
        </Reveal>

        <div className="cases">
          {CASE_STUDIES.map((study, i) => (
            <Reveal className="case" key={study.slug} variant="card" index={i}>
              <div className="case__art">
                <span className="case__badge placeholder-tag">In preparation</span>
                <div className="case__artinner">
                  <CaseArt hue={study.hue} />
                </div>
              </div>
              <div className="case__body">
                <span className="case__sector">{study.sector}</span>
                <h3 className="case__title">{study.title}</h3>
                <p className="small">{study.summary}</p>
                <div className="case__meta">
                  {study.chips.map((chip) => (
                    <span className="case__chip" key={chip}>
                      {chip}
                    </span>
                  ))}
                </div>
                <span className="case__cta" aria-hidden="true">
                  Full study to follow <span>&rarr;</span>
                </span>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal
          variant="rise"
          style={
            {
              display: 'flex',
              flexWrap: 'wrap',
              gap: '14px 20px',
              alignItems: 'center',
              marginTop: 32,
            } as CSSProperties
          }
        >
          <span className="placeholder-tag">Placeholder</span>
          <p className="small" style={{ flex: '1 1 24rem', margin: 0 }}>
            Card layout, artwork and metadata are final. Titles, summaries and links are replaced
            when each study is signed off by the client it describes.
          </p>
          <TextLink href="/methodology">What we can claim</TextLink>
        </Reveal>
      </div>
    </section>
  );
}
