# Requirements Change Log

The CD2–5 brief says "requirements may evolve between Customer Days; document changes clearly". Every change
to the CD1 requirements (CD1 report §5) goes here, with its written source, and is carried into the next CD
report. **Baseline:** CD1 report v1.0, 25 Sep 2026.

| ID | Date | Change | Type | Source | Impact | Status |
|---|---|---|---|---|---|---|
| RC-01 | 30 Sep 2026 | **Life Gua / Life Star, the eight direction sectors (4 favourable, 4 unfavourable) and the full Personal Chart Details** move from optional (CD1 §5.2 #13–14) to **requested**. The Personal Chart Details are the 8 items on his chart: Celestial Animal, Noble People, Intelligence, Peach Blossom, Sky Horse, **Solitary, Life Palace, Conception Palace**. | Scope added | Ray's reply, 30 Sep (`CD1_followup2_2026-09-30/README.md` §6) | WS6: `lifeGua()` + 3 new lookups; ChartResult `gua`, `supporting.*`; UI Gua panel | Accepted — in CD2 plan |
| RC-02 | 30 Sep 2026 | **"6 Aspects" chart** (Life Purpose, Financial, Relationship, Family, Wellness, Contribution), **natal and annual**, is **requested**. Ray doesn't know how it is computed. | Scope added | Ray's reply, 30 Sep (§4) | A second reverse-engineering problem next to R1 → risk **R11**. WS3 + WS9; ChartResult `aspects` | Accepted — research; target stated at CD2 |
| RC-03 | 30 Sep 2026 | The Five Structures / Ten Profiles percentages exist in **natal and annual** versions, and must both be reproduced. | Clarified | Ray's reply, 30 Sep (§5); sample charts | WS3 fits two models (the annual one appears to include the current luck pillar) | Accepted |
| RC-04 | 30 Sep 2026 | Batch input template gains **Gender (M/F)** and an **estimated 2-hour slot** column. Birth hour stays optional; both blank = hour unknown. | Clarified (answers Q6, Q7 input side) | Ray's reply, 30 Sep (§1); team draft `Clients_particulars_v2.xlsx` | WS8 parser (template v2); **send v2 back to Ray to confirm the slot format** | Draft template ready — awaiting Ray |
| RC-05 | 30 Sep 2026 | **Luck-pillar method is ours to define.** Ray doesn't know how his plotter computes direction, start age and the cycles, and asked us to explain it. The annual pillar is also required. | Responsibility moved to the team | Ray's reply, 30 Sep (§3) | WS4 chooses the rule, validates it on the 30 samples, writes `docs/luck-pillars-for-ray.md` for CD2 | Accepted |
| RC-06 | 30 Sep 2026 | **Late 子 hour (23:00–23:59):** the day pillar stays on the calendar date; the hour stem uses the next day's stem. | Convention confirmed (closes Q3) | `Determining_Hour Pillar.docx` | WS1 `lateZiHour: 'split'` (lunar-javascript sect 2) | Closed |
| RC-07 | 30 Sep 2026 | The reference plotter is **Joey Yap's BaZi software**; its conventions are the ones we match. | Context | Ray's note in `Determining_Hour Pillar.docx`; sample chart footers | Match its layouts' *content*, never its branded terminology or design (risk **R10**) | Noted |

## Still unconfirmed (not yet changes)

- Q14 clock vs true solar time — his hour table is headed "Local/solar time\*" and the 1978 example can't tell them apart.
- Month strip span: the Joey Yap samples run Feb → Jan (Bazi year); Ray's deck slide ran Jan → Dec. Default: Bazi year.
- The **Annual Bazi Stars** and **Qi Men** panels on the sample charts. Qi Men was excluded at CD1. The annual stars have not been discussed — ask at CD2 before building anything.
