/**
 * WS6 — 空亡 (void) markers, Personal Chart Details, Life Gua, and edge cases.
 * Owner: Darrius · Backup: Isaac (CD1 report §8).
 *
 * Void rule: CONFIRMED by Ray on 26 Sep (Determining_DE.docx) — the day pillar's 旬 (10-pillar
 * group) uses only 10 of the 12 branches; the two missing ones are the chart's 空亡 pair.
 *
 * Personal Chart Details: eight lookups on the reference chart. Leads from the reference charts:
 *  - Solitary 孤辰 comes from the DAY branch (both charts we checked; the year branch gives a
 *    different answer on one of them). Check whether Peach Blossom / Sky Horse do the same.
 *  - Conception Palace 胎元 = month stem + 1, month branch + 3 (庚申 → 辛亥 on Example A).
 *  - Life Palace 命宫: stem by Five Tigers from the year stem; the branch rule is to be found
 *    (Example A → 己未). Several traditional formulas exist — test them on the 30 samples.
 *
 * Life Gua / Life Star / 8 directions: REQUESTED by Ray on 30 Sep (was optional; RC-05).
 * Life Star = the Gua number's nine-star name (Example A: Gua 3 震 → "3 Jade", Wood).
 * Lead: on one sample born before Li Chun on 4 Feb, the Gua follows the NEW year while the pillars
 * follow the old one — so the Gua year boundary is not the exact Li Chun instant. Find the rule.
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
