# Ten Profiles % — models and match rates (WS3)

**Status: first pass, 15 Oct 2026 (Hanzalah, WS3).** Data: the 30 keyed samples in `data/samples.csv`
(git-ignored; keyed 30 Sep, **not yet human-checked**). Only aggregate results are recorded here, per
[`docs/data-handling.md`](../../docs/data-handling.md). Re-run after the two-person check.

## What the data already tells us

| Finding | Evidence | Use |
|---|---|---|
| **A profile is 0% exactly when that Ten God is absent** from the chart (no visible stem, no hidden stem) | All 77 of 77 zero values are absent Ten Gods; only 8 absent Ten Gods score above 0 | Hard rule in the model; the 8 exceptions are the first thing to explain (combinations? keying?) |
| The **month branch counts about twice** as much as other branches | Fitted weights: month hidden main qi ≈ 49 vs ≈ 27 elsewhere; month hidden others ≈ 39 vs ≈ 17 | Matches the classical "month commander" idea — a talking point for Ray |
| Values are **not normalised to the top profile** | Several charts have no 100 (e.g. a top value of 88) | Answers our Q9 hypothesis: it is not "relative to the strongest" |
| Main profile = highest natal profile | 26/30; two of the four exceptions are ties (98/98, 95/95); **samples 11 and 19 need re-reading** | Check those two rows first in the human check |

## Model v0 — weighted Ten God count (linear)

Each Ten God scores `Σ weight × occurrences` over: visible stems (month vs other), hidden main qi (month vs
other), other hidden stems (month vs other), then clipped to 0–100; absent Ten Gods → 0.
Validated **leave-one-sample-out** (each chart predicted by a model fitted on the other 29).

| Measure (300 values = 30 charts × 10 profiles) | Model v0 | Baseline (predict the mean) |
|---|---|---|
| Mean absolute error | **10.7 points** | 28.0 |
| Within ±10 points | **60%** | — |
| Exact | 85 / 300 (77 of them are the zeros) | — |
| Rank order of the 10 profiles (mean Spearman ρ per chart) | **0.77** | — |
| Main (highest) profile correct | **16 / 30** | — |

**Reading:** the counting idea is right in direction — it ranks the profiles well and gets every zero — but it is
not the algorithm. Exactness will need the seasonal strength of each element (旺相休囚死), stem/branch
combinations, and possibly rooting. That is the plan for v1 (CD3), with a decision point at CD4 (R1, R11).

## Next steps

1. Two-person check of all 30 rows; re-run `python scripts/check_samples.py data/samples.csv` and `python scripts/model_v0.py data/samples.csv` (needs numpy). WS9 can port both to `samples.test.ts`.
2. Explain the 8 absent-but-nonzero cases (combinations are the lead).
3. Add seasonal strength by month branch; compare MAE and exact rate.
4. Annual % = natal chart + current luck pillar + 2026 pillar, same model.
5. Send Ray the designed-sample request (S6): same date × 12 hours, same day pillar × 12 months.
