import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import {
  CapacityColumn,
  KeyValueStrip,
  LedgerRow,
  SectionHeader,
  StageBar,
  StepList,
} from '@/components/primitives';
import { SiteComparison } from '@/components/sector/SiteComparison';
import { RecallRail } from '@/components/sector/RecallRail';

describe('SectionHeader', () => {
  it('renders one heading with the emphasis as part of its accessible name', () => {
    render(
      <SectionHeader
        eyebrow="Where it goes"
        aside="Six points of loss"
        title="A busy practice and a leaking one look"
        emphasis="identical from the front desk."
      />
    );
    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toHaveTextContent('A busy practice and a leaking one look identical');
    expect(screen.getByText('Where it goes')).toBeInTheDocument();
  });

  it('can render at level 3 where the document outline requires it', () => {
    render(<SectionHeader title="Nested" headingLevel={3} />);
    expect(screen.getByRole('heading', { level: 3 })).toBeInTheDocument();
  });

  /**
   * Section counters were template furniture: they told the reader they were on
   * part three of five, which is not information they needed.
   */
  it('renders no section counter', () => {
    const { container } = render(<SectionHeader eyebrow="Detection" title="Detection" />);
    expect(container.textContent).not.toMatch(/§|\d+\s*\/\s*\d+/);
  });
});

describe('LedgerRow', () => {
  it('renders index, title, detail and an optional tag', () => {
    render(<LedgerRow index="01" title="Unanswered calls" detail="Rung out." tag="Answer" />);
    expect(screen.getByText('01')).toBeInTheDocument();
    expect(screen.getByText('Unanswered calls')).toBeInTheDocument();
    expect(screen.getByText('Rung out.')).toBeInTheDocument();
    expect(screen.getByText('Answer')).toBeInTheDocument();
  });

  it('keeps the grid intact when there is no tag', () => {
    const { container } = render(<LedgerRow index="02" title="Row" detail="Detail" />);
    expect(container.querySelector('.lrow')?.children).toHaveLength(4);
  });
});

describe('StageBar', () => {
  it('renders all four stages with their figures', () => {
    render(
      <StageBar
        rows={[
          { name: 'Estimated', width: 100, figure: 'Modelled' },
          { name: 'Booked', width: 74, figure: 'PMS record' },
          { name: 'Attended', width: 62, figure: 'PMS record' },
          { name: 'Collected', width: 55, figure: 'Ledger' },
        ]}
        caption="Illustrative only."
      />
    );
    for (const name of ['Estimated', 'Booked', 'Attended', 'Collected']) {
      expect(screen.getByText(name)).toBeInTheDocument();
    }
    expect(screen.getByText('Ledger')).toBeInTheDocument();
    expect(screen.getByText(/illustrative only/i)).toBeInTheDocument();
  });

  it('sets a descending fill width per stage', () => {
    const { container } = render(
      <StageBar
        rows={[
          { name: 'Estimated', width: 100, figure: 'a' },
          { name: 'Collected', width: 55, figure: 'b' },
        ]}
      />
    );
    const fills = container.querySelectorAll<HTMLElement>('.stagebar__fill');
    expect(fills[0]?.style.getPropertyValue('--w')).toBe('100%');
    expect(fills[1]?.style.getPropertyValue('--w')).toBe('55%');
  });
});

describe('CapacityColumn', () => {
  it('renders one node per slot and hides the graphic from assistive tech', () => {
    const { container } = render(
      <CapacityColumn slots={['filled', 'open', 'recovered']} label="A working day" />
    );
    const col = container.querySelector('.capcol');
    expect(col).toHaveAttribute('aria-hidden', 'true');
    expect(col?.children).toHaveLength(3);
    expect(container.querySelector('.capslot--open')).toBeTruthy();
    expect(container.querySelector('.capslot--recovered')).toBeTruthy();
  });
});

describe('KeyValueStrip and StepList', () => {
  it('render as a description list and a numbered list respectively', () => {
    const { container } = render(
      <KeyValueStrip items={[{ key: 'Reads', detail: 'Telephony events' }]} />
    );
    expect(container.querySelector('dl')).toBeTruthy();
    expect(screen.getByText('Reads')).toBeInTheDocument();

    render(<StepList items={[{ index: '01', title: 'First', detail: 'Detail' }]} />);
    expect(screen.getByRole('heading', { level: 3, name: 'First' })).toBeInTheDocument();
  });
});

describe('sector devices', () => {
  it('SiteComparison gives every bar a text alternative and never claims a benchmark', () => {
    render(<SiteComparison />);
    expect(screen.getByText(/not client figures and not a benchmark/i)).toBeInTheDocument();
    // Five sites x four stages of screen-reader text.
    expect(screen.getAllByText(/of 100$/)).toHaveLength(20);
  });

  it('RecallRail states how far each list was worked', () => {
    render(<RecallRail />);
    expect(screen.getByText(/six-month recall/i)).toBeInTheDocument();
    expect(screen.getByText(/not client data/i)).toBeInTheDocument();
    expect(screen.getAllByText(/worked to \d+%/).length).toBeGreaterThan(0);
  });
});
