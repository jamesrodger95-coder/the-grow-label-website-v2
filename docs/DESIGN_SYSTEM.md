# Design system

Source of truth: `src/styles/tokens.css`, `base.css`, `components.css`.
`design/*.css` are copies of those three files, so the Claude Design artboards
render exactly as production does.

## The visual thesis: the capacity ledger

In a veterinary or dental group, lost revenue is not abstract. It is
**whitespace in a column** — a gap in tomorrow's day sheet — and **a row never
written** into the ledger. The call that rang out at 4:52pm. The estimate
accepted and never scheduled. The recall that lapsed eleven months ago.

So the site is built from the two artefacts operators already read every
morning: the **column** and the **ledger row**. Nothing here is a dashboard
illustration; it is the same object at brand scale.

Two structural devices carry it:

**The column.** A slot unit generates the spatial rhythm. Filled slots are
solid, open slots are hollow with a visible hairline, recovered slots are the
accent at full strength. Faint vertical rules divide sections like a schedule
grid.

**The four-stage bar.** Estimated → Booked → Attended → Collected, as four
descending segments of one hue. The signature graphic is an act of financial
honesty rather than decoration, which is the whole brand position rendered as a
picture.

### Deliberately not

No rounded feature cards. No purple gradient. No stock clinic photography. No
glassmorphism. No shadow-based elevation. Corner radius is 0 on structure and
2px on controls, because ledgers do not have rounded corners.

## Colour

Two grounds and one accent. Violet appears only where a revenue signal is being
detected, followed or confirmed.

### Dark grounds

| Token             | Value     | Used for                          |
| ----------------- | --------- | --------------------------------- |
| `--gl-void`       | `#08080B` | Hero, footer, signature sequences |
| `--gl-ink`        | `#0E0E13` | Standard dark section             |
| `--gl-ink-raised` | `#16161D` | Elevated dark panel               |
| `--gl-ink-sunken` | `#050507` | Recessed wells                    |

### Light grounds

| Token            | Value     | Used for              |
| ---------------- | --------- | --------------------- |
| `--gl-paper`     | `#F6F6F3` | Lightest surface      |
| `--gl-bone`      | `#EDEDE9` | Primary light section |
| `--gl-bone-deep` | `#E0E0DB` | Light-grey band       |

### The single accent

| Token              | Value     | Contrast                    |
| ------------------ | --------- | --------------------------- |
| `--gl-signal`      | `#9A8FE6` | 7.1:1 on `--gl-void`        |
| `--gl-signal-deep` | `#453A96` | 7.8:1 on `--gl-bone`        |
| `--gl-signal-core` | `#5A4CC0` | Brand mark only             |
| `--gl-alert`       | `#E0574F` | Form errors on dark, 5.4:1  |
| `--gl-alert-deep`  | `#A52A22` | Form errors on light, 6.1:1 |

### The value-stage ramp

Estimated, Booked, Attended and Collected are **one hue at four densities**, not
four colours. Four different colours would imply four different things; these
are the same money at four levels of certainty. The ramp is the argument.

`--gl-stage-1` … `--gl-stage-4` on dark, `--gl-stage-1-l` … `--gl-stage-4-l` on
light. A surface class picks the right set, so a component never chooses.

### Surface contract

Every section carries a ground class (`.surface--void` … `.surface--deep`) and
an ink class (`.on-dark` / `.on-light`). The ink class defines `--rule`,
`--rule-soft`, `--muted`, `--faint`, `--accent`, `--slot-open` and the four
stage tokens. **A component never hard-codes a colour** — it reads these, and
therefore works on any ground.

Text alphas were set from measured contrast, not by eye: muted is 0.74 on dark
and 0.80 on light; faint is 0.55 and 0.64. Both clear 4.5:1 at label sizes.

## Typography

Three families, three jobs. Neither Inter nor Poppins appears anywhere.

| Role      | Face                          | Why                                                                                                        |
| --------- | ----------------------------- | ---------------------------------------------------------------------------------------------------------- |
| Display   | Instrument Serif 400 + italic | High-contrast editorial serif. The italic is a semantic device: it marks the recovered half of a sentence. |
| Interface | Archivo variable 300–700      | A grotesque with authority and a tall x-height, for dense copy.                                            |
| Data      | IBM Plex Mono 400             | Tabular figures, section indices, eyebrows, axis labels.                                                   |

Four files, latin subset. The two faces that paint the first screen are
preloaded; the monospace is not.

### Scale

