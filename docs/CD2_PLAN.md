# Plan to Customer Day 2 — Friday 23 October 2026, 14:00–14:40

CSC2101 Topic B · Group 1 · Bazi Chart Plotting Tool · written 30 Sep 2026, **updated 30 Sep after Ray's
second reply** · owner: Scrum Master + Product Owner

This is the working plan from today to CD2. It turns the CD1 report (§7–§9), the solution proposal, Ray's
replies and the tracker (`PSD_Deliverables_Tracker.xlsx`, task IDs **Txx**) into repo work with owners,
dates and a test that proves each item is done. Scope changes since CD1 are logged in
[`requirements-changes.md`](requirements-changes.md) (**RC-xx**).

---

## 1. What CD2 has to show

| # | Item | Why it is required |
|---|---|---|
| 1 | **UI look-and-feel proposal** in the fixed chart layout | Ray asked for it (minutes §2.12, transcript l.131) |
| 2 | **Reasoned choice of integration tooling** for Drive → email | Ray asked for it; report §7.3 proposed Apps Script with n8n as the alternative |
| 3 | **Delivery breakdown** across CD3–CD6 | Ray asked for it |
| 4 | **Who owns what**: named owners, especially integration | Ray asked "who will be responsible for the integration setup" (V-13) |
| 5 | **Engine progress tested against his samples**, with match rates | Promised in the follow-up email; brief: "demonstrations, prototypes … encouraged" |
| 6 | **How luck pillars and the annual pillar are computed**, explained to Ray | **New:** he doesn't know and asked us to explain it (RC-09) |
| 7 | **Our plan for the % and 6 Aspects reverse-engineering**, with first results | He called the % "the critical piece" again; the 6 Aspects are new (RC-06, RC-07) |
| 8 | Team introduction (**A1**) and asking for the floor with an agenda (**A2**) | Carried over from CD1; meeting performance is assessed |
| 9 | Roles: facilitator, note-taker, presenter, **demonstrator**, timekeeper | CD2–5 brief (the demonstrator is new) |

After the meeting: minutes, then the **CD2 report (5–10 pages of new content) + peer evaluation by Fri 30 Oct**,
uploaded to xSiTe by one person and emailed to Ray and Dr Yau. The report must include the Requirements
Change Log.

## 2. Where we are on 30 Sep

**Ray's replies** (`03_client_materials/CD1_followup_2026-09-26/` and `CD1_followup2_2026-09-30/`):

| Item | Status |
|---|---|
| Q3 — 23:00–23:59 births | ✅ **Closed.** The day pillar stays; the hour stem uses the next day (`Determining_Hour Pillar.docx`) |
| Q5 — 空亡 rule | ✅ **Closed** (`Determining_DE.docx`) |
| Q4 — hidden-stem display order | ✅ Main qi centred on every reference chart |
| Samples | ✅ **All 30 arrived** (1–10 on 30 Sep). No text layer, so they are keyed by hand |
| Q6/Q7 — input file | ✅ Add **Gender (M/F)** and an **estimated 2-hour slot** column; both blank = hour unknown. Our v2 template is drafted and must go back to Ray |
| Q2 — luck-pillar rule | 🔧 **Ours to define** — Ray doesn't know (RC-09) |
| Q10/Q11 — Gua, Life Star, 8 directions, personal details | ✅ **Now requested** (RC-05) |
| 6 Aspects (natal + annual) | 🆕 **Requested, method unknown** (RC-06) → risk R11 |
| Reference software | ℹ️ **Joey Yap's BaZi software**. Its footer claims copyright on its charts, designs and terminology → risk R10 |
| Q14 — clock vs true solar time | ❓ Still open |

**This scaffold** (branch `chore/cd2-scaffold`):

- One engine package with the **ChartResult v1 draft** (`packages/engine/src/types.ts`), shared vocabulary,
  and one stub module per workstream. The web app and the Apps Script project both build.
- **90 workstream specs** with expected values from Ray's documents, the verified cases and the reference
  charts. They **skip** while a module is a stub and switch on automatically when it is implemented. All but
  the three WS3 invariants were run against a throwaway reference implementation, so each one is
  achievable. 9 foundation tests already pass.
