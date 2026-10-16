# Ten Profiles %, 2026 % and 6 Aspects — models and match rates (WS3)

**Status: model v2, 16 Oct 2026 (Hanzalah, WS3).** Data: the 30 keyed samples in `data/samples.csv`
(git-ignored; keyed 30 Sep; **second-person check against the PDFs done 16 Oct: 1,320 values, no errors**). Only aggregate results are recorded here, per
[`docs/data-handling.md`](../../docs/data-handling.md). Re-run every script after any change to the samples:

```
cd research/profiles/scripts
python model_v2.py ../data/samples.csv     # natal Ten Profiles % (current)
python model_v1.py ../data/samples.csv     # natal, previous model
python annual_v0.py ../data/samples.csv    # 2026 Ten Profiles %
python aspects_v0.py ../data/samples.csv   # 6 Aspects findings
python check_samples.py ../data/samples.csv  # rule checks (pillars, voids, luck, Gua)
```

Needs Python 3 and numpy only. Shared helpers are in `scripts/ws3_lib.py`.

## Progress at a glance

| Model | Date | Mean abs error | Within ±10 | Strongest profile | Rank order (Spearman) |
|---|---|---|---|---|---|
| Predict the average | — | 28.0 | — | — | — |
| v0 · weighted Ten God count (linear) | 15 Oct | 10.7 | 60% | 16/30 | 0.77 |
| v1 · position × season, saturating | 16 Oct | 3.3 | 94% | 26/30 | 0.97 |
| **v2 · season base + points, rooting, frames (linear)** | **16 Oct** | **1.0** | **99%** | **27/30** | **0.98** |

All numbers are leave-one-sample-out: each chart is predicted by a model fitted on the other 29.

## What the data tells us (natal)

| Finding | Evidence | Use |
|---|---|---|
| **A profile is 0% exactly when its Ten God is absent** from the chart (visible stems, all hidden stems, the Day Master counting as Friend) | 300/300 values. (The "8 exceptions" in v0 were a feature bug in `model_v0.py`, not the data.) | Hard rule |
| **A Ten God that appears once has a fixed %**, set only by *where* it sits and *how strong its element is in the birth season* (旺相休囚死) | **106 of 107** single-source values equal the table below. The one miss: a 子 month branch scores 88, not 83 | Exact rule for single-source gods |
| The season of a month is its three-month block: 寅卯辰 wood, 巳午未 fire, 申酉戌 metal, 亥子丑 water | The earth months are *not* treated as earth (e.g. 己 in a 丑 month is 囚, 50) | Part of the rule |
| Several appearances **add up linearly** from a season start value, plus a rooting bonus (model v2) | e.g. 囚: start 20, stem +9, main hidden +22 → 29, 38, 64 as printed; v2 MAE 1.0 | Use v2 |
| The month branch counts more than other branches for the weaker seasons | 囚: 50 in the month vs 42 elsewhere (main qi); 45 vs 29 (other qi) | Classical "month commander" idea |
| Values are **not normalised to the top profile** | Several charts have no 100 | Answers Q9 |
| Main profile = highest natal profile on 26/30; the 透干 rule (README §2) fits 30/30 | `check_samples.py` | Use 透干 for the main profile |

### The single-source table (% when a Ten God appears exactly once)

| Where the stem sits | 死 dead | 囚 trapped | 休 resting | 相 growing | 旺 prosperous |
|---|---|---|---|---|---|
| Visible stem (year, month, hour) or the Day Master | 20 | 29 | 42 | 48 | 76 |
| Main hidden stem of the year, day or hour branch | 27 | 42 | 52 | 55 | 88 |
| Middle or residual hidden stem of the year, day or hour branch | 17 | 29 | 41 | 45 | 75 |
| Main hidden stem of the month branch | (not seen) | 50 | (not seen) | 68 | 83 (88 for 子) |
| Middle or residual hidden stem of the month branch | (not seen) | 45 | 55 | 60 | 75 |

Season state of a stem's element in the month's season S: same element = 旺; produced by S = 相; produces S = 休;
controls S = 囚; controlled by S = 死.

## Model v2 — season base + points, rooting, frames (16 Oct)

The pairs of appearances showed the rule is **linear**, not a saturating curve: a profile's % is a **starting value
set by the season state** plus **fixed points for every appearance**. For example, in the 囚 state the start is 20,
a visible stem adds 9 and a main hidden stem adds 22, so one stem prints 29, two stems 38, and two main hidden stems
64, which is exactly what the charts print. Three refinements from classical practice (published strength-scoring
methods weight 通根 rooting, the month commander and 三合 frames) each improve the fit:

- **Rooting (通根):** a visible stem whose same stem also sits hidden in a branch gets a bonus (about +4 to +9).
- **The Day Master rooted in the month branch adds no stem points** (it is already counted by the month branch).
- **Full three-harmony frame (三合, e.g. 申子辰 water):** the frame's element gets about +23. Seen on one chart
  only (two gods), so this number needs the designed samples. Half frames and arches were tested: no effect.

`% = BASE[state] + Σ POINTS[position][state] + ROOT[state] × rooted stems + FRAME`, capped at 100; absent → 0.
40 numbers, fitted by least absolute error (`scripts/model_v2.py`).

| Measure (300 values, leave-one-out) | v2 | v1 |
|---|---|---|
| Mean absolute error | **1.0 point** | 3.3 |
| Within ±2 / ±5 / ±10 points | **89% / 93% / 99%** | — / 76% / 94% |
| Exact | **239** (77 zeros + 162) | 99 |
| Strongest profile correct | **27/30** | 26/30 |
| Rank order (mean Spearman per chart) | **0.98** | 0.97 |

