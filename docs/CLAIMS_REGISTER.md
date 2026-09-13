# Claims register

The purpose of this register is to keep unevidenced statements **off the
website** and in one reviewable place instead.

Nothing in the "not yet evidenced" table below appears on any published page.
Where the site would naturally have used such a claim, it either says nothing or
says explicitly that it cannot say it.

Status values: **Published** (live, and defensible as written) ·
**Blocked** (must not be published until evidenced) ·
**Required before launch** (a factual gap that must be filled, not a marketing
claim).

---

## Published — descriptions of designed behaviour

These are safe because they describe how the product is built, not what it has
achieved. They remain safe only while the product actually behaves this way.

| Claim                                                                 | Where                                 | Basis                       |
| --------------------------------------------------------------------- | ------------------------------------- | --------------------------- |
| Value is reported at four separate stages and never combined          | Site-wide                             | Product design decision     |
| A figure is promoted between stages only on a system record           | `/platform#value-stages`, `/platform` | Product design decision     |
| Every opportunity links to the source event that produced it          | `/platform#value-stages`, `/`         | Product design decision     |
| Attribution status is client-editable and disputes stay in the record | `/platform#value-stages`              | Product design decision     |
| Duplicate rules are written down and inspectable                      | `/platform#value-stages`              | Product design decision     |
| Restatements retain the previous value, date and reason               | `/platform#value-stages`              | Product design decision     |
| Each module operates inside a ceiling the client sets                 | `/platform`, `/modules/*`             | Product design decision     |
| Named escalation triggers hand a contact to a person                  | `/modules/*`                          | Product design decision     |
| Clinical judgement, triage and advice never leave the practice        | Site-wide                             | Product design decision     |
| Clinical records are not required and not read                        | `/platform`, `/modules/*`             | Data-scope decision         |
| The assessment installs nothing and changes nothing                   | `/contact`                            | Commercial process decision |
| The client keeps the assessment whether or not they proceed           | `/contact`                            | Commercial process decision |
| This website sets no analytics, advertising or tracking cookies       | `/privacy`                            | Verifiable in the source    |
| No client, patient or clinical data appears on this website           | Footer, `/privacy`                    | Verifiable in the source    |

## Published — statements of limitation

Unusually, these are claims _against_ the product. They are published
deliberately, and softening them would damage the position the site is built on.

| Statement                                                            | Where                              |
| -------------------------------------------------------------------- | ---------------------------------- |
| Recovered value is not incremental profit                            | `/platform#value-stages`           |
| Attribution is a model and does not prove causation                  | `/platform#value-stages`           |
| An estimate describes opportunity size, not likelihood of collection | `/platform#value-stages`           |
| No industry benchmark applies to a specific practice                 | `/platform#value-stages`           |
| No result is guaranteed                                              | `/platform#value-stages`, `/terms` |
| Collected value is gross, not margin and not net of delivery cost    | `/platform#value-stages`           |

---

## Blocked — must not be published until evidenced

Each row states what evidence would unblock it. Until then, no wording,
rounding, hedge or illustration of these may appear on any page.

| Claim                                                              | Evidence needed to publish                                                        |
| ------------------------------------------------------------------ | --------------------------------------------------------------------------------- |
| Any recovered-revenue figure, in any currency †                    | The client's own reporting, written client permission, and a stated period        |
| Any percentage uplift, conversion rate or improvement              | A defined baseline, a defined method, and a sample size worth quoting             |
| Any client logo or mark                                            | Written permission naming the specific usage                                      |
| Any case study                                                     | Client sign-off on both the figures and the narrative                             |
| Any named integration or partner                                   | A live, supported integration plus permission to name the vendor                  |
| Any industry average or benchmark                                  | A named, current, independent source — and it still would not describe a practice |
| "X practices use Grow Label" or any count                          | A defensible definition of an active client and a date the count is true at       |
| Any response-time, answer-rate or fill-rate figure                 | Instrumented measurement across a stated client set and period                    |
| Any staffing-cost or hours-saved figure                            | A time-and-motion baseline agreed with the client                                 |
| Any claim of security certification (ISO, SOC 2, Cyber Essentials) | The certificate, in date                                                          |
| Any claim of regulatory approval or endorsement                    | The approval, in writing, from the body concerned                                 |
| Any comparison to a named competitor                               | Legal review, plus substantiation for each point of comparison                    |