- **Golden charts:** Example A, the computation-doc sample, **Ray's 1978 子-hour chart**, and the 2026 month
  strip in both layouts.
- **Spike S2, Node + browser — done:** lunar-javascript 1.7.7 reproduces Example A, the doc sample, and
  Ray's 1978 chart with sect 2 (the library default). The web-app footer confirms it in the browser.
- The web app renders the full Example A chart from a hand-checked mock: Gua, 8 personal details, and the
  Feb→Jan month strip with life stages. WS7 and WS8 can start today.

## 3. "CD2-ready" means

| Demo item | Proven by | Owner | Internal due |
|---|---|---|---|
| Four pillars incl. the late 子 hour, hidden stems, Ten Gods, voids | `calendar`, `stems` specs + golden `example-a`, `doc-sample`, `zi-hour-1978` green | WS1, WS2 | **Fri 16 Oct** |
| Personal chart details (8), Life Gua + Life Star + 8 directions, warnings | `lookups` specs + golden sections green | WS6 | **Fri 16 Oct** |
| Annual pillar, month strip, luck direction; **our luck method, explained** | `cycles` specs + golden `month-strip-2026`; `docs/luck-pillars-for-ray.md`; start-age rule scored on 30 samples | WS4 | Wed 21 Oct |
| Clash / harmony / punishment summary | `relations` specs green; run on Example A vs 2026 | WS5 | Wed 21 Oct |
| All 30 samples keyed and double-checked | Private `samples.csv` complete | WS3 + WS9 (+ helpers) | **Fri 9 Oct** |
| Match-rate table for the demo | `samples.test.ts`: pillars, voids, details, Gua, first luck age, % | WS9 | Fri 9 Oct, refreshed 21 Oct |
| % models (natal + annual) and 6 Aspects: method + first match rate | `research/profiles/models.md` | WS3 | Wed 21 Oct |
| UI look-and-feel proposal on the live engine, EN / 中文 / Pinyin, phone + desktop | Web app running; screenshots at phone width | WS7 | **Fri 16 Oct** |
| Drive → PDF → email prototype, reading the **v2 template** | Inbox file in a test account → email with a PDF (mock chart OK) | WS8 | **Fri 16 Oct** |
| Tooling decision write-up | One page: Apps Script vs n8n vs Zapier/Make, with spike results | WS8 | Fri 16 Oct |
| Architecture diagram + user/technical doc outlines | `docs/architecture.md` diagram; outlines in `docs/` | WS10 | Wed 21 Oct |
| Deck: intro (A1), agenda (A2), demo, luck explainer, delivery breakdown with owners, questions | Deck + speaker notes | Presenter (Jia Rui) + PO | Wed 21 Oct |
| Timed dry run of the 40-minute slot | Rehearsal done | All | **Thu 22 Oct** |

## 4. Timeline

| When | What | Tracker |
|---|---|---|
| **Wed 30 Sep (today)** | Merge this scaffold after review. **If consultation 1 is not booked yet, email Dr Yau today — the 36-hour cutoff is Thu 1 Oct 02:00.** | T16 |
| Thu 1 Oct | Everyone: clone, `npm install`, `npm run check` passes. Owners read their module header + specs. **PO sends Ray `Clients_particulars_v2.xlsx` to confirm the slot format.** | RC-08 |
| **Fri 2 Oct** | **S1: ChartResult v1 frozen** (WS1 + WS7 + WS8 sign off `types.ts`). S6 designed-sample request drafted. Consultation 1 (14:00–18:00, W5-04-06): raise R10 (copyright) with Dr Yau. | T20, T24, T17 |
| Mon 5 – Fri 9 Oct | Quiz 1 week — keep tasks small. S2 (Apps Script half), S3, S4, S7, **S8**. **All 30 samples keyed and checked.** | T21–T23, T25 |
| **Fri 9 Oct** | Sprint 1 review: spikes written up in `docs/spikes.md`; first match-rate table. | — |
| Mon 12 Oct | **Send the CD2 calendar invite** (hard deadline Fri 16 Oct) to Ray, Dr Yau and the team. | T39 |
| 12–18 Oct (recess) | Engine sprint. WS7 builds the proposal on real output; WS8 wires the prototype. | T26–T31, T36, T37 |
| **Fri 16 Oct** | Engine core + lookups green; UI proposal; Drive → email prototype; tooling decision. Assign CD2 meeting roles. | T35–T37 |
| Wed 21 Oct | WS3/4/5 milestones; luck explainer; deck + demo pack; question list; delivery breakdown. | T28–T30, T38, T40–T42 |
| Thu 22 Oct | Timed dry run. | T43 |
| **Fri 23 Oct** | **Customer Day 2**, 14:00–14:40, E2-07-15-SR267 per the schedule (settle SR267 vs SR268 — T05). Record it. | T44 |
| Fri 30 Oct | CD2 report (with the Requirements Change Log) + peer evaluation due; consultation 2 (book by Thu 29 Oct 02:00). | T45–T49 |

