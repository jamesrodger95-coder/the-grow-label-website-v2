import type { VideoTestimonial } from '@/content/testimonials';

/**
 * One video testimonial card.
 *
 * A SERVER COMPONENT. It renders a `<video>` and nothing else.
 *
 * There is no cover layer and no custom play button — just the element, with
 * the browser's own controls. Removing the cover removed the only state this
 * component held, so it stopped needing to be a client component at all.
 *
 * `preload="none"` and `poster` are load-bearing and go together.
 *
 * `preload="metadata"` looks like the right setting here and is not: it is a
 * hint, and Chrome answers it on a file this short by pulling the whole thing.
 * Measured, that was 10 MB of video fetched on every homepage load before
 * anyone pressed anything. `preload="none"` fetches zero.
 *
 * That would leave an empty black frame, so each `poster` is the recording's
 * own first frame, extracted with ffmpeg by `pnpm posters`. It is the same
 * picture the browser would have shown
 * after downloading 3.3 MB, at about 30 KB, and because it is frame zero the
 * cut to live video on play is invisible. The cost is that the control bar
 * reads 0:00 until playback starts, which is the right trade at 300:1.
 *
 * It plays where it sits, at one size. The version before this opened a modal,
 * played inside it, and dropped the reader back to a small card on close, so
 * the same recording appeared at two sizes in one interaction and neither felt
 * like the intended one.
 */
export function VideoCard({
  video,
  ready,
  poster,
}: {
  video: VideoTestimonial;
  /** The recording exists on disk. False renders a note instead of a player. */
  ready: boolean;
  /** The derived first-frame still, or undefined if it has not been made yet. */
  poster: string | undefined;
}) {
  return (
    <figure className="vcard">
      {/* The figure leads the card, above the frame, because it is what the
          recording is about. Set in the accent at display weight so it reads
          as a heading rather than as a caption. The period is a separate line
          and never separates from it: a recovery figure without its window is
          a number, not a result. */}
      <figcaption className="vcard__head">
        <p className="vcard__figure">
          {video.figure}
          <span className="vcard__period">{video.period}</span>
        </p>
        <p className="vcard__detail">{video.detail}</p>
      </figcaption>

      <div className="vcard__frame">
        {ready ? (
          <video
            className="vcard__video"
            src={video.video}
            controls
            /* The card is the only size this plays at. `nofullscreen` takes the
               expand control out of the Chromium control bar, `playsInline`
               stops iOS going full-screen on its own, and picture-in-picture is
               off for the same reason — every one of them is a route back to
               the behaviour this replaced, where the recording opened large and
               then dropped the reader back to a small card. Firefox and Safari
               ignore `controlsList`, so their own expand control survives;
               there is no way to remove it without replacing the whole control
               bar, which costs more than it buys. */
            controlsList="nodownload nofullscreen noremoteplayback"
            playsInline
            disablePictureInPicture
            preload="none"
            poster={poster}
            aria-label={`Video testimonial from ${video.name}, ${video.role}`}
          >
            <track kind="captions" />
          </video>
        ) : (
          /* No file yet. A note, not a player with nothing behind it — the site
             does not simulate a thing it cannot do. */
          <div className="vcard__pending">
            <span className="vcard__pendingnote placeholder-tag">Recording to follow</span>
          </div>
        )}
      </div>

      <div className="vcard__body">
        <span className="vcard__name">{video.name}</span>
        <span className="vcard__role">
          {video.role} · {video.location}
        </span>
      </div>
    </figure>
  );
}
