import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { VideoCard } from './VideoCard';
import { VIDEO_SECTION } from '@/content/proof';
import { VIDEO_TESTIMONIALS } from '@/content/testimonials';

/**
 * Video testimonials.
 *
 * Both this and `VideoCard` are server components — the section ships as plain
 * HTML with three `<video>` elements in it and hydrates nothing. It asks the
 * filesystem at build time whether each recording exists, which is what keeps
 * the "never simulate something the site cannot do" rule true here: a card with
 * no file behind it shows a note instead of a player with nothing in it, and
 * the switch needs no flag in the content file to maintain.
 *
 * Adding a recording is therefore exactly one action: drop the file into
 * `public/testimonials/` under the name the entry already declares and rebuild.
 * See `docs/media/VIDEO_TESTIMONIALS.md` for the names and the encoding.
 */

function present(publicPath: string): boolean {
  if (!publicPath.trim()) return false;
  return existsSync(join(process.cwd(), 'public', publicPath.replace(/^\//, '')));
}

/**
 * The poster is derived from the recording, not authored, so its path is
 * derived too: same folder, same stem, `.jpg`. Nothing declares it in the
 * content file, because a second field is a second thing to get wrong, and the
 * poster is only ever the video's own first frame.
 *
 * `pnpm posters` regenerates them. If one is missing the card still works — it
 * simply starts on a black frame instead of the first frame.
 */
function posterFor(videoPath: string): string | undefined {
  const path = videoPath.replace(/\.mp4$/, '.jpg');
  return present(path) ? path : undefined;
}

export function VideoTestimonials() {
  return (
    <section className="surface--paper on-light section" aria-labelledby="videos-title">
      <div className="shell">
        <div className="sec-head">
          <div>
            <span className="eyebrow sec-head__eyebrow">{VIDEO_SECTION.eyebrow}</span>
            <h2 className="display d2" id="videos-title">
              {VIDEO_SECTION.title} <em>{VIDEO_SECTION.emphasis}</em>
            </h2>
          </div>
          <p className="sec-head__aside">{VIDEO_SECTION.aside}</p>
        </div>

        <p className="small videos__note">{VIDEO_SECTION.note}</p>

        <div className="videos">
          {VIDEO_TESTIMONIALS.map((video) => (
            <VideoCard
              key={video.id}
              video={video}
              ready={present(video.video)}
              poster={posterFor(video.video)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