## 5. Workstream backlog to CD2

Owners and backups are from CD1 report §8 (roles on trial until CD2). The backup is the default PR reviewer.
"Done when" is always a set of specs turning from *skipped* to *passed* in CI.

### WS1 — Four-pillar calendar · Isaac (backup Darrius) · `packages/engine/src/calendar/`
1. **S1:** walk WS7 + WS8 through `types.ts`; agree changes; freeze v1 by **2 Oct**.
2. **S2:** the Apps Script half (`selfTest()` in a test account). The Node and browser halves are done.
3. Implement `hourBranchOf`, `monthStem`, `hourStem`, `defaultUtcOffset`, `computePillars` on lunar-javascript
   with **sect 2** (`lateZiHour: 'split'`), and **no historical offset by default** (`historicalUtcOffset: 'ignore'`).
4. Cross-check the calendar layer against a second source (proposal §7.3); record it in `docs/spikes.md`.
- **Done when:** `calendar.test.ts` (16 specs) and the golden `[WS1] pillars` sections pass. **By 16 Oct.**

### WS2 — Hidden Stems, Ten Gods & life stages · Cleavant (backup Vanessa) · `packages/engine/src/stems/`, `core/terms.ts`
1. Implement `hiddenStems`, `tenGod`, `orderForDisplay`, and **`lifeStage`** (十二长生; yin stems backward).
2. Review the terms table (`core/terms.ts`): EN wording, 中文, Pinyin with tones. **Avoid the reference software's
   branded labels** (R10). Propose display names for the 6 Aspects and structures to agree with Ray.
- **Done when:** `stems.test.ts` (10) + golden hidden-stem and Ten-God sections pass. **By 16 Oct.**

### WS3 — Percentages & 6 Aspects · Hanzalah (backup Cleavant) · `research/profiles/`
1. Key **all 30** samples into the private `samples.csv` (new wider template: every value printed on the chart).
   Two people per row. Borrow hands from WS5/WS10 for one evening. **By 9 Oct.**
2. Send Ray the designed-sample request (S6). **By 2 Oct.**
3. **Natal %** first hypothesis → match rate. Then **annual %** (lead: natal + current luck + annual pillar).
4. **6 Aspects:** measure the bars (S8), use the printed deltas as exact checks, and look for a mapping from
   the Ten Profiles / structures.
- **Done when:** match rates for natal %, annual % and aspects are recorded in `research/profiles/models.md`.
  **By 21 Oct.** (`profiles.test.ts` switches on once a model is accepted — not expected by CD2.)

### WS4 — Luck, annual & monthly pillars · Raees (backup Dave) · `packages/engine/src/cycles/`
1. Implement `annualPillar`, `monthStrip` (both spans), and `computeLuck` (direction from gender + year-stem polarity).
2. **Choose** the start-age rule (days ÷ 3 vs minutes, real vs nominal ages) and score it against the printed
   first-luck age on all 30 samples. Investigate the "born hours before a 节" case, where the reference shows 10.
