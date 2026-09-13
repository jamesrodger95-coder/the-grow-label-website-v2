import { existsSync } from 'node:fs';
import { join } from 'node:path';
import Image from 'next/image';
import { Reveal } from '@/components/motion/Reveal';
import { TEAM } from '@/content/proof';

/**
 * The four people on a client account.
 *
 * A server component with no interaction in it. It used to open a modal
 * carrying a two-paragraph remit per person, which meant a client component, a
 * portal and a focus trap for content nobody had asked to read. The remit is
 * now one line on the face of the card, which is the amount anyone wanted.
 *
 * ---------------------------------------------------------------------------
 * PORTRAITS
 * ---------------------------------------------------------------------------
 * Drop the four files into `public/team/` using the names in `TEAM.members`
 * and they appear — no code change. Until a file exists, `<Portrait/>` renders
 * a drawn 4:5 frame at exactly the ratio the photograph will occupy, so adding
 * one is a content change and never a layout one. The naming, the crop and the
 * export settings are in `docs/media/TEAM_PORTRAITS.md`.
 */

function Portrait({ hue }: { hue: number }) {
  return (
    <svg
      viewBox="0 0 100 125"
      aria-hidden="true"
      focusable="false"
      style={{ width: '100%', height: '100%' }}
    >
      <rect width="100" height="125" fill={`hsl(${hue} 28% 93%)`} />
      {/* The 4:5 crop marks. Reads as a reserved frame rather than as a
          missing image, which is the difference between a placeholder that
          looks intentional and one that looks broken. */}
      <g stroke={`hsl(${hue} 26% 84%)`} strokeWidth="0.75" fill="none">
        <rect x="8" y="8" width="84" height="109" />
        <path d="M8 8h10M8 8v10M92 8H82M92 8v10M8 117h10M8 117v-10M92 117H82M92 117v-10" />
      </g>
      <circle cx="50" cy="48" r="21" fill={`hsl(${hue} 28% 86%)`} />
      <path d="M17 117c4-22 16-33 33-33s29 11 33 33Z" fill={`hsl(${hue} 28% 86%)`} />
    </svg>
  );
}

/**
 * Whether a portrait file has actually been supplied.
 *
 * Checked against the filesystem at build time rather than left to a flag in
 * the content file, so adding a portrait is exactly one action: drop the file
 * into `public/team/` under the name the member already declares. A flag would
 * be a second place to forget, and `<Image>` given a src that 404s renders a
 * broken frame rather than falling back to anything.
 *
 * This is a server component, so the read happens once during the build and
 * never in a browser.
 */
function hasPortrait(photo: string): boolean {
  if (!photo.trim()) return false;
  return existsSync(join(process.cwd(), 'public', photo.replace(/^\//, '')));
}

export function Team() {
  return (
    <section className="surface--white on-light section" id="team" aria-labelledby="team-title">
      <div className="shell">
        <div className="sec-head">
          <div>
            <h2 className="display d2" id="team-title">
              {TEAM.titleLines[0]} <em>{TEAM.titleLines[1]}</em>
            </h2>
          </div>
        </div>

        <Reveal as="p" className="lead" variant="rise" style={{ marginBottom: 32 }}>
          {TEAM.lead}
        </Reveal>

        <div className="team">
          {TEAM.members.map((member, i) => (
            <Reveal className="person" key={member.id} variant="card" index={i}>
              <span className="person__photo">
                <span className="person__photoinner">
                  {hasPortrait(member.photo) ? (
                    <Image
                      src={member.photo}
                      alt={`${member.name}, ${member.role}`}
                      width={800}
                      height={1000}
                      sizes="(max-width: 520px) 46vw, (max-width: 1000px) 44vw, 22vw"
                      className="person__img"
                    />
                  ) : (
                    <Portrait hue={member.hue} />
                  )}
                </span>
              </span>
              <span className="person__body">
                <span className="person__name">{member.name}</span>
                <span className="person__role">{member.role}</span>
                <span className="person__intro">{member.intro}</span>
              </span>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
