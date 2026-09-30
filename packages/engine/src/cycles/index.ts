/**
 * WS4 — Luck, annual and monthly pillars.
 * Owner: Raees · Backup: Dave (CD1 report §8).
 *
 * Luck direction: yang-year male / yin-year female run forward, the others backward (30/30 samples).
 * Luck start: Ray does NOT know how his plotter computes it and asked us to explain the method
 * (30 Sep, RC-09). The reference's rule was FOUND on all 30 samples — settings.luckStartMethod
 * 'calendar-days' (the default): whole calendar days from the birth DATE to the DATE of the 节,
 * where a birth on a 节's date counts as after that 节 whatever the time; first age = round(days ÷ 3).
 * That is why a birth a few hours before a 节 on the same day starts at 10 (forward) or 0 (backward).
 * Printed ages are nominal (虚岁): a pillar printed at age A starts in birthYear + A − 1.
 * Explain it to Ray in docs/luck-pillars-for-ray.md for CD2. lunar-javascript's own start age
 * (exact instants) disagrees on 16 of the 30 — keep it only for the other two settings.
 *
 * Done when: every spec in test/cycles.test.ts runs and passes.
 * Milestone: direction + start-age rule tested on the samples; 2026 month strip matches (21 Oct).
 */
import type { GanZhi } from '../core';
import type { FourPillars } from '../calendar';
import { todo } from '../errors';
import type { BirthInput, LuckCycle, Settings } from '../types';

export type LuckPillarRaw = GanZhi & { startAge: number; startYear: number };
export type LuckCycleRaw = Omit<LuckCycle, 'pillars'> & { pillars: LuckPillarRaw[] };
export type MonthPillarRaw = GanZhi & { month: number; starts: string };

/** null when gender is missing (direction cannot be decided). */
export function computeLuck(
  input: BirthInput,
  natal: FourPillars,
  settings: Settings,
): LuckCycleRaw | null {
  return todo(
    'WS4',
    `computeLuck(${input.date}, ${input.gender ?? 'no gender'}, ${settings.luckStartMethod}, year ${natal.year.stem})`,
  );
}

/** The year pillar in force for most of `year` (i.e. after that year's Li Chun). */
export function annualPillar(year: number): GanZhi {
  return todo('WS4', `annualPillar(${year})`);
}

/**
 * The 12 solar months for `year`.
 * 'bazi-year' (default, as on the Joey Yap samples): 寅 month from Li Chun (~4 Feb) to the 丑 month
 *   that starts at 小寒 (~5 Jan) of year + 1.
 * 'calendar-year' (as on Ray's deck slide): January (小寒, still the previous Bazi year) … December.
 */
export function monthStrip(year: number, span: Settings['monthStripSpan']): MonthPillarRaw[] {
  return todo('WS4', `monthStrip(${year}, ${span})`);
}