3. Write **`docs/luck-pillars-for-ray.md`**: a one-page, plain-English explanation for Ray, and a slide for CD2.
- **Done when:** `cycles.test.ts` (6) + golden month strip / annual pass; the explainer is reviewed. **By 21 Oct.**

### WS5 — Clash / harmony / punishment · Dave (backup Raees) · `packages/engine/src/relations/`
1. Build the rule tables from `Harms_Punishments.pdf` and `Bazi_hidden stems.docx`; add a spec per rule.
2. Implement `detectRelationships` for natal pillars, the current luck pillar and the annual pillar.
- **Done when:** `relations.test.ts` (4) passes, including the six Example A findings. **By 21 Oct.**

### WS6 — 空亡, personal details, Life Gua & edge cases · Darrius (backup Isaac) · `packages/engine/src/lookups/`
1. Implement `voidBranches` (rule confirmed), `supportingDetails` (**8 details**), **`lifeGua`**, `boundaryWarnings`.
2. Use the samples to settle the leads in `docs/conventions.md`: day vs year branch, the Life Palace formula,
   and the Gua year boundary.
3. ⚠️ **Workload:** RC-05 roughly doubled this workstream. Isaac (backup) takes `lifeGua` once WS1 is green.
- **Done when:** `lookups.test.ts` (15) + golden void, details and Gua sections pass. **By 16 Oct.**

### WS7 — User interface · Vanessa (backup Kai Wen) · `apps/web/`
1. The scaffold is React + Vite, picked as the most widely known option. If you'd rather use Svelte, swap it in
   **this week**; only `apps/web` changes.
2. Build the look-and-feel proposal: colours, typography, the month strip (right → left, life stages), the Gua
   panel, profiles radar + bars (natal vs annual), 6 Aspects bars, phone layout. Keep the pillar order fixed.
   **Our own design — don't copy the reference software's look** (R10).
3. **S4:** static-host terms (Cloudflare Pages / Firebase / GitHub Pages) and PWA install on iOS + Android.
4. With WS8, decide the chart → PDF route (S3); if HTML, share one renderer.
- **Done when:** the proposal runs on the live engine at phone and desktop widths. **By 16 Oct.**

### WS8 — Drive → email automation · Jia Jun (backup Jia Rui) · `apps/batch/`
1. Implement `parseRows` for **template v2** (Gender + slot columns, header on row 3) — `rows.test.ts` (11) is waiting.
2. **S3:** PDF with Chinese text — HTML route vs Google Slides template.
3. **S7:** Ray's template is `.xlsx`, which Apps Script can't read directly. Convert it on arrival (Drive API), or ask
   Ray to keep it as a Google Sheet.
4. Prototype in a **team test Google account**: `setup` → drop a file → email with PDFs. Write up the tooling decision.
- **Done when:** a demo run end-to-end with the Example A mock chart. **By 16 Oct.**

### WS9 — Testing & validation · Kai Wen (backup Jia Jun) · `packages/engine/test/`, `fixtures/`
1. **S5:** keep CI green; add a golden case for every rule Ray documents; review every spec change.
2. Co-own the sample keying with WS3; run `samples.test.ts` weekly and log the match rates per module.
3. **S8:** see whether PyMuPDF can measure the 6 Aspects bars and the 10 Profiles bars from the PDFs.
- **Done when:** the match-rate table is in the demo pack. **By 9 Oct**, refreshed 21 Oct.

### WS10 — Integration & documentation · Jia Rui (backup Hanzalah) · `docs/`, `packages/engine/src/chart.ts`
1. Set up GitHub: protect `main` (PR + 1 review + CI), fill `.github/CODEOWNERS`, link the Jira project.
2. Own `computeChart` integration: when all engine specs are green, the web app must show a live chart.
3. Architecture diagram for the deck, plus outlines for the user guide and technical documentation.
4. Keep `docs/requirements-changes.md` current; it goes into the CD2 report.
- **Done when:** outlines + diagram merged. **By 21 Oct.**

## 6. Spikes

