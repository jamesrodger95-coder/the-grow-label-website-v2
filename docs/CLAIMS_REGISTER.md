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
| Any recovered-revenue figure, in any currency                      | Audited client reporting, written client permission, and a stated period          |
| Any percentage uplift, conversion rate or improvement              | A defined baseline, a defined method, and a sample size worth quoting             |
| Any client name, logo or mark                                      | Written permission naming the specific usage                                      |
| Any testimonial or quotation                                       | Signed attribution and approval of the exact wording                              |
| Any case study                                                     | Client sign-off on both the figures and the narrative                             |
| Any named integration or partner                                   | A live, supported integration plus permission to name the vendor                  |
| Any industry average or benchmark                                  | A named, current, independent source — and it still would not describe a practice |
| "X practices use Grow Label" or any count                          | A defensible definition of an active client and a date the count is true at       |
| Any response-time, answer-rate or fill-rate figure                 | Instrumented measurement across a stated client set and period                    |
| Any staffing-cost or hours-saved figure                            | A time-and-motion baseline agreed with the client                                 |
| Any claim of security certification (ISO, SOC 2, Cyber Essentials) | The certificate, in date                                                          |
| Any claim of regulatory approval or endorsement                    | The approval, in writing, from the body concerned                                 |
| Any comparison to a named competitor                               | Legal review, plus substantiation for each point of comparison                    |

### Where the site would have used one of these

- The homepage stage bar and every illustrative proportion carries a caption
  saying the shape is illustrative and not a benchmark.
- The veterinary site-comparison and dental recall-rail devices carry the same
  caption. Sites are labelled "Site A" … "Site E" rather than invented names.
- `/insights` argues the measurement position without quoting a single figure.
- There is no pricing page, because the number comes from the assessment.
- There is no logo wall, testimonial section or case-study index. Their absence
  is a decision, not an omission to be filled later by whoever notices.

---

## Required before launch — factual gaps

Not marketing claims: facts the site legitimately needs and does not yet have.
Each is currently either absent or explicitly flagged on the page itself.

| Item                                                                  | Where it belongs               | Current state                          |
| --------------------------------------------------------------------- | ------------------------------ | -------------------------------------- |
| Registered company name and number                                    | `/terms`, footer               | Absent; flagged on the page            |
| Registered office address                                             | `/terms`, `/privacy`           | Absent; flagged on the page            |
| Named data controller and contact route                               | `/privacy`                     | Absent; flagged on the page            |
| ICO registration number, if applicable                                | `/privacy`                     | Absent                                 |
| Retention schedule for enquiry data                                   | `/privacy`                     | Described in principle, not in periods |
| The delivery provider actually used, named                            | `/privacy` third-party section | Described generically                  |
| Confirmed governing-law jurisdiction                                  | `/terms`                       | Assumed England and Wales — confirm    |
| Real published fee-schedule wording, if the assessment references one | `/contact`                     | Not referenced                         |

---

## Review

Re-read this register before any release that changes published copy. The
content-integrity test catches the mechanical cases — a percentage claim, a
banned phrase, a testimonial — but it cannot judge whether a new sentence has
quietly become a promise. That judgement is a human one, and this file is where
it is recorded.
