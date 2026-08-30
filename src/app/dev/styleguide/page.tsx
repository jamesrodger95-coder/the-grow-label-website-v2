import type { Metadata } from 'next';
import type { CSSProperties } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import {
  ActionLink,
  CapacityColumn,
  KeyValueStrip,
  LedgerRow,
  PullStatement,
  SectionHeader,
  StageBar,
  StepList,
  TextLink,
} from '@/components/primitives';

export const metadata: Metadata = {
  title: 'Styleguide',
  description: 'Live inventory of Grow Label design tokens and components.',
  robots: { index: false, follow: false },
};

const SURFACES = [
  { token: '--gl-white', hex: '#FBFAF8', role: 'Warm white — the default page' },
  { token: '--gl-paper', hex: '#F4F3F0', role: 'Raised warm grey band' },
  { token: '--gl-mist', hex: '#EAE8E3', role: 'Light grey — wells and tracks' },
  { token: '--gl-edge', hex: '#DEDBD5', role: 'Light grey — visible dividers' },
  { token: '--gl-graphite-deep', hex: '#17171B', role: 'Graphite — dark sections' },
  { token: '--gl-ink', hex: '#0C0C0E', role: 'Near-black — type and footer' },
];

const ACCENTS = [
  { token: '--gl-purple', hex: '#4A3AC4', role: 'On light · 8.1:1' },
  { token: '--gl-purple-bright', hex: '#9A8FF0', role: 'On dark · 7.2:1' },
  { token: '--gl-purple-ink', hex: '#2E2482', role: 'Pressed and deep emphasis' },
  { token: '--gl-verified', hex: '#1A6F56', role: 'Verified — semantic only' },
  { token: '--gl-alert', hex: '#B3261E', role: 'Form errors — semantic only' },
];

const TYPE_SCALE = [
  { name: 'd1', value: 'clamp(2.75rem, 7.2vw, 7rem)', use: 'Hero only. One per page.' },
  { name: 'd2', value: 'clamp(2.375rem, 5.6vw, 5rem)', use: 'Section statements.' },
  { name: 'd3', value: 'clamp(1.875rem, 3.6vw, 3.125rem)', use: 'Sub-sections and page heads.' },
  { name: 'd4', value: 'clamp(1.5rem, 2.4vw, 2.125rem)', use: 'Item titles.' },
  { name: 'lead', value: 'clamp(1.0625rem, 1.35vw, 1.3125rem)', use: 'Standfirst.' },
  { name: 'body', value: '1rem / 1.62', use: 'Running copy.' },
  { name: 'label', value: '0.6875rem mono / 0.15em', use: 'Eyebrows, indices, axis labels.' },
];

