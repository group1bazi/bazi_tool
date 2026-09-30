# Reverse-engineering workspace — percentages and 6 Aspects (WS3 + WS9)

Owner: **Hanzalah** (WS3) with **Kai Wen** (WS9) · Risks **R1** (percentages) and **R11** (6 Aspects) · Q1

Ray's reference software (Joey Yap's BaZi) prints, for each chart:

- **Ten Profiles %**, natal *and* annual (e.g. "Annual 2026"), with a main profile and a main structure;
- a **Five Structures** radar, natal and annual. The points are drawn, but no numbers are printed;
- a **6 Aspects** bar chart (Life Purpose, Financial, Relationship, Family, Wellness, Contribution), natal vs
  annual. No values are printed, only the change under each bar (e.g. "↓15%", "15%↑").

Nobody, including Ray, knows the formulas, and he called the percentages "the critical piece" (30 Sep). This
folder is where we find them. Only an *accepted* model moves into `packages/engine/src/profiles/`.

## 1. Capture the samples — all 30 arrived (1–10 on 30 Sep)

The PDFs have **no text layer**, so every value has to be keyed in. See spike S8 for machine-measuring the bars.

1. Copy `samples.template.csv` to `data/samples.csv`. The `data/` folder is **git-ignored**: the file lives
   only on your machine and in the restricted team drive (see `docs/data-handling.md`).
2. One row per sample PDF (`sample_id` = the PDF number). The template captures **everything printed on the
   chart**: pillars, 空亡, the 8 personal details, Gua and Life Star, the first luck pillar and its printed age,
   natal and annual profiles, and the 6 Aspects deltas. That way every workstream can score itself against the
   same 30 charts, not just WS3.
3. **Never key the client's name.** The PDFs show one, and the template has no column for it.
4. Two people per row: `keyed_by` types it, `checked_by` re-reads it against the PDF. A typo here would send
   the model fitting after a pattern that does not exist. Split the 30 across 4–5 people (target Fri 9 Oct).

Then `npx vitest run packages/engine/test/samples.test.ts` prints a pass/fail/pending table per module. Those
numbers go in every CD report.

## 2. Method for the Ten Profiles % (proposal §6.2, report §7.4)

1. **Constraints we already have:**
   - The strongest Ten God is exactly 100, in both the natal and annual sets.
   - Gods absent from the natal chart score 0 natal (Example A, V-20; also seen on the samples).
   - Direct Officer scores 75 on Example A although 辛 is only residual qi in 丑; Friend scores 20 although the
     only 甲 is the Day Master. So the model is weighted, normalised to the maximum, and position, qi level and
     season matter.
   - **Annual lead:** a god absent from the natal *and* the annual pillar can still score above 0 in the annual
     set when it sits in the **current luck pillar**. Test annual = natal + current luck pillar + annual pillar.
2. **Features per sample:** Ten God at each stem and hidden-stem position; qi level (main / middle / residual);
   the month branch (season); Day Master self-contribution; relationships present.
3. **Hypothesis family:** `score(god) = Σ position_weight × qi_weight × season_factor`, normalised to
   max = 100 and rounded. Try equal qi weights, fixed ratios, and the traditional 人元司令 day-count weights.
4. **Fit** with non-negative least squares plus a grid search over the discrete choices. Judge by **exact
   agreement after rounding**, with leave-one-out, so a model is always tested on a sample it was not fitted on.
5. **Designed samples** (S6): the same date at all 12 hours; either side of a solar term; one god only as
   residual qi; the same person in two annual years.
6. **Decision point:** if exact agreement is not reached by CD4, agree with Ray whether the best model, with its
   measured error, is acceptable.

## 3. Method for the 6 Aspects (new, RC-06)

1. The printed **deltas** (annual − natal, in 5% steps) are exact. Use them as the check.
2. Measure the bar heights (S8) to get approximate natal and annual values.
3. Hypothesis: each aspect is a weighted mix of the Ten Profiles or the Five Structures, rounded to 5%. Fit the
   weights on the 30 samples and test with leave-one-out.
4. Ask Ray at CD2 what each aspect means in a reading. Domain knowledge narrows the search.

Put fitting scripts or notebooks in this folder (Python is fine here — it never ships). Record each model you
try, and its match rate, in `models.md`, so the CD reports can show the progression.

## 4. Integrity and copyright (R10)

The sample charts carry a Joey Yap notice claiming the charts, designs and **terminology**. Present the result
as **our own model that reproduces the reference outputs**. Never copy the software's descriptive text, profile
names (e.g. its named archetypes), layout or branding into the product.
