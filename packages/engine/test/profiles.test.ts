/**
 * WS3 specs — invariants ANY accepted model must satisfy. The match rate against Ray's 30 samples
 * is measured separately (test/samples.test.ts + research/profiles/).
 */
import { describe, expect } from 'vitest';
import { ASPECTS, STRUCTURES, TEN_GODS, parseGanZhi } from '../src/core';
import { computeAspects, computeProfiles } from '../src/profiles';
import { natal, spec } from './helpers';

const exampleA = natal('戊辰 庚申 甲子 乙丑');
const in2026 = { annual: parseGanZhi('丙午'), luck: parseGanZhi('丁巳') };

describe('[WS3] profile model invariants', () => {
  spec('natal and annual scores are whole numbers 0–100, the strongest is exactly 100', () => {
    const profiles = computeProfiles(exampleA, in2026);
    if (!profiles) return; // null is allowed until a model is accepted
    for (const set of [profiles.natal, profiles.annual]) {
      if (!set) continue;
      const scores = TEN_GODS.map((g) => set.tenGods[g]);
      for (const s of scores) expect(Number.isInteger(s) && s >= 0 && s <= 100).toBe(true);
      expect(Math.max(...scores)).toBe(100);
      expect(Object.keys(set.structures).sort()).toEqual([...STRUCTURES].sort());
    }
    expect(profiles.model).toMatch(/\S/);
  });

  // Holds on Example A's slide (V-20) and on the reference samples checked so far.
  spec('a Ten God absent from the natal chart scores 0 natal (Example A: 丙 EG, 丁 HO)', () => {
    const profiles = computeProfiles(exampleA, { annual: null, luck: null });
    if (!profiles) return;
    expect(profiles.natal.tenGods.EG).toBe(0);
    expect(profiles.natal.tenGods.HO).toBe(0);
  });
});

describe('[WS3] 6 Aspects invariants', () => {
  spec('natal and annual values cover all six aspects and stay within 0–100', () => {
    const aspects = computeAspects(exampleA, in2026);
    if (!aspects) return; // null until a model is found
    for (const set of [aspects.natal, aspects.annual]) {
      if (!set) continue;
      expect(Object.keys(set).sort()).toEqual([...ASPECTS].sort());
      for (const a of ASPECTS) expect(set[a] >= 0 && set[a] <= 100).toBe(true);
    }
    expect(aspects.model).toMatch(/\S/);
  });
});
