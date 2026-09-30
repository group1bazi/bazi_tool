/**
 * WS4 — Luck, annual and monthly pillars.
 * Owner: Raees · Backup: Dave (CD1 report §8).
 *
 * Luck direction: yang-year male / yin-year female run forward, the others backward.
 * Luck start: Ray does NOT know how his plotter computes it and asked us to explain the method
 * (30 Sep). So Q2 is ours: pick the standard rule, check it against all 30 samples, and write a
 * one-page explanation for Ray (docs/luck-pillars-for-ray.md) for CD2.
 * Careful: lunar-javascript's DaYun ages are nominal (虚岁); the reference shows ages like 8, 18, 28.
 * Lead: on at least one sample born a few hours BEFORE a 节 on the same day, the reference starts
 * the first luck pillar at 10 where the days ÷ 3 rule gives about 0 — check how many samples do this.
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
