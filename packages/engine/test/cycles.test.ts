/**
 * WS4 specs — luck, annual and monthly pillars. They SKIP until src/cycles stops throwing.
 * The luck START AGE is deliberately not asserted yet. Ray doesn't know his plotter's rule (30 Sep),
 * so we choose one and prove it on the 30 samples (samples.test.ts), then explain it to him.
 */
import { describe, expect, it } from 'vitest';
import { formatGanZhi } from '../src/core';
import { annualPillar, computeLuck, monthStrip } from '../src/cycles';
import { DEFAULT_SETTINGS } from '../src/settings';
import type { BirthInput } from '../src/types';
import { natal, spec } from './helpers';

const exampleA: BirthInput = {
  date: '1988-09-06',
  time: { kind: 'exact', time: '01:30' },
  gender: 'F',
};
const exampleANatal = natal('戊辰 庚申 甲子 乙丑');

describe('[WS4] annual and monthly pillars', () => {
  spec('annual pillar', () => {
    expect(formatGanZhi(annualPillar(2026))).toBe('丙午');
    expect(formatGanZhi(annualPillar(1988))).toBe('戊辰');
  });

  spec('2026 Bazi-year strip (Joey Yap samples): FEB 4 庚寅 … JAN 5 (2027) 辛丑', () => {
    const strip = monthStrip(2026, 'bazi-year');
    expect(strip.map((m) => m.month)).toEqual([2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 1]);
    expect(strip.map(formatGanZhi).join(' ')).toBe(
      '庚寅 辛卯 壬辰 癸巳 甲午 乙未 丙申 丁酉 戊戌 己亥 庚子 辛丑',
    );
    expect(strip[11]!.starts.startsWith('2027-01-05')).toBe(true);
  });

  spec("2026 calendar-year strip (Ray's deck): January is 己丑 (still the 乙巳 year)", () => {
    const strip = monthStrip(2026, 'calendar-year');
    expect(strip.map((m) => m.month)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
    expect(strip.map(formatGanZhi).join(' ')).toBe(
      '己丑 庚寅 辛卯 壬辰 癸巳 甲午 乙未 丙申 丁酉 戊戌 己亥 庚子',
    );
  });
});

describe('[WS4] luck pillars', () => {
  spec('Example A (yang year, female) runs backward from the month pillar 庚申', () => {
    const luck = computeLuck(exampleA, exampleANatal, DEFAULT_SETTINGS);
    expect(luck?.direction).toBe('backward');
    expect(luck?.pillars.slice(0, 4).map(formatGanZhi)).toEqual(['己未', '戊午', '丁巳', '丙辰']);
  });

  spec('a yang-year male runs forward', () => {
    const luck = computeLuck({ ...exampleA, gender: 'M' }, exampleANatal, DEFAULT_SETTINGS);
    expect(luck?.direction).toBe('forward');
    expect(luck?.pillars.slice(0, 2).map(formatGanZhi)).toEqual(['辛酉', '壬戌']);
  });

  spec('no gender → no luck pillars (the template gained a Gender column on 30 Sep)', () => {
    expect(computeLuck({ ...exampleA, gender: null }, exampleANatal, DEFAULT_SETTINGS)).toBeNull();
  });

  it.todo(
    '[WS4] the chosen start-age rule reproduces the displayed first-luck age on all 30 samples (samples.test.ts)',
  );
  it.todo(
    '[WS4] births a few hours before a 节 on the same day: the reference shows a first luck age of 10 where days ÷ 3 gives ~0 — explain or match',
  );
  it.todo(
    '[WS4] the "starts at 8" deck chart (Day Master 丙, month 甲午) reproduces age 8 — needs its birth data from Ray',
  );
});
