# Team portraits

Drop the four files in here. Nothing else is needed — `src/components/home/Team.tsx`
checks this folder at build time, so a file that is present is used and a file
that is absent falls back to the drawn 4:5 placeholder. There is no flag to set
and no code to change.

## File names

The name is not a preference. Each one is declared on the member in
`src/content/proof.ts` and has to match exactly, lowercase, hyphenated:

| File                               | Person           | Role                     |
| ---------------------------------- | ---------------- | ------------------------ |
| `public/team/james-rodger.jpg`     | James Rodger     | Co-Founder               |
| `public/team/trent-overy.jpg`      | Trent Overy      | Co-Founder               |
| `public/team/isabelle-njorrak.jpg` | Isabelle Njorrak | Client Relations Manager |
| `public/team/hadleigh-bognuda.jpg` | Hadleigh Bognuda | Advisor                  |

## The crop

- **Ratio 4:5 (portrait).** The card reserves exactly this, so anything else is
  cropped to it and you lose the edges you did not choose.
- **2× for a retina screen: 800 × 1000 px.** Larger is wasted; the card is
  never wider than about 300 CSS pixels.
- **Eyes on the upper third.** The CSS anchors the crop at `center 22%`, which
  is where a head sits in a well-framed portrait. A photograph framed much
  looser will read as though the subject is sinking.
- **JPEG, quality 80, sRGB, no embedded colour profile beyond sRGB.** Aim for
  under 120 KB each. Strip EXIF — it carries camera serial numbers and,
  depending on the device, a GPS location.

## After adding them

```bash
pnpm build          # the fs check runs during the build, not at request time
node scripts/capture.mjs
```

If a portrait appears stretched or off-centre, adjust `object-position` on
`.person__img` in `src/styles/sections.css` rather than re-cropping four files
to suit one.
