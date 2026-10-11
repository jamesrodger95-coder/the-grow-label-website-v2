# /AI media: the reel, the portfolio and the industries

Drop files in. Nothing else is needed. `src/lib/studio-media.ts` reads all three
folders at build time, so a file that is present is used and one that is absent
leaves a numbered, reserved frame. There is no flag and no list to keep in step.

After adding or replacing any video, run:

```bash
pnpm studio:media
```

It covers the reel, the portfolio and the industries. It makes each file faststart (a lossless remux) and writes its poster from frame
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

Twelve frames, declared in `WORK` in `src/content/studio.ts`. The filename is the
entry's `id`:

| File stem | Media | Treatment    | Shape |
| --------- | ----- | ------------ | ----- |
| `w01`     | video | Video        | 9:16  |
| `w02`     | image | Styled shoot | 4:5   |
| `w03`     | video | Explainer    | 16:9  |
| `w04`     | video | Ad creative  | 1:1   |
| `w05`     | image | Imagery      | 3:4   |
| `w06`     | video | Demo         | 16:9  |
| `w07`     | video | Ad creative  | 9:16  |
| `w08`     | image | Styled shoot | 4:5   |
| `w09`     | video | Video        | 4:5   |
| `w10`     | image | Imagery      | 1:1   |
| `w11`     | image | Ad creative  | 4:5   |
| `w12`     | video | Demo         | 9:16  |

- **Videos:** `w01.mp4`. 1080 px on the short side, H.264, 10 to 30 seconds, no
  audio needed (the viewer starts muted and offers controls). Poster comes from
  `pnpm studio:media`.
- **Images:** `w02.webp` or `w02.jpg`, 1600 px on the long side.
- **Match the shape in the table**, or change `ratio` on the entry. The frame is
  reserved at that shape, so a different shape is cropped.

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

## 3. The industries: `public/ai/industries/`

One piece per industry, shown large beside that industry's example brief in
the sticky "Whatever you sell" section. Without a file, the section draws a
storyboard of the three outputs instead, which is fine to ship.

| File stem          | Industry         |
| ------------------ | ---------------- |
| `ecommerce`        | Ecommerce        |
| `saas`             | B2B SaaS         |
| `home-improvement` | Home improvement |
| `hvac`             | HVAC             |
| `plumbing`         | Plumbing         |
| `electrical`       | Electrical       |

- **Video** (`hvac.mp4`, with `hvac.jpg` beside it as the poster) or **an
  image** (`hvac.webp` or `.jpg`). It is cropped to fill a tall panel on desktop
  and a 16:10 panel on a phone, so keep the subject central.
- 1280 px on the long side. Encode video as for the portfolio.
- The brief beside it is labelled "Example brief", so the piece does not need
  to be the result of that exact brief.

## Never caption a piece with a result

Never caption a piece with a result (sales, conversion, ROAS). The page shows
work, not proof that it sold.
