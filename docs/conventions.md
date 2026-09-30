# Conventions — the points on which Bazi schools differ

Every one of these is a field in `Settings`, with its default in `packages/engine/src/settings.ts`.
**Change the default there, and record the source here.** Never hard-code a convention inside a module.

**The reference is Joey Yap's BaZi software** (Ray's note in `Determining_Hour Pillar.docx`; the sample
chart footers). "Correct" means matching its output.

**Evidence base:** Ray's 30 sample charts, keyed on 30 Sep into `Sample_Register` → `Sample_Values` (restricted
drive) and `research/profiles/data/samples.csv` (git-ignored). "30/30" below means every sample agrees. Sample IDs
are `S-001` … `S-030` (= `Bazi_sample1.pdf` … `Bazi_sample30.pdf`). Never copy their birth data into tests or
fixtures: use synthetic dates that exercise the same rule.

| Setting | Options | Default | Status | Source / evidence |
|---|---|---|---|---|
| `lateZiHour` | `'split'` · `'next-day'` | `'split'` | ✅ **Confirmed** (Q3 closed 30 Sep) | Ray's hour doc: 3 Feb 1978 23:59 → 丁巳 癸丑 **丙申 庚子**. The day pillar stays on the date; the hour stem comes from the next day (丁 → 庚子). This is lunar-javascript `setSect(2)`, which is also the library's default. `setSect(1)` gives 丁酉 for the day, which is wrong for Ray. **Samples:** all 30 match sect 2, including 5 late-子 births (23:56–23:59) and 3 early-子 births (00:02–00:32). |
| `historicalUtcOffset` | `'ignore'` · `'apply'` | `'ignore'` | ✅ **Evidence-based** | The reference plotter never asks for a birthplace (CD1), so it can't apply one. On the 1978 chart, converting Singapore's +07:30 to +08:00 would make the day 丁酉, but the chart shows 丙申. An explicit `BirthInput.utcOffset` still wins. **Samples:** all 30 match with no offset. 17 were born before 1982, and on four of them (S-007, S-015, S-019, S-030) the +30 min shift would change the hour or day pillar. |
| `timeBasis` | `'clock'` · `'true-solar'` | `'clock'` | ❓ **TBC** — Q14 | His hour table is headed "Local/solar time\*". The 1978 example can't tell the two apart. The samples fit `'clock'`: the five births at 23:56–23:59 all get the 子 hour, which true solar time for Malaysia or Singapore (over an hour behind the clock) would turn into 亥. The plotter also takes no birthplace. |
| `hiddenStemDisplay` | `'canonical'` · `'residual-main-middle'` | `'residual-main-middle'` | ✅ **Seen on every reference chart** | Main qi centred: 丑 辛**己**癸, 申 戊**庚**壬 (1978 chart, samples, Example A). Two-stem branches: main, middle (亥 壬甲, 午 丁己). The same order appears on every sample chart. |
| `luckStartMethod` | `'calendar-days'` · `'days-div-3'` · `'minutes'` | `'calendar-days'` | ✅ **Found on the samples** (30/30) | The reference counts **whole calendar days** from the birth date to the date of the 节: forward, the first 节 dated *after* the birth date; backward, the last 节 dated *on or before* it. So a birth on a 节's date counts as after that 节, whatever the time, even though the month pillar still uses the exact instant. It prints `round(days ÷ 3)` as the first age. lunar-javascript's own start age (exact time) disagrees on 16 of the 30, by up to 10 years when the birth is on a 节 date (S-001, S-014, S-022, S-028). Ray still wants the method explained (RC-09): `docs/luck-pillars-for-ray.md`. |
| `ageReckoning` | `'real'` · `'nominal'` | `'nominal'` | ✅ **Evidence-based** | The pillar marked "Here" for 2026 is always the one whose printed age ≤ 2026 − birth year + 1 (30/30). Four samples tell nominal from real age (S-002, S-005, S-013, S-016). So the printed ages are nominal (虚岁): a pillar printed at age A starts in the year birth year + A − 1. |
| `monthStripSpan` | `'bazi-year'` · `'calendar-year'` | `'bazi-year'` | ❓ Ask Ray which he wants | Joey Yap samples: "FEB 4 … JAN 5 (2027)". Ray's deck slide: "JAN 5 … DEC 7". Both are drawn right → left. |

## Confirmed rules (not settings)