† Three recovered-revenue figures **are** published, on the video testimonial
cards. They are not an exception to this row, they are this row being satisfied:
each is one named client's own reported figure over a stated period, published
with permission and never generalised. See _Published — named client
testimonials_ below. The row stays blocked for every figure that does not meet
all three conditions.

### Where the site would have used one of these

- The homepage stage bar and every illustrative proportion carries a caption
  saying the shape is illustrative and not a benchmark.
- The veterinary site-comparison and dental recall-rail devices carry the same
  caption. Sites are labelled "Site A" … "Site E" rather than invented names.
- `/insights` argues the measurement position without quoting a single figure.
- There is no pricing page, because the number comes from the assessment. The
  contact FAQ states the pricing _model_ — fixed monthly fee per site, never a
  share of recovered revenue — which is a commercial decision, not a figure.
- There is no logo wall. Its absence is a decision.

---

## Published — named client testimonials

Six written quotations and three recorded outcomes are published as real,
attributed client evidence. They live in `src/content/testimonials.ts`, which is
the **only** file on the site allowed to hold a real client's name beside a real
figure, and they carry no illustrative label because nothing about them is
illustrative.

> **Every row below needs a signed release on file before the page is
> published.** A release covers three things and all three are required: the
> exact wording, the attribution as it appears on the card, and — for the video
> entries — the recording itself and the figure printed above it. Nothing here
> is safe on a verbal yes.

| Person            | Role                    | Surface       | Figure published        | Release on file |
| ----------------- | ----------------------- | ------------- | ----------------------- | --------------- |
| Dr Elias Hussain  | Dentist                 | Quote + video | $20,000 over two months | ☐ Outstanding   |
| Dr Hassan Qureshi | Dental Practice Owner   | Quote + video | 19 gaps / SAR 27,570 †  | ☐ Outstanding   |
| Dr Samir Haddad   | Dentist                 | Quote + video | AED 33,000              | ☐ Outstanding   |
| Dr Daniel Reed    | Veterinary Surgeon      | Quote         | None                    | ☐ Outstanding   |
| Laura Bennett     | Veterinary Practice Mgr | Quote         | None                    | ☐ Outstanding   |
| Sophie Harris     | Veterinary Practice Mgr | Quote         | None                    | ☐ Outstanding   |

† **The one converted figure on the site.** Dr Qureshi's recovery was reported
as 27,000 dirhams, but the practice is in Saudi Arabia, so it is published in
riyals. Both currencies are pegged to the dollar and neither peg has moved in
decades — AED 3.6725/USD since 1997, SAR 3.75/USD since 1986 — so the
conversion carries no exchange date and will not drift:

```
27,000 AED ÷ 3.6725 = 7,351.94 USD × 3.75 = 27,569.78 SAR
```

Published as **SAR 27,570**. A unit test fails if a second converted figure
appears, or if this one loses the working above.

**Still to confirm with the client.** If the figure was always riyals and "DHS"
was a slip in the handover, the correct number is **SAR 27,000** and this
conversion should be undone. Settle it before the release is countersigned.

**What keeps these safe.** Each figure is that client's own reported recovery
over a stated period, never annualised, and converted between currencies only
in the single documented case above. The section note on the page says in its
own words that nothing shown is an average and no result is typical, and
`describe('client testimonials')` in `tests/unit/content-integrity.test.ts`
fails the build if a period is dropped, if a name becomes anonymous, or if any
copy in that file or in `proof.ts` generalises one of these into an expectation.

**To withdraw one.** Delete the entry. Do not anonymise it: an unattributed
quotation carrying a real figure is the one thing worse than an invented one,
because nothing on the card is checkable.

---

## Labelled illustrative content

