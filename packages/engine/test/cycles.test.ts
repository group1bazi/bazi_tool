/**
 * WS4 specs — luck, annual and monthly pillars. They SKIP until src/cycles stops throwing.
 * The luck START AGE rule was found on Ray's 30 samples (30 Sep; docs/conventions.md) and is the
 * default ('calendar-days'). samples.test.ts scores it against every printed first age; the spec
 * below pins it with a synthetic birth.
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

  // Synthetic: 7 Aug 2010 10:00 is on the 立秋 date but before its instant (22:49), so the month is
  // still 癸未. The reference counts whole calendar days to the 节 DATE: a man (forward) waits for
  // 白露 on 8 Sep (32 days → 11); a woman (backward) is already at 立秋 (0 days → 0). lunar-javascript's
  // exact-instant rule gives 0 and 10 instead. 4 Aug is an ordinary day: 3 days → 1, 28 days → 9.
  spec('start age = whole calendar days to the 节 date ÷ 3, rounded (calendar-days)', () => {
    const born = (date: string, gender: 'M' | 'F'): BirthInput => ({
      date,
      time: { kind: 'exact', time: '10:00' },
      gender,
    });
    const first = (date: string, gender: 'M' | 'F', pillars: string) =>
      computeLuck(born(date, gender), natal(pillars), DEFAULT_SETTINGS)?.pillars[0];
    const onJie = '庚寅 癸未 己丑 己巳';
    expect(formatGanZhi(first('2010-08-07', 'M', onJie)!)).toBe('甲申');
    expect(first('2010-08-07', 'M', onJie)?.startAge).toBe(11);
    expect(formatGanZhi(first('2010-08-07', 'F', onJie)!)).toBe('壬午');
    expect(first('2010-08-07', 'F', onJie)?.startAge).toBe(0);
    expect(first('2010-08-04', 'M', '庚寅 癸未 丙戌 癸巳')?.startAge).toBe(1);
    expect(first('2010-08-04', 'F', '庚寅 癸未 丙戌 癸巳')?.startAge).toBe(9);
  });

  it.todo(
    '[WS4] the start-age rule reproduces the printed first-luck age on all 30 samples (samples.test.ts)',
  );
  it.todo(
    '[WS4] the "starts at 8" deck chart (Day Master 丙, month 甲午) reproduces age 8 — needs its birth data from Ray',
  );
});