| Rule | Source |
|---|---|
| Year changes at 立春 Li Chun, not 1 January | Client doc §7 step 2; 2026 strip (Jan = 己丑, V-F3); the 1978 chart (3 Feb, before Li Chun → 丁巳); samples 30/30 |
| Month branch changes at the 12 节 (jie) solar terms, at the exact instant | Client doc §6; samples 30/30, incl. four born on a 节's date (S-001, S-014, S-022, S-028 before the instant; S-021 after) |
| Month stem by Five Tigers (五虎遁); hour stem by Five Rats (五鼠遁), including Ray's full table | Client doc §6–§7; `Determining_Hour Pillar.docx` |
| Hour branches: 23:00–00:59 子, 01:00–02:59 丑, … 21:00–22:59 亥 | `Determining_Hour Pillar.docx` |
| Hidden-stem table (canonical: main, middle, residual) | Client doc §4 |
| 空亡 = the two branches missing from the day pillar's 旬; marked on natal, luck and monthly branches | `Determining_DE.docx`; 1978 chart (丙申 → 辰巳, 巳 marked); samples 30/30 |
| 十二长生 life stages on the month strip; **yin stems run backward** (辛: 长生 at 子) | Reference month strip |
| Solar-term instants on the UTC+8 clock | lunar-javascript; cross-check in S2 |
| **Luck direction:** yang-year male and yin-year female run forward, the others backward; the 9 pillars step from the month pillar | Samples 30/30 |
| **Noble People 貴人 and Intelligence 文昌** come from the day stem | Samples 30/30; Example A |
| **Peach Blossom 桃花 and Sky Horse 驛馬** come from the **day** branch's three-harmony frame: 申子辰 → 酉 / 寅, 寅午戌 → 卯 / 申, 巳酉丑 → 午 / 亥, 亥卯未 → 子 / 巳 | Samples 30/30; the year branch would differ on 21 of them |
| **Solitary 孤辰** comes from the **day** branch: 亥子丑 → 寅, 寅卯辰 → 巳, 巳午未 → 申, 申酉戌 → 亥 | Samples 30/30 (the year branch would differ on 23); Example A |
| **Conception Palace 胎元** = month stem + 1, month branch + 3 | Samples 30/30; Example A (庚申 → 辛亥) |
| **Life Palace 命宮 stem** by Five Tigers from the year stem (the branch is still a lead, below) | Samples 30/30; Example A |
| **Life Gua year changes on a fixed 4 Feb**, not at the 立春 instant or date. Then the usual formula: before 2000, men 10 − r, women r + 5; from 2000, men 9 − r, women r + 6 (r = digit sum of the last two digits, reduced to one digit) | Samples 30/30. S-009 decides it: born 4 Feb 1968, before that year's 立春 (5 Feb), and the Gua uses 1968. Born 3 Feb or earlier → previous year (S-002, S-013, S-019, S-024) |
| **Life Star = the Gua number**, except that a 5 keeps **Life Star 5 (五黃, Earth)** while the trigram becomes 坤 (men) or 艮 (women) | Samples 30/30; the 5 cases are S-009, S-012, S-013, S-020, S-022, S-024, S-029 |
| The printed **main structure** is the Five Structures value that is highest in the natal chart | Samples 30/30 (radar measured) |

## Leads to test

These come from the reference charts and are recorded in the module headers. None is a rule yet.

| Lead | Owner |
|---|---|
| **Life Palace 命宮 branch.** All 30 samples fit `branch = (17 − month − hour) mod 12`, where `month` is the 节-month branch index and `hour` is the hour-branch index (子 = 0). That is one palace after the "sun palace + hour" formula `(16 − month − hour) mod 12`. But Example A on Ray's deck (己未) fits the old formula, and no sample does. The deck chart may come from a different build: it prints 三碧**星名** where the samples print 星**命**, and it has no URL in the header. **Ask Ray** which version he uses; until then, follow the samples. The traditional 中氣 sun-palace method fits only 11 of the 31 charts. | WS6 |
| **Main profile** follows the traditional 格局 rule. When a hidden stem of the month branch also appears among the year, month or hour stems (透干), its Ten God is the main profile, with the main qi first (14 samples). Otherwise it is the highest natal profile. This fits all 30. S-011 and S-019 are the cases where it is *not* the highest natal profile. One tie (S-010: IW and DW both 98, IW printed) is still unexplained. | WS3 |
| **Annual percentages** include the current luck pillar. Five gods that are absent from the natal chart and the 2026 pillar still score > 0, and all five are in the current luck pillar. Two exceptions need another source: S-011 7K = 2, S-022 IR = 30. | WS3 |

## Sub-questions found while scaffolding

- **A 2-hour slot and the late 子 hour:** a 子-slot birth on date D could be 00:xx or 23:xx that day. The day
  pillar is D either way, but under `'split'` the hour stem differs (D's stem vs D+1's). The engine should
  warn (`HOUR_SLOT_ONLY`), and Ray should say which he means when he picks the 23:00–00:59 slot.
