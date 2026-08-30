import Link from 'next/link';
import { MODULES, type ModuleSlug } from '@/content/modules';

/**
 * Where the reader is in the four-module system, and a way to move between
 * them. Sits in the module page header, where the alternative is empty space.
 */
export function ModuleRail({ current }: { current: ModuleSlug }) {
  const active = MODULES.find((m) => m.slug === current);

  return (
    <nav className="rail-index" aria-label="Modules">
      <p className="label" style={{ marginBottom: 14 }}>
        Where this sits
      </p>
      <ol className="rail-index__list">
        {MODULES.map((module) => {
          const isCurrent = module.slug === current;
          return (
            <li key={module.slug}>
              <Link
                className="rail-index__item"
                href={`/modules/${module.slug}`}
                aria-current={isCurrent ? 'page' : undefined}
              >
                <span className="rail-index__num">{`0${module.index}`}</span>
                <span className="rail-index__name">{module.name}</span>
                <span className="rail-index__note">{module.summary}</span>
              </Link>
            </li>
          );
        })}
      </ol>
      {active ? <p className="micro rail-index__foot">{active.position}</p> : null}
    </nav>
  );
}
