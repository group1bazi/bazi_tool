# Sprint 1 spikes — test before committing

A spike is a small, time-boxed experiment that answers one question. It ends with a **decision**, written up
here (keep each to ~10 lines). The results go into the CD2 deck and report.

| # | Question | Owner (+ helper) | Due | Status |
|---|---|---|---|---|
| S1 | Is ChartResult v1 (`types.ts`) right for the engine, the UI and the batch job? | WS1 (+ WS7, WS8) | Fri 2 Oct | Draft ready — see `chart-result.md` |
| S2 | Does lunar-javascript reproduce Ray's charts in **Node, the browser and Apps Script**? | WS1 (+ WS6) | Fri 2 Oct | **Node ✅, browser ✅ (30 Sep).** Apps Script: run `selfTest()` |
| S3 | Can Apps Script make a PDF with correct 中文 and the fixed grid? HTML route vs Google Slides template | WS8 (+ WS9) | Fri 9 Oct | Not started |
| S4 | Which free static host allows a practitioner's business use? Does the PWA install on iOS and Android? | WS7 (+ WS10) | Fri 9 Oct | Not started |
| S5 | Is the test harness running in CI with the verified fixtures? | WS9 | Fri 9 Oct | **✅ Scaffolded** — CI runs 90 specs, which switch on as modules land |
| S6 | Draft the designed-sample request for Ray (vary one factor at a time). Samples 1–30 have all arrived | WS3 (+ WS2) | Fri 2 Oct | Not started |
| S7 | Ray's template is `.xlsx`. Convert it on arrival (Drive API / advanced service), or ask him to keep a Google Sheet? | WS8 | Fri 9 Oct | Not started — template v2 drafted (RC-08) |
| S8 | **New:** can we read values off the sample PDFs by machine? They have no text layer; the 6 Aspects bars print no numbers | WS9 (+ WS3) | Fri 9 Oct | **✅ Done (30 Sep)** — all 30 keyed; see notes below |

---

## S2 — calendar library in every runtime

**Result so far (30 Sep, scaffold):** lunar-javascript 1.7.7 (MIT, no dependencies) loads through our ESM
toolchain in Node, and reproduces:

- Example A: 1988-09-06 01:30 → 戊辰 庚申 甲子 乙丑; day void 戌亥; hidden stems and Ten Gods as on Ray's chart
- Client doc sample: 1988-11-15 12:00 → 戊辰 癸亥 甲戌 庚午; void 申酉
- **Ray's 子-hour chart:** 1978-02-03 23:59 → 丁巳 癸丑 丙申 庚子 with `setSect(2)`, which is the library's
  **default** (`getSect()` returns 2). `setSect(1)` gives a 丁酉 day, which is wrong for Ray.
- The same birth converted from Singapore's +07:30 gives a 丁酉 day, so the reference applies no historical offset
- 2026 jie instants (e.g. 立春 04:02:08, 小寒 2027 22:09:58) and both month-strip spans
- Luck (Example A, female): backward, 己未 first, start 9y 9m 20d with both methods; ages are **nominal**

Also: the package ships **no TypeScript types**; we keep minimal ones in `src/vendor/lunar-javascript.d.ts`.
The Apps Script bundle is ~540 kB — confirm `clasp push` accepts it.

**Browser (30 Sep):** the web-app footer shows "OK — 戊辰 庚申 甲子 乙丑".

**Still to do:** the Apps Script check (`selfTest`), then a second source for the solar-term instants (proposal §7.3).

**Decision:** _pending the Apps Script check_ — lunar-javascript, sect 2.

## S3 — PDF with Chinese text from Apps Script

**Method:** render `EXAMPLE_A_CHART` both ways in a test account; check the characters, the grid alignment
and the time per chart. **Result:** … **Decision:** …

## S4 — hosting and install

**Method:** read each host's free-tier terms for commercial use; deploy `apps/web/dist`; add a manifest and
service worker; install on one iPhone and one Android phone. **Result:** … **Decision:** …

## S6 — designed-sample request

**Draft the email** (sent by the PO): the same birth date at all 12 hours; the same hour either side of a
solar term; a chart where one god appears only as residual qi. Also ask for the same person in two different
annual years, so the natal and annual percentages and 6 Aspects can be separated. (All 30 samples have
arrived, so there's no need to chase 1–10.)

## S7 — reading Ray's file in Apps Script

**Method:** fill `Clients_particulars_v2.xlsx` with synthetic rows and drop it into a test Inbox. Try converting
it to a Google Sheet with the Drive advanced service, and compare that with asking Ray to keep a Google Sheet.
The v2 template's slot dropdown lives on a second sheet (`Lists`), so check that the conversion keeps the
values as text. **Result:** … **Decision:** …

## S8 — reading values off the sample PDFs

**What we know (30 Sep):** each sample is a 2-page Joey Yap "Personal Chart" PDF with **no text layer**. The
characters and percentages are drawn as vector shapes, so they must be keyed. Page 2 has the 6 Aspects bars
(**no numbers printed**, only the change under each bar, e.g. "↓15%") and the 10 Profiles bars (numbers printed).
Rendering works with PyMuPDF (`pip install --target <scratch> pymupdf`; `page.get_pixmap(dpi=110)`).

**Question:** can we measure the 6 Aspects bar heights, and cross-check the printed profile values, from the
rendered page or the PDF drawing commands (`page.get_drawings()`), instead of estimating by eye?

**Result (30 Sep):** yes, for everything drawn as a number or a bar.
- **Profile %:** each printed digit is one vector shape, so a small shape dictionary decodes all 600 values
  exactly. The profile bars are vector rectangles too, and their widths agree with the printed numbers.
- **6 Aspects:** the chart is an embedded image. Bar heights measured between its 0% and 100% gridlines all sit
  on multiples of 5. Every printed change equals annual − natal (180/180).
- **Five Structures:** the radar is a background image plus one high-resolution image per polygon. The dots
  are located in those images, then read against the axis ticks, calibrated per axis. Accuracy is about ±2.
- **Text** (pillars, details, Gua, luck ages): still read by eye from high-resolution crops, then
  cross-checked against lunar-javascript. All 30 agree.

**Decision:** keyed all 30 into `Sample_Register` → `Sample_Values`, and into `research/profiles/data/samples.csv`
(git-ignored). A teammate still has to fill `checked_by` for each row.

**Privacy:** the PDFs show the client's name. Render and measure locally only, never commit the images, and
never key the name (docs/data-handling.md).
