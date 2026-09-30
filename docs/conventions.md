# Conventions — the points on which Bazi schools differ

Every one of these is a field in `Settings`, with its default in `packages/engine/src/settings.ts`.
**Change the default there, and record the source here.** Never hard-code a convention inside a module.

**The reference is Joey Yap's BaZi software** (Ray's note in `Determining_Hour Pillar.docx`; the sample
chart footers). "Correct" means matching its output.

| Setting | Options | Default | Status | Source / evidence |
|---|---|---|---|---|
| `lateZiHour` | `'split'` · `'next-day'` | `'split'` | ✅ **Confirmed** (Q3 closed 30 Sep) | Ray's hour doc: 3 Feb 1978 23:59 → 丁巳 癸丑 **丙申 庚子**. The day pillar stays on the date; the hour stem comes from the next day (丁 → 庚子). This is lunar-javascript `setSect(2)`, which is also the library's default. `setSect(1)` gives 丁酉 for the day, which is wrong for Ray. |
| `historicalUtcOffset` | `'ignore'` · `'apply'` | `'ignore'` | ✅ **Evidence-based** | The reference plotter never asks for a birthplace (CD1), so it can't apply one. On the 1978 chart, converting Singapore's +07:30 to +08:00 would make the day 丁酉, but the chart shows 丙申. An explicit `BirthInput.utcOffset` still wins. |
| `timeBasis` | `'clock'` · `'true-solar'` | `'clock'` | ❓ **TBC** — Q14 | His hour table is headed "Local/solar time\*". The 1978 example can't tell the two apart. |
| `hiddenStemDisplay` | `'canonical'` · `'residual-main-middle'` | `'residual-main-middle'` | ✅ **Seen on every reference chart** | Main qi centred: 丑 辛**己**癸, 申 戊**庚**壬 (1978 chart, samples, Example A). Two-stem branches: main, middle (亥 壬甲, 午 丁己). |
| `luckStartMethod` | `'days-div-3'` · `'minutes'` | `'days-div-3'` | 🔧 **Ours to choose** (RC-09) | Ray doesn't know his plotter's rule. Choose one, prove it on the 30 samples, and explain it to him. |
| `ageReckoning` | `'real'` · `'nominal'` | `'real'` | ❓ TBC | Reference charts print ages like 8, 18, 28… and 10, 20, 30…. lunar-javascript reports nominal (虚岁) ages. Key the printed first age of every sample (`luck_first_age`). |
| `monthStripSpan` | `'bazi-year'` · `'calendar-year'` | `'bazi-year'` | ❓ Ask Ray which he wants | Joey Yap samples: "FEB 4 … JAN 5 (2027)". Ray's deck slide: "JAN 5 … DEC 7". Both are drawn right → left. |

## Confirmed rules (not settings)

| Rule | Source |
|---|---|
| Year changes at 立春 Li Chun, not 1 January | Client doc §7 step 2; 2026 strip (Jan = 己丑, V-F3); the 1978 chart (3 Feb, before Li Chun → 丁巳) |
| Month branch changes at the 12 节 (jie) solar terms | Client doc §6 |
| Month stem by Five Tigers (五虎遁); hour stem by Five Rats (五鼠遁), including Ray's full table | Client doc §6–§7; `Determining_Hour Pillar.docx` |
| Hour branches: 23:00–00:59 子, 01:00–02:59 丑, … 21:00–22:59 亥 | `Determining_Hour Pillar.docx` |
| Hidden-stem table (canonical: main, middle, residual) | Client doc §4 |
| 空亡 = the two branches missing from the day pillar's 旬; marked on natal, luck and monthly branches | `Determining_DE.docx`; 1978 chart (丙申 → 辰巳, 巳 marked) |
| 十二长生 life stages on the month strip; **yin stems run backward** (辛: 长生 at 子) | Reference month strip |
| Solar-term instants on the UTC+8 clock | lunar-javascript; cross-check in S2 |

## Leads to test on the 30 samples

These come from the reference charts and are recorded in the module headers. None is a rule yet.

| Lead | Owner |
|---|---|
| **Solitary 孤辰 follows the day branch** (two charts agree; the year branch disagrees on one). Do Peach Blossom and Sky Horse follow the day branch too? | WS6 |
| **Life Palace 命宫**: the stem follows Five Tigers from the year stem. The "sun palace + hour" method fits Example A (己未) but misses at least one sample by one palace. | WS6 |
| **Gua year boundary**: on a sample born before Li Chun on 4 Feb, the Gua follows the new year while the pillars follow the old one. Is it a fixed 4 Feb, or the Gregorian year? | WS6 |
| **Life Star = the Gua number's nine-star name** (Gua 3 → 三碧 Jade, Gua 2 → 二黑 Black). What happens for Gua 5 (→ 2 / 8)? | WS6 |
| **First luck age**: on a sample born a few hours before a 节 on the same day, the reference starts luck at 10, while days ÷ 3 gives ~0. | WS4 |
| **Annual percentages** include the current luck pillar: a god absent from natal + annual still scores > 0 when it is in the luck pillar. | WS3 |

## Sub-questions found while scaffolding

- **A 2-hour slot and the late 子 hour:** a 子-slot birth on date D could be 00:xx or 23:xx that day. The day
  pillar is D either way, but under `'split'` the hour stem differs (D's stem vs D+1's). The engine should
  warn (`HOUR_SLOT_ONLY`), and Ray should say which he means when he picks the 23:00–00:59 slot.
