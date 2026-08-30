import { PageHeader } from '@/components/layout/PageHeader';
import { Reveal } from '@/components/motion/Reveal';
import { TextLink } from '@/components/primitives';
import type { LegalSection } from '@/content/legal';

const dateFormat = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
});

export function LegalPage({
  label,
  title,
  emphasis,
  lead,
  sections,
  lastUpdated,
  footnote,
}: {
  label: string;
  title: string;
  emphasis: string;
  lead: string;
  sections: readonly LegalSection[];
  lastUpdated: string;
  footnote: string;
}) {
  return (
    <>
      <PageHeader
        label={label}
        meta={`Last updated ${dateFormat.format(new Date(lastUpdated))}`}
        title={title}
        emphasis={emphasis}
        lead={lead}
      />

      <section className="surface--paper on-light section">
        <div className="shell">
          <div className="two-col">
            <Reveal>
              <nav aria-label="On this page">
                <p className="label" style={{ marginBottom: 16 }}>
                  On this page
                </p>
                <ul className="ticks">
                  {sections.map((section) => (
                    <li key={section.heading}>{section.heading}</li>
                  ))}
                </ul>
              </nav>
              <p className="micro" style={{ marginTop: 32, maxWidth: '34ch' }}>
                {footnote}
              </p>
            </Reveal>

            <Reveal className="prose" index={1}>
              {sections.map((section) => (
                <section key={section.heading}>
                  <h2>{section.heading}</h2>
                  {section.paragraphs?.map((paragraph) => (
                    <p key={paragraph.slice(0, 24)}>{paragraph}</p>
                  ))}
                  {section.list ? (
                    <ul>
                      {section.list.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  ) : null}
                </section>
              ))}
              <p style={{ marginTop: 40 }}>
                <TextLink href="/contact">Ask a question about this</TextLink>
              </p>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