The results and case-study sections publish **finished but fabricated** content
so the site can be presented and reviewed. This is a deliberate exception to the
rows above, and it is safe only while both halves of the arrangement hold:

1. **Containment.** Every invented figure, quotation, name and organisation
   lives in `src/content/illustrative.ts` and nowhere else. There is one file to
   replace, and one file to audit.
2. **Labelling.** Every surface that renders any of it shows the label — either
   "Illustrative example" or "Placeholder case study" — beside the content, on
   the page, at the same time as the figure. Not in a footer, not on hover.

`tests/unit/content-integrity.test.ts` enforces both: no currency figure may
appear in published source outside the two reviewed content files, every
consumer of the fixture must render a badge, and every entry must carry
`illustrative: true`.

| Surface                          | What is fabricated                                         | Label shown                            |
| -------------------------------- | ---------------------------------------------------------- | -------------------------------------- |
| `/#results`                      | Four stage figures, eight operational metrics, the subject | "Illustrative example", once, at foot  |
| `/case-studies` and each study   | Organisation, narrative, all figures, the quotation        | "Placeholder case study", plus noindex |
| Industry pages, sector case list | The three studies for that sector                          | "Placeholder case study"               |

The case-study section is **off the homepage** while the studies are
placeholders. It sat two sections from six real, named client testimonials with
"Placeholder case study" on every card, which put invented evidence and real
evidence in the same eyeline. The write-ups remain at `/case-studies`, still
labelled and still `noindex`, and the primary nav points at that page rather
than at the homepage anchor it used to. Restore `<CaseStudies />` in
`src/app/page.tsx` once the studies describe real engagements.

Placeholder case-study pages carry `robots: { index: false }` and are excluded
from the sitemap, so a fabricated study cannot be indexed as evidence. Both
clear automatically when an entry's `illustrative` flag is set to `false`.

**Replacing one.** Replace the whole entry, never half of it. A card carrying a
real figure and an invented quotation is worse than an entirely invented card,
because nothing on the page tells a reader which half is which.

The team section is treated differently on purpose: these are real colleagues,
named in full. The guard on that section runs the opposite way to the guard on
the fixture — it fails if a member's name is missing, is a single word, or
contains a placeholder string. Portraits are the one outstanding item and the
cards render correctly without them.

---

## Required before launch — factual gaps

Not marketing claims: facts the site legitimately needs and does not yet have.
Each is currently either absent or explicitly flagged on the page itself.

| Item                                                                  | Where it belongs               | Current state                            |
| --------------------------------------------------------------------- | ------------------------------ | ---------------------------------------- |
| Portrait photograph: Trent Overy (4:5, 800×1000)                      | `/#team`                       | Reserved frame; other three supplied     |
| Video testimonial recordings                                          | Videos section                 | **All three supplied and live**          |
| Captions (WebVTT) for the three recordings                            | Videos section                 | Empty `<track>` wired, no files yet      |
| Signed releases for all six named clients                             | Videos and quotes sections     | **Outstanding — see the table above**    |
| Confirm Dr Qureshi's figure was dirhams, not riyals                   | Videos section                 | **Outstanding — converted; see † above** |
| Registered company name and number                                    | `/terms`, footer               | Absent; flagged on the page              |
| Registered office address                                             | `/terms`, `/privacy`           | Absent; flagged on the page              |
| Named data controller and contact route                               | `/privacy`                     | Absent; flagged on the page              |
| ICO registration number, if applicable                                | `/privacy`                     | Absent                                   |
| Retention schedule for enquiry data                                   | `/privacy`                     | Described in principle, not in periods   |
| The delivery provider actually used, named                            | `/privacy` third-party section | Described generically                    |
| Confirmed governing-law jurisdiction                                  | `/terms`                       | Assumed England and Wales — confirm      |
| Real published fee-schedule wording, if the assessment references one | `/contact`                     | Not referenced                           |

---

## Review

Re-read this register before any release that changes published copy. The
content-integrity test catches the mechanical cases — a percentage claim, a
banned phrase, a testimonial — but it cannot judge whether a new sentence has
quietly become a promise. That judgement is a human one, and this file is where
it is recorded.
