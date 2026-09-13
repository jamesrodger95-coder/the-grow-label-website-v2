# Video testimonials

**You supply one file per testimonial: the recording.** The poster beside it is
generated from that recording, not authored — so there is no cover to design,
brief or keep in sync.

```bash
# after adding or replacing any recording
pnpm posters
```

That script does two things, and both matter:

1. **Extracts frame zero as the poster.** The card needs a still, because
   `preload="none"` is the only setting that reliably stops the browser
   downloading the video on page load — measured at 10 MB across the three
   cards with `preload="metadata"`, which Chrome treats as a hint and ignores
   on files this short. Frame zero is about 30 KB and is literally the first
   thing the video would show, so the cut to live playback is invisible.
2. **Remuxes to faststart if the file needs it.** Lossless: `-c copy`, a
   container reorder, not a re-encode.

The names are declared on each entry in `src/content/testimonials.ts` and have
to match exactly. A name that does not match renders "Recording to follow"
rather than a broken player.

Commit the generated `.jpg` files alongside the `.mp4` — the build reads them
off disk and the deploy has no ffmpeg.

## File names

| Person            | File                                     |
| ----------------- | ---------------------------------------- |
| Dr Elias Hussain  | `public/testimonials/elias-hussain.mp4`  |
| Dr Hassan Qureshi | `public/testimonials/hassan-qureshi.mp4` |
| Dr Samir Haddad   | `public/testimonials/samir-haddad.mp4`   |

## The recording

- **MP4, H.264 (High profile), AAC audio.** Not WebM, not HEVC. H.264 in MP4 is
  the one combination every browser on every platform plays without a fallback
  source.
- **16:9 landscape, 1280 × 720 or 1920 × 1080.** The card frame is 16:9 and the
  video is letterboxed inside it rather than cropped, so a portrait recording
  will sit in a tall black box. Film landscape.
- **`-movflags +faststart`.** Without it the file's index sits at the end, so
  the browser must pull most of the file before it can report a duration or
  seek. `pnpm posters` detects this and fixes it, so you do not have to
  remember — the three recordings currently here arrived with the index at the
  end and were remuxed on the way in.
- **Target 3–6 MB, hard stop at 12 MB.** A 90-second clip at roughly 2 Mbps
  lands in range. These files ship in the git repository and are served from the
  deploy, so size is not free.

```bash
ffmpeg -i source.mov \
  -vf "scale=1920:-2" \
  -c:v libx264 -profile:v high -crf 23 -preset slow \
  -c:a aac -b:a 128k \
  -movflags +faststart \
  elias-hussain.mp4
```

## Two things to check before publishing

1. **A signed release exists** for each person, covering the recording, the
   wording and the figure shown above it. Record it in
   `docs/CLAIMS_REGISTER.md`.
2. **The figure on the card matches what the client reported**, over the period
   printed beside it. The period is not decoration — it is what stops a
   two-month figure being read as a monthly rate.

## Captions

Each `<video>` carries an empty `<track kind="captions">`. Supply a WebVTT file
per recording and point the track at it when you have them; until then the
element is there so adding one is a two-line change, not a restructure.
