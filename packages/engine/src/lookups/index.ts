/**
 * WS6 — 空亡 (void) markers, Personal Chart Details, Life Gua, and edge cases.
 * Owner: Darrius · Backup: Isaac (CD1 report §8).
 *
 * Void rule: CONFIRMED by Ray on 26 Sep (Determining_DE.docx) — the day pillar's 旬 (10-pillar
 * group) uses only 10 of the 12 branches; the two missing ones are the chart's 空亡 pair.
 *
 * Personal Chart Details: eight lookups on the reference chart. CONFIRMED on the 30 samples
 * (docs/conventions.md):
 *  - Noble People 貴人 and Intelligence 文昌 from the DAY STEM.
 *  - Peach Blossom 桃花, Sky Horse 驛馬 and Solitary 孤辰 from the DAY BRANCH (not the year branch).
 *  - Conception Palace 胎元 = month stem + 1, month branch + 3 (庚申 → 辛亥 on Example A).
 *  - Life Palace 命宫: stem by Five Tigers from the year stem.
 * Still a lead — the Life Palace BRANCH: all 30 samples fit (17 − month − hour) mod 12 (节-month and
 * hour branch indices, 子 = 0), but Example A on Ray's deck (己未) fits (16 − month − hour) mod 12.
 * Ask Ray which build he uses; conventions.md has the details.
 *
 * Life Gua / Life Star / 8 directions: REQUESTED by Ray on 30 Sep (was optional; RC-05).
 * CONFIRMED on the 30 samples: the Gua year changes on a fixed 4 Feb (not at the Li Chun instant or
 * date). Life Star = the Gua number's nine-star name (Example A: Gua 3 震 → "3 Jade", Wood), except a
 * 5 keeps Life Star 5 (五黃) while the trigram becomes 坤 (men) or 艮 (women).
 *
 * Done when: every spec in test/lookups.test.ts runs and passes.
 * Milestone: void rule + Example A's personal details and Gua reproduced by 16 Oct.
 */
import type { Branch, GanZhi } from '../core';
import type { FourPillars } from '../calendar';
import { todo } from '../errors';
import type { BirthInput, ChartWarning, LifeGua, Settings, SupportingDetails } from '../types';

export function voidBranches(day: GanZhi): [Branch, Branch] {
  return todo('WS6', `voidBranches(${day.stem}${day.branch})`);
}

export function supportingDetails(natal: FourPillars): SupportingDetails {
  return todo('WS6', `supportingDetails(${natal.year.branch} year, ${natal.day.branch} day)`);
}

/** null when gender is missing — men and women use different Gua formulas. */
export function lifeGua(input: BirthInput): LifeGua | null {
  return todo('WS6', `lifeGua(${input.date}, ${input.gender ?? 'no gender'})`);
}

/**
 * Warnings for charts that could silently be wrong: unknown hour, slot-only hour, missing gender,
 * births within `withinMinutes` of Li Chun, any 节 solar term, 23:00, or a two-hour boundary.
 */
export function boundaryWarnings(
  input: BirthInput,
  settings: Settings,
  withinMinutes = 30,
): ChartWarning[] {
  return todo(
    'WS6',
    `boundaryWarnings(${input.date}, ${settings.lateZiHour}, ±${withinMinutes} min)`,
  );
}
