# Reverse-engineering workspace — percentages and 6 Aspects (WS3 + WS9)

Owner: **Hanzalah** (WS3) with **Kai Wen** (WS9) · Risks **R1** (percentages) and **R11** (6 Aspects) · Q1

Ray's reference software (Joey Yap's BaZi) prints, for each chart:

- **Ten Profiles %**, natal *and* annual (e.g. "Annual 2026"), with a main profile and a main structure;
- a **Five Structures** radar, natal and annual. The points are drawn, but no numbers are printed;
- a **6 Aspects** bar chart (Life Purpose, Financial, Relationship, Family, Wellness, Contribution), natal vs
  annual. No values are printed, only the change under each bar (e.g. "↓15%", "15%↑").

Nobody, including Ray, knows the formulas, and he called the percentages "the critical piece" (30 Sep). This
folder is where we find them. Only an *accepted* model moves into `packages/engine/src/profiles/`.

## 1. The samples — all 30 keyed (30 Sep)

The PDFs have **no text layer**. All 30 were keyed on 30 Sep (SCRUM-22):

- **Master copy:** `Sample_Register` in the restricted drive. The register tab tracks each PDF; the
  **`Sample_Values`** tab has one row per sample and a legend.
- **Local copy:** `data/samples.csv`, which is **git-ignored** (see `docs/data-handling.md`). Ask for it, or
  export `Sample_Values`. It has every column of `samples.template.csv`, plus `struct_*` (the radar), the hidden
  stems, where 空亡 is marked, all 9 luck pillars and the printed labels. The harness ignores extra columns.
- **Never key the client's name.** The PDFs show one, and neither table has a column for it.
- **Still to do:** `checked_by`. A teammate re-reads each row against its PDF. A typo here would send the model
  fitting after a pattern that does not exist.

How each value was captured (spike S8):

| Values | Method | Accuracy |
|---|---|---|
| Ten Profiles % (natal + annual) | Decoded from the digits printed on the chart (the PDFs draw them as vector shapes). All 600 also match the bar lengths | Exact |
| Five Structures (`struct_*`) | Radar points measured against the axis ticks | About ±2 |
| 6 Aspects bars | Bar heights measured, then snapped to 5. Every printed change equals annual − natal (180/180) | Exact after snapping |
| Everything else | Read off the chart, then cross-checked against lunar-javascript (sect 2, no offset) | 30/30 agree |

Then `npx vitest run packages/engine/test/samples.test.ts` prints a pass/fail/pending table per module. Those
numbers go in every CD report.

## 2. Method for the Ten Profiles % (proposal §6.2, report §7.4)

1. **What the 30 samples show** (natal and annual, 600 values):
   - **Presence decides zero.** A god scores > 0 natal exactly when it appears in the chart's stems or hidden
     stems, with the Day Master counting as Friend (300/300).
   - **Not normalised to the maximum.** The strongest god is below 100 on 19 of the 30 natal sets (as low as 80)
     and on 14 of the annual sets. The old assumption "strongest = exactly 100" came from Example A and is wrong.
     So something else fixes the scale. The printed values are rounded from a finer score: one annual bar is
     85.56 long but prints 85 (S-008).
   - Direct Officer scores 75 on Example A although 辛 is only residual qi in 丑; Friend scores 20 although the
     only 甲 is the Day Master. So the model is weighted, and position, qi level and season matter.
   - **Annual:** five gods that are absent from the natal chart and the 2026 pillar still score > 0, and all
     five are in the **current luck pillar**. Two exceptions need another source: S-011 7K = 2, S-022 IR = 30.
     Test annual = natal + current luck pillar + annual pillar.
   - **Main profile** follows the traditional 格局 rule. When a hidden stem of the month branch also appears
     among the year, month or hour stems (透干), its god is the main profile, with the main qi first. Otherwise
     it is the highest natal profile. This fits all 30. On S-011 and S-019 it is *not* the highest natal
     profile. One tie is unexplained: S-010, IW and DW both 98, IW printed.
   - **Main structure** is always the highest natal Five Structures value (30/30).
2. **Features per sample:** Ten God at each stem and hidden-stem position; qi level (main / middle / residual);
   the month branch (season); Day Master self-contribution; relationships present.
3. **Hypothesis family:** `score(god) = Σ position_weight × qi_weight × season_factor`, on a fixed scale (not
   divided by the chart's maximum), then rounded. Try equal qi weights, fixed ratios, and the traditional
   人元司令 day-count weights.
4. **Fit** with non-negative least squares plus a grid search over the discrete choices. Judge by **exact
   agreement after rounding**, with leave-one-out, so a model is always tested on a sample it was not fitted on.
5. **Five Structures:** each is two gods (self = F+RW, inspiration = EG+HO, action = DW+IW, discipline = DO+7K,
   knowledge = DR+IR). The radar values are not a simple sum or maximum of the two printed percentages. Fit them
   from the same features, and allow for the ±2 measurement error.
6. **Designed samples:** the same date at all 12 hours; either side of a solar term; one god only as residual
   qi; the same person in two annual years.
7. **Decision point:** if exact agreement is not reached by CD4, agree with Ray whether the best model, with its
   measured error, is acceptable.

## 3. Method for the 6 Aspects (new, RC-06)

1. The printed **deltas** (annual − natal, in 5% steps) are exact. Use them as the check.
2. The bar heights are keyed (`aspect_natal_*`, `aspect_annual_*`). Every value on the 30 samples is a multiple
   of 5 between 15 and 100.
3. Hypothesis: each aspect is a weighted mix of the Ten Profiles or the Five Structures, rounded to 5%. Fit the
   weights on the 30 samples and test with leave-one-out.
4. Ask Ray at CD2 what each aspect means in a reading. Domain knowledge narrows the search.

Put fitting scripts or notebooks in this folder (Python is fine here — it never ships). Record each model you
try, and its match rate, in `models.md`, so the CD reports can show the progression.

## 4. Integrity and copyright (R10)

The sample charts carry a Joey Yap notice claiming the charts, designs and **terminology**. Present the result
as **our own model that reproduces the reference outputs**. Never copy the software's descriptive text, profile
names (e.g. its named archetypes), layout or branding into the product.