**Example A** (Ray's own deck, not one of the 30 samples, so a true out-of-sample test): v2 predicts F 20, RW 40,
DW 52, DO 75, DR 87, EG 0, HO 0 exactly, IR 83 (printed 82), IW 91 (94) and 7K 94 (100). Mean error 1.0.

Fitted points (all 30 charts):

| | 死 | 囚 | 休 | 相 | 旺 |
|---|---|---|---|---|---|
| Start (BASE) | 5 | 20 | 32 | 40 | 74 |
| Visible stem | 15 | 9 | 10 | 8 | 2 |
| Rooting bonus per rooted stem | 8 | 4 | 6 | 7 | 9 |
| Main hidden stem, year/day/hour branch | 22 | 22 | 20 | 15 | 13 |
| Other hidden stem, year/day/hour branch | 12 | 9 | 9 | 5 | 1 |
| Main hidden stem, month branch | 43 (1 case) | 30 | 28 | 28 | 9 |
| Other hidden stem, month branch | 24 | 25 | 23 | 20 | 5 |

Remaining misses: one 死-state month main stem seen once (IW of one chart: 29 predicted, 72 printed), the
full frame (cannot be learnt leave-one-out from one chart), and a few Friend values. The designed samples (S6) are
built to settle exactly these.

## Model v1 — position × season, saturating (16 Oct)

Each appearance of a Ten God adds `points[position class][season state]` (5 × 5 = 25 non-negative weights);
`% = 100 × (1 − e^(−Σ points))`; absent → 0. Fitted by damped least squares (`ws3_lib.fit_saturating`).

| Measure (300 values = 30 charts × 10 profiles) | v1 | v0 |
|---|---|---|
| Mean absolute error | **3.3 points** | 10.7 |
| Within ±5 / ±10 points | **76% / 94%** | — / 60% |
| Exact | 99 (77 zeros + 22) | 85 (77 zeros + 8) |
| Single-source / multi-source error | 3.9 / 5.0 | — |
| Strongest profile correct | **26/30** | 16/30 |
| Rank order of the 10 profiles (mean Spearman per chart) | **0.97** | 0.77 |

**Reading:** the two ingredients are *position* and *season*. That is enough for 94% of values to land within
10 points. Exactness now depends on one thing: **how several appearances combine**. Fixed rules tried and
rejected: plain sum (MAE 17), probabilistic OR (7.4), max + share of the rest (7.1). Next leads: rooting
(a visible stem standing on its own element), the exact 子/午/卯/酉 month weights, and integer points with a
lookup table.

## 2026 % — annual v0 (16 Oct)

Same features, plus the **current luck pillar** and the **2026 pillar 丙午**, each with their own weights.

| Measure | Annual v0 | Baseline: 2026 % = natal % |
|---|---|---|
| Mean absolute error (leave-one-out) | **12.6** | 14.3 |
| Within ±10 | 54% | — |

Only a small gain, and the data says why: **12 Ten Gods are present in the natal, luck or 2026 pillars but
score 0 in 2026, and 11 of the 12 are caught in a combination or clash with the luck or 2026 pillar**
(examined by hand): stem combinations 丙辛 and 乙庚, the stem clash 丙壬, the branch combination 辰酉, and the
full frames 申子辰 and 寅午戌. The twelfth (a 庚 year stem facing two 丙) is unexplained. Removing every combined source blindly makes the fit worse, so the
rule is narrower than "any combination". This is the v1 work for CD3, together with WS5 (clash/harmony),
whose relation tables it will reuse. Two gods score > 0 with no source at all (S-011 7K = 2, S-022 IR = 30).

## 6 Aspects — first findings (16 Oct)

| Finding | Evidence |
|---|---|
| The printed change is exactly 2026 bar − natal bar | 180/180 |
| Natal bars are multiples of 5 from 35 to 85; 2026 bars from 15 to 100 | All 360 values |
| **Natal Financial is fixed by the month branch alone**: 85 in every month except the four earth months (辰 50, 丑 60, 戌 60, 未 75) | 28/28 charts that share a month branch agree |
| Two charts identical except the hour pillar differ **only in Contribution** | 1 pair; Contribution reads the hour pillar |
| The aspects are **not** a linear mix of the Ten Profiles or the Five Structures | Leave-one-out MAE 15.2 / 12.6, worse than or equal to predicting the average (11.8) |

**Reading:** the aspects look like **palace rules** (which pillar, which branch), not a blend of the
percentages. Next: test each aspect against its palace (year = family, month = career/financial, day =
relationship, hour = contribution), the palace's season state and its clashes/combinations; ask Ray at CD2
what each aspect means in a reading (question ★1).

## Next steps

1. ~~Two-person check of all 30 rows~~ done 16 Oct, no errors. WS9 can port the zero rule and the v2 points table
   to `samples.test.ts` now.
2. Natal v3: pin the frame bonus, the month-branch weights for pure-qi months (子卯午酉) and the Friend profile with
   the designed samples; try integer points.
3. Annual v1: add combinations and clashes with the luck and 2026 pillars, shared with WS5.
4. 6 Aspects v1: palace rules, starting from Financial = f(month branch).
5. Send Ray the designed-sample request (S6) — draft in `designed-sample-request.md`. The most useful set:
   one birth date at all 12 hours (isolates the hour pillar and Contribution).
6. Decision point at CD4 (R1, R11): if not exact, agree with Ray whether the best model and its measured
   error is acceptable.

## History

- **16 Oct — v1** (position × season, saturating): MAE 3.3, 94% within ±10, strongest profile 26/30.
  Script kept as `scripts/model_v1.py`.
- **15 Oct — v0** (weighted Ten God count, linear): MAE 10.7, 60% within ±10, strongest profile 16/30.
  Script kept as `scripts/model_v0.py` for the record.