Tracked in [`docs/spikes.md`](spikes.md): S1 ChartResult · S2 calendar library in all three runtimes ·
S3 CJK PDF from Apps Script · S4 hosting + PWA · S5 test harness · S6 designed-sample request ·
S7 reading Ray's `.xlsx` in Apps Script · **S8 (new) reading values off the sample PDFs.**

## 7. Questions for Ray at CD2

Dr Yau noted that about 90% of our CD1 questions were technical, so these lean towards the domain. Items Ray
has already answered are gone from this list.

**Business and domain**
1. What do the percentages mean in a consultation: affinity, or an influence to manage? (Q9) And the 6 Aspects?
2. How would you use the natal vs annual comparison with a returning client?
3. How would you use a clash / harmony summary during a session? Which relationships matter most?
4. What happens to a chart after the consultation: do you forward our PDF as-is? Would you want your own branding
   on it (rather than the reference software's)?
5. How many clients are in a typical batch, and how far ahead do you prepare? (This sets the performance NFR.)

**Scope and conventions**
6. **Present our luck-pillar method** (WS4 explainer) and confirm he is happy with it. (RC-09)
7. The month strip: Feb → Jan (the Bazi year, as in the software) or Jan → Dec (as on his slide)?
8. The **Annual Bazi Stars** panel on the software's chart: wanted? (Qi Men stays out, as agreed at CD1.)
9. Display names for the structures, profiles and aspects: his deck's wording (Connector, Creator…), classical
   terms, or new ones? (R10 — we won't copy the software's branded labels.)
10. Does the v2 template work for him? Is the slot dropdown clear? (RC-08)
11. Clock vs true solar time (Q14) — the one open convention.
12. Unknown birth hour: plot with a warning, or decline? (Q7)
13. The birth data of the "luck starts at 8" chart on his slide, so we can check our luck rule on it.

## 8. Delivery breakdown to present at CD2

| Milestone | What Ray sees |
|---|---|
| **CD2 · 23 Oct** | UI proposal on the live engine core; tooling decision; Drive → PDF → email prototype; luck method explained; % and 6 Aspects method with first match rates; owners per area |
| **CD3 · 27 Nov** | Complete engine (luck, relationships, voids, personal details, Gua, warnings); working web app; end-to-end batch on test data in a test account; natal % model v1 with its match rate |
| **CD4–CD5 · T2** | Annual % and 6 Aspects models (decision point at CD4 if not exact — R1, R11); edge cases; end-user testing with Ray; deployment into Ray's account; documentation drafts |
| **CD6 · final** | Deployed in Ray's account; user guide; technical documentation; user-feedback report; final report |

## 9. Risks to the CD2 path

| Risk | Mitigation |
|---|---|
| **R10 (new) — copyright:** the reference charts carry a Joey Yap notice claiming the charts, designs and terminology | Match the *computations*, not the presentation. Use our own design and classical or Ray-agreed wording. Raise it with Dr Yau at consultation 1. |
| **R11 (new) — 6 Aspects formula unknown**, on top of R1 | Same method as the %: key the data, use the printed deltas as exact checks, fit; decision point at CD4. Don't promise exactness at CD2. |
| Keying 30 samples with ~60 values each is slow and error-prone | Two people per row; S8 to automate the bar measurements; split the samples across 4–5 people. |
| WS6 workload doubled by RC-05 | Backup (Isaac) takes the Gua after WS1 lands; Gua specs are table-driven and quick. |
| WS1 is on everyone's critical path | Each module takes the fixture's pillars as input (golden harness), so nobody waits on WS1. |
| Quiz 1 week (5–11 Oct), then recess | Freeze S1 before Quiz week; use the recess for the engine sprint. |
| Chinese text doesn't render in the Apps Script PDF | Google Slides template fallback (S3). |
| Ray's `.xlsx` isn't readable in Apps Script | S7: convert on arrival, or agree a Google Sheet. |
| New major tool versions (TypeScript 7, Vitest 5, Vite 8) | The lockfile pins them and CI proves them. Pin back one major if anything breaks. |
| The repo sits in OneDrive, so `node_modules` would sync tens of thousands of files | Clone the repo outside OneDrive (e.g. `C:\dev\bazi_tool`). Keep documents in OneDrive. |
