import type { Metadata } from 'next';
import { PageHeader } from '@/components/layout/PageHeader';
import { MotionLab } from '@/components/motion/MotionLab';
import { RecoverySequence } from '@/components/motion/RecoverySequence';
import { SectionHeader } from '@/components/primitives';

export const metadata: Metadata = {
  title: 'Motion lab',
  description: 'Isolated harness for the Grow Label motion language.',
  robots: { index: false, follow: false },
};

const INVENTORY: [string, string, string][] = [
  ['M01', 'Hero signal field', 'Detect. Runs once, 400ms after paint. Inert on touch.'],
  ['M02', 'Display mask reveal', 'Detect. clip-path per line, IntersectionObserver, one-shot.'],
  ['M03', 'Rule draw', 'Detect. scaleX on section hairlines as they enter.'],
  ['M04', 'Ledger row cascade', 'Detect. Opacity plus 10px rise, 45ms stagger.'],
  ['M05', 'Capacity column', 'Consolidate. Open slots resolve to recovered in sequence.'],
  ['M06', 'Recovery sequence', 'All three verbs. Scroll-progress driven, no pin, no hijack.'],
  ['M07', 'Stage bar growth', 'Settle. scaleX from the left, 130ms stagger.'],
  ['M08', 'Nav link rule', 'Settle. scaleX on hover and for the current route.'],
  ['M09', 'Control wipe', 'Settle. Fires on hover and focus-visible alike.'],
  ['M10', 'Drawer', 'Settle. Panel fade plus staggered links. Focus trapped while open.'],
  ['M11', 'Cursor proximity', 'Detect. Fine pointers only. rAF-throttled, transform and opacity.'],
  ['M12', 'Route transition', 'Settle. 180ms cross-fade, never delays navigation.'],
];

export default function MotionLabPage() {
  return (
    <>
      <PageHeader
        label="Development"
        meta="Not indexed · not linked from navigation"
        title="Motion lab."
        lead="Every animation in the system, isolated and replayable. Three verbs only: detect, consolidate, settle. If a proposed effect is not one of these, it does not ship."
        strip={[
          { key: 'Library', detail: 'None. IntersectionObserver plus CSS transitions' },
          { key: 'Properties', detail: 'transform, opacity, clip-path, SVG geometry' },
          { key: 'Reduced motion', detail: 'Authored end states, not disabled animation' },
          { key: 'Teardown', detail: 'Every observer disconnects on unmount' },
        ]}
      />

      <section className="surface--ink on-dark section" aria-labelledby="lab-verbs">
        <div className="shell">
          <SectionHeader eyebrow="Harness" id="lab-verbs" title="The three verbs" />
          <MotionLab />
        </div>
      </section>

      <section className="surface--black on-dark section" aria-labelledby="lab-sequence">
        <div className="shell">
          <SectionHeader eyebrow="Signature" id="lab-sequence" title="The recovery sequence" />
          <RecoverySequence />
        </div>
      </section>

      <section className="surface--paper on-light section" aria-labelledby="lab-inventory">
        <div className="shell">
          <SectionHeader eyebrow="Inventory" id="lab-inventory" title="Complete motion inventory" />
          <div className="ledger">
            {INVENTORY.map(([id, name, detail]) => (
              <div className="lrow" key={id}>
                <span className="lrow__idx">{id}</span>
                <span className="lrow__key">{name}</span>
                <span className="lrow__val">{detail}</span>
                <span aria-hidden="true" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