| Token   | Size                                  | Use                           |
| ------- | ------------------------------------- | ----------------------------- |
| `d1`    | `clamp(2.75rem, 7.2vw, 7rem)`         | Hero only. One per page.      |
| `d2`    | `clamp(2.375rem, 5.6vw, 5rem)`        | Section statements.           |
| `d3`    | `clamp(1.875rem, 3.6vw, 3.125rem)`    | Sub-sections and page heads.  |
| `d4`    | `clamp(1.5rem, 2.4vw, 2.125rem)`      | Item titles.                  |
| `lead`  | `clamp(1.0625rem, 1.35vw, 1.3125rem)` | Standfirst.                   |
| `body`  | `1rem / 1.62`                         | Running copy, capped at 68ch. |
| `label` | `0.6875rem` mono, `0.15em`            | Eyebrows, indices, axes.      |

Display type sets at `-0.03em` with `0.94` leading and `text-wrap: balance`.
Body copy uses `text-wrap: pretty`. All numerals are tabular, everywhere, so a
figure never reflows as it changes.

## Structure

`--gl-slot: 46px` is the schedule-slot unit the spacing scale is tuned to.
Twelve columns above 900px, six below. Gutter is `clamp(20px, 4.4vw, 64px)`;
section padding is `clamp(72px, 9vw, 152px)`.

Hairline rules do all the dividing work. Elevation is used almost nowhere.

## Components

| Component         | Class         | Notes                                                        |
| ----------------- | ------------- | ------------------------------------------------------------ |
| Section header    | `.sec-head`   | Index, statement, right-aligned aside, closing rule          |
| Ledger row        | `.lrow`       | Index, key, detail, trailing classification                  |
| Four-stage bar    | `.stagebar`   | The signature proof device                                   |
| Capacity column   | `.capcol`     | Filled / open / recovered slots, width-capped by `.capblock` |
| Key-value strip   | `.kv`         | Hairline-separated cells, never a card grid                  |
| Step list         | `.steps`      | Numbered only where order carries meaning                    |
| Escalation ladder | `.ladder`     | Trigger on the left, handover on the right                   |
| Stage matrix      | `.matrix`     | Influences vs observes, per module                           |
| Site comparison   | `.sites`      | Veterinary signature device                                  |
| Recall rail       | `.rail`       | Dental signature device                                      |
| Spec table        | `.spec`       | Four columns ending in prose, for reference tables           |
| Module rail       | `.rail-index` | Where you are in the four-module system                      |

### Ledger row variants

The trailing column is a **fixed 11rem**, not `auto`. An auto track resizes with
the longest tag in each row, and the detail column then starts at a different x
on every line, which reads as misalignment down the ledger.

Use the modifiers, never an inline `gridTemplateColumns` — an inline style wins
on specificity and silently defeats the mobile rules:

| Modifier             | Shape                                            |
| -------------------- | ------------------------------------------------ |
| `.lrow--pair`        | Index + content                                  |
| `.lrow--pair-action` | Index + content + trailing affordance            |
| `.lrow--action`      | Content + trailing affordance                    |
| `.lrow--stage`       | Term + definition + basis, valid inside a `<dl>` |

## Responsive behaviour

Mobile is a re-composition, not a stack.

| Breakpoint | What changes                                                                                                                     |
| ---------- | -------------------------------------------------------------------------------------------------------------------------------- |
| ≥ 1440     | 12 columns, 64px gutter, hero splits 1 / 0.42                                                                                    |
| 1080–1439  | Navigation links compress; module blocks stay three across                                                                       |
| < 1080     | Nav collapses to the drawer; hero becomes one column; the hero aside and the decorative signal marks are **removed, not shrunk** |
| < 900      | Two-column sections stack; sticky asides become static                                                                           |
| < 760      | Ledger rows stack, with every cell after the index moving to the content column                                                  |
| < 620      | The stage bar becomes name + basis on one line, track beneath                                                                    |

Every control has a 24×24 minimum target (WCAG 2.2 AA), and primary actions
clear 44px. Hover-only affordances — the retracting rule, the travelling arrow —
carry no information.

## Accessibility contract

- Focus is always visible: a 2px accent outline at 3px offset, colour-matched
  to the ground.
- A skip link is the first tab stop and moves focus into `#site-main`.
- The drawer traps focus, closes on Escape, restores focus to its toggle and
  locks background scroll.
- Decorative ordinals, glyphs and graphics are `aria-hidden`, so they never
  enter an accessible name.
- Every chart-like device carries a text alternative describing what it shows.
- Status is never carried by colour alone.
