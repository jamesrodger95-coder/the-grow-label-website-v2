import type { ModuleSlug } from '@/content/modules';
import { AnswerScene } from './AnswerScene';
import { RespondScene } from './RespondScene';
import { RetainScene } from './RetainScene';
import { ReactivateScene } from './ReactivateScene';

/**
 * The module scene registry.
 *
 * Each module gets its own drawing, not a relabelled component. They share the
 * `useScene` harness and the `SceneFrame` chrome, and nothing else: a call
 * field, a decay of minutes, a day column and a segmented back book have no
 * geometry in common, which is the point.
 */
export function ModuleScene({ slug }: { slug: ModuleSlug }) {
  switch (slug) {
    case 'answer':
      return <AnswerScene />;
    case 'respond':
      return <RespondScene />;
    case 'retain':
      return <RetainScene />;
    case 'reactivate':
      return <ReactivateScene />;
    default:
      return null;
  }
}
