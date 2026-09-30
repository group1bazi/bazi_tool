/**
 * WS2 — Hidden Stems & Ten Gods.
 * Owner: Cleavant · Backup: Vanessa (CD1 report §8). Also owns the terms table in core/terms.ts.
 *
 * Also the Day Master's 十二长生 life stages (new on 30 Sep: the reference month strip labels every
 * month with one). The reference runs yin stems BACKWARD (辛: 长生 at 子, 帝旺 at 申).
 *
 * Done when: every spec in test/stems.test.ts runs and passes.
 * Milestone: Example A's hidden stems and Ten God labels all match Ray's chart by 16 Oct.
 */
import type { Branch, LifeStage, Stem, TenGod } from '../core';
import { todo } from '../errors';
import type { Qi, Settings } from '../types';

export interface HiddenStemRef {
  stem: Stem;
  qi: Qi;
}

/** Hidden stems of a branch in CANONICAL order: main, middle, residual (client doc §4 table). */
export function hiddenStems(branch: Branch): HiddenStemRef[] {
  return todo('WS2', `hiddenStems(${branch})`);
}

/** Ten God of `other` relative to the Day Master (element relation × same/opposite polarity). */
export function tenGod(dayMaster: Stem, other: Stem): TenGod {
  return todo('WS2', `tenGod(${dayMaster}, ${other})`);
}

/**
 * Reorder for display only. 'residual-main-middle' puts the main qi in the centre, as on every
 * reference chart (丑 → 辛 己 癸; 申 → 戊 庚 壬 on the 1978 chart). Two-stem branches stay main, middle.
 */
export function orderForDisplay<T extends { qi: Qi }>(
  hidden: T[],
  mode: Settings['hiddenStemDisplay'],
): T[] {
  return todo('WS2', `orderForDisplay(${mode}, ${hidden.length} stems)`);
}

/** The Day Master's 十二长生 stage in `branch` (yang stems forward, yin stems backward). */
export function lifeStage(dayMaster: Stem, branch: Branch): LifeStage {
  return todo('WS2', `lifeStage(${dayMaster}, ${branch})`);
}
