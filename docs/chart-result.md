# ChartResult v1 — the shared data format

**Status: DRAFT for spike S1, to be frozen Fri 2 Oct by WS1 (owner), WS7 and WS8. WS10 reviews it.**
Source of truth: [`packages/engine/src/types.ts`](../packages/engine/src/types.ts). A complete worked
example: [`packages/engine/fixtures/example-a.chart.ts`](../packages/engine/fixtures/example-a.chart.ts).

## Why it matters

The web app, the Drive automation and the tests all consume this one object. Once v1 is frozen, WS7 and
WS8 build against `EXAMPLE_A_CHART` while the engine is still being written, and nothing has to change
when the real engine arrives.

## Shape

| Field | Type | Notes |
|---|---|---|
| `schemaVersion` | `1` | Bump when an existing field changes meaning |
| `input` | `BirthInput` | `date` 'YYYY-MM-DD'; `time` exact / 2-hour slot / unknown; `gender` M / F / null; optional `utcOffset` |
| `settings` | `Settings` | The conventions used for this chart (see `conventions.md`) |
| `pillars.year/month/day` | `Pillar` | `stem`, `branch`, `stemGod` (null on the day pillar), `hidden[]`, `void` |
| `pillars.hour` | `Pillar \| null` | null when the hour is unknown |
| `dayMaster` | `Stem` | = `pillars.day.stem` |
| `voids` | `[Branch, Branch]` | 空亡 pair from the day pillar's 旬 |
| `luck` | `LuckCycle \| null` | `direction`, `start {years, months, days}`, `pillars[]` with `startAge` + `startYear`; null without gender |
| `annual` | `AnnualPillar` | Pillar + `year` |
| `monthly` | `MonthPillar[12]` | Pillar + Gregorian `month` + `starts` (ISO instant of the 节) + `lifeStage` (十二长生 of the Day Master). Span per `settings.monthStripSpan` — default Feb → Jan (Bazi year) |
| `supporting` | `SupportingDetails` | The 8 Personal Chart Details: Celestial Animal, Noble People[], Intelligence, Peach Blossom, Sky Horse, Solitary, Life Palace (pillar), Conception Palace (pillar) |
| `gua` | `LifeGua \| null` | `number`, `trigram`, `group` (east/west), `lifeStar`, `directions` (8 sectors); null without gender. **Added 30 Sep (RC-05)** |
| `relationships` | `Relationship[]` | `kind`, `between` (positions, incl. `luck` / `annual`), `chars`, optional `resultElement` |
| `profiles` | `Profiles \| null` | `natal` + `annual` sets; null until the WS3 model is accepted; carries a `model` id |
| `aspects` | `SixAspects \| null` | "6 Aspects", `natal` + `annual`; null until a model is found. **Added 30 Sep (RC-06)** |
| `warnings` | `ChartWarning[]` | `code` + message (+ `minutes` for near-boundary codes) |

## Design rules

1. **Characters are identifiers.** `'甲'`, `'子'` — never translated text. Labels (EN / 中文 / Pinyin)
   come from `core/terms.ts` and the `*_INFO` tables at display time.
2. **Hidden stems are stored in canonical order** (main, middle, residual), each with its `qi` and `god`.
   Ray's display order is a UI choice via `orderForDisplay()` and `settings.hiddenStemDisplay`.
3. **Every pillar has the same shape**, whether natal, luck, annual or monthly, so one UI component draws them all.
4. **Warnings are part of the result.** A chart near a boundary, or without an hour or gender, says so.
   Batch mode puts the warnings in Ray's summary email.
5. **No personal data beyond the birth details.** Names stay in the batch layer (`ClientRow`), never in the chart.

## Changing it

After the freeze, a change needs a PR approved by the WS1, WS7 and WS8 owners, plus an update to this file
and to `EXAMPLE_A_CHART`. If an existing field changes meaning, bump `schemaVersion`.

## Open points for the S1 meeting

- `relationships[].between: 'luck'` means the luck pillar in force in `annualYear`. Is that enough for the
  summary view, or does WS5/WS7 want every luck pillar checked?
- `luck.pillars[].startAge` follows `settings.ageReckoning`, now `'nominal'` by default: the 30 samples show
  the reference prints nominal (虚岁) ages (`docs/conventions.md`). A pillar printed at age A starts in
  `startYear` = birth year + A − 1.
- `profiles.annual` / `aspects.annual`: the samples show an annual version of both (e.g. "Annual 2026"), so
  `annualYear` drives them as well as the annual pillar and the month strip.
- The reference also shows **Annual Bazi Stars** and **Qi Men** panels. They are deliberately **not** in v1:
  Qi Men was excluded at CD1, and the annual stars haven't been discussed (CD2 question).

## Changes since the first draft (30 Sep, after Ray's second reply)

- `Settings.dayBoundary` replaced by **`lateZiHour`** (`'split'` confirmed), plus **`historicalUtcOffset`** and
  **`monthStripSpan`**.
- `SupportingDetails` gained `solitary`, `lifePalace`, `conceptionPalace`; `MonthPillar` gained `lifeStage`.
- New top-level `gua` and `aspects`.