export default function StyleguidePage() {
  return (
    <>
      <PageHeader
        label="Development"
        meta="Not indexed · not linked from navigation"
        title="Styleguide."
        lead="A live inventory rendered from the same tokens the site uses. If something here looks wrong, the site is wrong."
        strip={[
          { key: 'Display', detail: 'Instrument Serif · 400 + italic' },
          { key: 'Interface', detail: 'Archivo Variable · 300–700' },
          { key: 'Data', detail: 'IBM Plex Mono · 400' },
          { key: 'Radius', detail: '0px structural · 2px on controls' },
        ]}
      />

      {/* Colour ---------------------------------------------------------- */}
      <section className="surface--paper on-light section" aria-labelledby="sg-colour">
        <div className="shell">
          <SectionHeader eyebrow="Tokens" id="sg-colour" title="Colour" />
          <p className="label" style={{ marginBottom: 20 }}>
            Surfaces
          </p>
          <div className="dev-grid" style={{ marginBottom: 44 }}>
            {SURFACES.map((s) => (
              <div className="dev-swatch" key={s.token}>
                <span className="dev-swatch__chip" style={{ background: s.hex }} />
                <span className="mono" style={{ fontSize: 12 }}>
                  {s.token}
                </span>
                <span className="micro">
                  {s.hex} · {s.role}
                </span>
              </div>
            ))}
          </div>

          <p className="label" style={{ marginBottom: 20 }}>
            Accent and status
          </p>
          <div className="dev-grid" style={{ marginBottom: 44 }}>
            {ACCENTS.map((s) => (
              <div className="dev-swatch" key={s.token}>
                <span className="dev-swatch__chip" style={{ background: s.hex }} />
                <span className="mono" style={{ fontSize: 12 }}>
                  {s.token}
                </span>
                <span className="micro">
                  {s.hex} · {s.role}
                </span>
              </div>
            ))}
          </div>

          <p className="label" style={{ marginBottom: 20 }}>
            Value-stage ramp — one hue, four levels of certainty
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2 }}>
            {['Estimated', 'Booked', 'Attended', 'Collected'].map((name, i) => (
              <div key={name}>
                <span
                  style={
                    {
                      display: 'block',
                      height: 60,
                      background: `var(--stage-${i + 1})`,
                    } as CSSProperties
                  }
                />
                <span className="label" style={{ display: 'block', marginTop: 10 }}>
                  {name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Typography ------------------------------------------------------- */}
      <section className="surface--black on-dark section" aria-labelledby="sg-type">
        <div className="shell">
          <SectionHeader eyebrow="Tokens" id="sg-type" title="Typography" />
          <p className="display d1" style={{ marginBottom: 24 }}>
            Display one <em>italic</em>
          </p>
          <p className="display d2" style={{ marginBottom: 24 }}>
            Display two <em>italic</em>
          </p>
          <p className="display d3" style={{ marginBottom: 24 }}>
            Display three <em>italic</em>
          </p>
          <p className="display d4" style={{ marginBottom: 32 }}>
            Display four <em>italic</em>
          </p>
          <p className="lead" style={{ marginBottom: 20 }}>
            Lead paragraph. Archivo at a fluid size, used for the standfirst under a section
            heading.
          </p>
          <p className="body" style={{ marginBottom: 20 }}>
            Body copy. Archivo at 380 weight, 1.62 line height, capped at 68 characters. Numerals
            are tabular throughout: 1,204 · 0.42 · £248,610.
          </p>
          <p className="small" style={{ marginBottom: 12 }}>
            Small copy, used inside ledger rows and step lists.
          </p>
          <p className="micro" style={{ marginBottom: 32 }}>
            Micro copy, used for captions and provenance notes.
          </p>
          <p className="figure" style={{ marginBottom: 32 }}>
            £248,610
          </p>

          <div className="spec">
            {TYPE_SCALE.map((t, i) => (
              <div className="spec__row" key={t.name}>
                <span className="lrow__idx">{`0${i + 1}`}</span>
                <span className="lrow__key mono">{t.name}</span>
                <span className="lrow__val mono">{t.value}</span>
                <span className="micro">{t.use}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Components ------------------------------------------------------- */}
      <section className="surface--paper on-light section" aria-labelledby="sg-components">
        <div className="shell">
          <SectionHeader eyebrow="Components" id="sg-components" title="Structural components" />

          <p className="label" style={{ marginBottom: 18 }}>
            Ledger rows
          </p>
          <div className="ledger" style={{ marginBottom: 48 }}>
            <LedgerRow
              index="01"
              title="Unanswered calls"
              detail="Rung out, abandoned in the queue, or arriving out of hours"
              tag="Answer"
            />
            <LedgerRow
              index="02"
              title="Slow first response"
              detail="Enquiries answered after the window in which people still book"
              tag="Respond"
            />
          </div>

          <p className="label" style={{ marginBottom: 18 }}>
            Four-stage value bar
          </p>
          <div style={{ maxWidth: 640, marginBottom: 48 }}>
            <StageBar
              rows={[
                { name: 'Estimated', width: 100, figure: 'Modelled' },
                { name: 'Booked', width: 74, figure: 'PMS record' },
                { name: 'Attended', width: 62, figure: 'PMS record' },
                { name: 'Collected', width: 55, figure: 'Ledger' },
              ]}
              caption="Illustrative only. Never a benchmark."
            />
          </div>

          <p className="label" style={{ marginBottom: 18 }}>
            Capacity column
          </p>
          <div style={{ maxWidth: 220, marginBottom: 48 }}>
            <CapacityColumn
              slots={['filled', 'open', 'filled', 'recovered', 'open', 'filled', 'open', 'filled']}
              label="A working day"
              openLabel="3 open"
              note="Filled, open and recovered slots."
            />
          </div>

          <p className="label" style={{ marginBottom: 18 }}>
            Key/value strip
          </p>
          <div style={{ marginBottom: 48 }}>
            <KeyValueStrip
              items={[
                { key: 'Reads', detail: 'Telephony, enquiry channels, appointment book' },
                { key: 'Produces', detail: 'Tracked opportunities with an owner and a due time' },
                { key: 'Reports at', detail: 'Estimated → Booked → Attended → Collected' },
              ]}
            />
          </div>

          <p className="label" style={{ marginBottom: 18 }}>
            Step list
          </p>
          <StepList
            items={[
              {
                index: '01',
                title: 'First step',
                detail: 'Numbered only where order carries meaning.',
              },
              { index: '02', title: 'Second step', detail: 'Hairline separated, never boxed.' },
            ]}
          />
        </div>
      </section>

      {/* Controls --------------------------------------------------------- */}
      <section className="surface--ink on-dark section" aria-labelledby="sg-controls">
        <div className="shell">
          <SectionHeader eyebrow="Components" id="sg-controls" title="Controls" />
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 40 }}>
            <ActionLink href="/dev/styleguide">Primary action</ActionLink>
            <ActionLink href="/dev/styleguide" variant="ghost">
              Secondary action
            </ActionLink>
            <TextLink href="/dev/styleguide">Text link</TextLink>
          </div>

          <p className="label" style={{ marginBottom: 18 }}>
            Form fields
          </p>
          <div className="form" style={{ maxWidth: 560 }}>
            <div className="field">
              <label className="field__label" htmlFor="sg-input">
                Standard field <span className="field__req">*</span>
              </label>
              <input className="field__control" id="sg-input" placeholder="Placeholder" />
              <p className="field__hint">Hint text sits under the control.</p>
            </div>
            <div className="field">
              <label className="field__label" htmlFor="sg-invalid">
                Field in error
              </label>
              <input className="field__control" id="sg-invalid" aria-invalid="true" />
              <p className="field__error">
                <span aria-hidden="true">&times;</span>
                Enter a valid work email address.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Surfaces --------------------------------------------------------- */}
      <section className="surface--mist on-light section" aria-labelledby="sg-surfaces">
        <div className="shell">
          <SectionHeader
            eyebrow="Composition"
            id="sg-surfaces"
            title="Split panels and pull statements"
          />
          <div className="split" style={{ marginBottom: 48 }}>
            <div className="split__panel" style={{ background: 'var(--gl-paper)' }}>
              <span className="label label--accent">Panel one</span>
              <h3 className="display d4">Panels are separated by a hairline, never a shadow.</h3>
              <p className="small">Elevation is used almost nowhere in this system.</p>
            </div>
            <div className="split__panel" style={{ background: 'var(--gl-paper)' }}>
              <span className="label label--accent">Panel two</span>
              <h3 className="display d4">Corner radius is zero on structure.</h3>
              <p className="small">
                Only interactive controls get 2px, and only for the hit target.
              </p>
            </div>
          </div>
          <PullStatement
            label="Pull statement"
            title="One number is a claim."
            emphasis="Four numbers are an account."
            body="Used once per page at most, always on a rule."
          />
        </div>
      </section>

      {/* Spacing ---------------------------------------------------------- */}
      <section className="surface--black on-dark section" aria-labelledby="sg-space">
        <div className="shell">
          <SectionHeader eyebrow="Tokens" id="sg-space" title="Spacing and rhythm" />
          <div className="spec">
            {[
              ['--gl-slot', '46px', 'The schedule-slot unit the grid is tuned to'],
              ['--gl-s-4', '16px', 'Tight internal spacing'],
              ['--gl-s-5', '24px', 'Row padding'],
              ['--gl-s-8', '64px', 'Block separation'],
              ['--gl-s-9', '92px', 'Major separation'],
              ['--gl-section-y', 'clamp(72px, 9vw, 152px)', 'Section padding'],
              ['--gl-gutter', 'clamp(20px, 4.4vw, 64px)', 'Page gutter'],
            ].map(([token, value, role], i) => (
              <div className="spec__row" key={token}>
                <span className="lrow__idx">{`0${i + 1}`}</span>
                <span className="lrow__key mono">{token}</span>
                <span className="lrow__val mono">{value}</span>
                <span className="micro">{role}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
