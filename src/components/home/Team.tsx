'use client';

import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { TEAM, type TeamMember } from '@/content/proof';

/**
 * Meet the team.
 *
 * Each card opens a profile in a modal. Photographs are generated placeholders
 * sized to the real 4:5 crop, so dropping in real portraits is a content change
 * rather than a layout one.
 */

function Portrait({ hue, name }: { hue: number; name: string }) {
  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('');
  return (
    <svg
      viewBox="0 0 100 125"
      aria-hidden="true"
      focusable="false"
      style={{ width: '100%', height: '100%' }}
    >
      <rect width="100" height="125" fill={`hsl(${hue} 28% 93%)`} />
      <circle cx="50" cy="48" r="21" fill={`hsl(${hue} 28% 84%)`} />
      <path d="M14 125c5-24 17-36 36-36s31 12 36 36Z" fill={`hsl(${hue} 28% 84%)`} />
      <text
        x="50"
        y="49"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="15"
        fontWeight="500"
        fill={`hsl(${hue} 36% 52%)`}
      >
        {initials}
      </text>
    </svg>
  );
}

export function Team() {
  const [active, setActive] = useState<TeamMember | null>(null);

  return (
    <section className="surface--white on-light section" id="team" aria-labelledby="team-title">
      <div className="shell">
        <div className="sec-head">
          <div>
            <span className="eyebrow sec-head__eyebrow">{TEAM.eyebrow}</span>
            <h2 className="display d2" id="team-title">
              {TEAM.titleLines[0]} <em>{TEAM.titleLines[1]}</em>
            </h2>
          </div>
          <p className="sec-head__aside">Profiles in progress</p>
        </div>

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '12px 18px',
            alignItems: 'center',
            marginBottom: 32,
          }}
        >
          <span className="placeholder-tag">Placeholder</span>
          <p className="small" style={{ flex: '1 1 24rem', margin: 0 }}>
            {TEAM.lead}
          </p>
        </div>

        <div className="team">
          {TEAM.members.map((member) => (
            <button
              type="button"
              className="person"
              key={member.id}
              onClick={() => setActive(member)}
              /* See the note in VideoTestimonials: the accessible name has to
                 contain the visible text, not replace it. */
            >
              <span className="gl-sr">Read the profile for </span>
              <span className="person__photo">
                <span className="person__photoinner">
                  <Portrait hue={member.hue} name={member.name} />
                </span>
              </span>
              <span className="person__body">
                <span className="person__name">{member.name}</span>
                <span className="person__role">{member.role}</span>
                <span className="person__more">
                  Profile <span aria-hidden="true">&rarr;</span>
                </span>
              </span>
            </button>
          ))}
        </div>
      </div>

      <Modal
        open={active !== null}
        onClose={() => setActive(null)}
        labelledBy="team-modal-title"
        narrow
      >
        {active ? (
          <div className="modal__body">
            <div className="modal__profile">
              <div className="modal__photo">
                <Portrait hue={active.hue} name={active.name} />
              </div>
              <div>
                <span className="placeholder-tag">Placeholder profile</span>
                <h3 className="d3 display" id="team-modal-title" style={{ marginTop: 14 }}>
                  {active.name}
                </h3>
                <p className="label label--accent" style={{ marginTop: 8 }}>
                  {active.role}
                </p>
                <p className="small" style={{ marginTop: 16 }}>
                  {active.intro}
                </p>
                {active.bio.map((paragraph) => (
                  <p className="small" style={{ marginTop: 12 }} key={paragraph.slice(0, 20)}>
                    {paragraph}
                  </p>
                ))}
                <div
                  style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 18 }}
                  aria-label="Focus areas"
                >
                  {active.focus.map((f) => (
                    <span className="case__chip" key={f}>
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </Modal>
    </section>
  );
}
