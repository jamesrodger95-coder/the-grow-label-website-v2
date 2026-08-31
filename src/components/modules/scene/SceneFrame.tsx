import type { ReactNode } from 'react';

export type Readout = {
  key: string;
  /** The settled value. Rendered in markup, so it is correct without JS. */
  value: string;
  tone?: 'plain' | 'signal';
};

/**
 * The chrome every module scene sits in: a titled panel, a readout row and the
 * illustrative note. Shared so the four visuals are unmistakably the same
 * family of object, even though the drawings inside them are unalike.
 *
 * `onReadout` hands each value element back to the scene, so a scene can count
 * a figure up as it draws without re-rendering React on every frame.
 */
export function SceneFrame({
  label,
  readouts,
  note,
  onReadout,
  children,
}: {
  label: string;
  readouts: Readout[];
  note: string;
  onReadout?: (el: HTMLElement | null, index: number) => void;
  children: ReactNode;
}) {
  return (
    <figure className="mscene">
      <div className="mscene__head">
        <span className="mscene__label">{label}</span>
      </div>
      <div className="mscene__plot">{children}</div>
      <dl className="mscene__readouts">
        {readouts.map((r, i) => (
          <div className="mscene__readout" key={r.key} data-tone={r.tone ?? 'plain'}>
            <dt>{r.key}</dt>
            <dd
              ref={
                onReadout
                  ? (el) => {
                      onReadout(el, i);
                    }
                  : undefined
              }
            >
              {r.value}
            </dd>
          </div>
        ))}
      </dl>
      <figcaption className="mscene__note micro">{note}</figcaption>
    </figure>
  );
}
