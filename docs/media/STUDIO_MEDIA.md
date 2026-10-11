# /AI media: the reel and the portfolio

Drop files in. Nothing else is needed. `src/lib/studio-media.ts` reads both
folders at build time, so a file that is present is used and one that is absent
leaves a numbered, reserved frame. There is no flag and no list to keep in step.

After adding or replacing any video, run:

```bash
pnpm studio:media
```

It covers the reel and the portfolio. It makes each file faststart (a lossless remux) and writes its poster from frame
zero. Every clip is `preload="none"`, so without a poster it starts on a blank
tile. Then rebuild, because the folders are read at build time.

Keep this README out of `public/`. Anything in there is served.

## 1. The hero reel: `public/ai/reel/`

The curved 3D tunnel of small clips under the headline. Built for 30 to 40
clips; they are cycled round three rows of 24 tiles, so fewer clips repeat
more often.

- **Any name, any order.** Tiles follow filename order, so prefix a number
  (`01-…`, `02-…`) to control it. Rows are filled round-robin.
- **Say the shape in the name.** `-9x16`, `-4x5`, `-3x4`, `-1x1` or `-16x9`
  anywhere in the name sets the tile's shape, e.g. `07-serum-9x16.mp4`. Without
  it the tile takes a shape from a fixed mix and the clip is cropped to fit.
- **Small and short.** These render at 60 to 160 CSS pixels tall. Export at
  **360 px on the short side**, **4 to 8 seconds**, a clean loop.
- **H.264 MP4, no audio track**, around **400 to 800 kbps**. A 6 second clip
  should land under 500 KB. Dozens sit on the first screen, and the page
  only ever plays 24 at once (8 on a phone).
- **No text that needs reading.** At this size it is texture, not copy.

## 2. The portfolio: `public/ai/work/`

Declared in `WORK` in `src/content/studio.ts`; the filename is the entry's
`id`.

- **w01 to w35** are films and **w36 to w43** product stills. All of them are
  produced, together with their hero tunnel tiles, by the import script from
  the exported folders; the paths are listed at the top of the script:

  ```bash
  python scripts/studio-import.py "C:/Users/james/Downloads"
  pnpm studio:media
  ```

  Films become a 720p piece of at most 20 seconds plus a five-second silent
  tunnel loop; stills a 1600 px WebP plus a 360 px tunnel tile. Existing
  outputs are skipped (pass `--force` to redo them). Add new files to FILMS or
  STILLS in the script, and give each a `WORK` entry.

### Every piece needs a label before it ships

When a file goes in, fill in its entry in `src/content/studio.ts`:

```ts
{
  id: 'w01', media: 'video', treatment: 'Video', ratio: '9:16',
  title: 'Serum launch loop',          // what the piece is
  category: 'Skincare',                // what was being sold
  credit: { kind: 'client', brand: 'Brand name' },   // or { kind: 'concept' }
},
```

- `client` only when the business commissioned the work **and has agreed to it
  being shown**. Record the agreement in `docs/CLAIMS_REGISTER.md`.
- Anything made on spec, as a test, or for a brand that has not agreed is
  `{ kind: 'concept' }`, and the page labels it "Concept work".

`tests/unit/studio-media.test.ts` fails the build if a file is present and its
entry has no `title` or `credit`, so an unlabelled piece cannot go live.

## Never caption a piece with a result

Never caption a piece with a result (sales, conversion, ROAS). The page shows
work, not proof that it sold.
