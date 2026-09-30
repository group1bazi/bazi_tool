/**
 * WS1 specs — four pillars. They SKIP until src/calendar stops throwing NotImplementedError.
 * Expected values: client doc, Ray's Determining_Hour Pillar.docx (30 Sep), CD1 report Appendix B,
 * and the boundary instants in the comments (lunar-javascript 1.7.7, UTC+8 clock) — cross-check
 * them against a second source (§7.3).
 */
import { describe, expect } from 'vitest';
import {
  computePillars,
  defaultUtcOffset,
  hourBranchOf,
  hourStem,
  monthStem,
} from '../src/calendar';
import { formatGanZhi } from '../src/core';
import { DEFAULT_SETTINGS, resolveSettings } from '../src/settings';
import type { BirthInput } from '../src/types';
import { spec } from './helpers';

const at = (date: string, time: string, utcOffset?: string): BirthInput => ({
  date,
  time: { kind: 'exact', time },
  gender: 'F',
  ...(utcOffset ? { utcOffset } : {}),
});

function pillars(input: BirthInput, settings = DEFAULT_SETTINGS): string {
  const p = computePillars(input, settings);
  return [p.year, p.month, p.day, p.hour].map((gz) => (gz ? formatGanZhi(gz) : '-')).join(' ');
}

describe('[WS1] derivation rules (client doc §6–§7)', () => {
  spec('Five Tigers: month stem from year stem', () => {
    expect(monthStem('戊', '寅')).toBe('甲');
    expect(monthStem('戊', '亥')).toBe('癸'); // doc: 癸亥
    expect(monthStem('丙', '寅')).toBe('庚'); // 2026 strip: Feb = 庚寅
    expect(monthStem('乙', '丑')).toBe('己'); // Jan 2026 = 己丑, from the 乙巳 year (V-F3)
  });

  spec('Five Rats: hour stem from day stem', () => {
    expect(hourStem('甲', '子')).toBe('甲');
    expect(hourStem('甲', '丑')).toBe('乙'); // Example A: 乙丑
    expect(hourStem('甲', '午')).toBe('庚'); // doc: 庚午
    expect(hourStem('乙', '子')).toBe('丙');
    expect(hourStem('丙', '子')).toBe('戊'); // Ray's hour doc: 丙 day → 戊子
  });

  // Ray's hour doc: "13:45 is 未 hour, but 甲/己 → 辛未, 乙/庚 → 癸未, 丙/辛 → 乙未, 丁/壬 → 丁未, 戊/癸 → 己未"
  spec('Five Rats: the same 未 hour gives five different stems', () => {
    const got = (['甲', '乙', '丙', '丁', '戊'] as const).map((d) => hourStem(d, '未'));
    expect(got).toEqual(['辛', '癸', '乙', '丁', '己']);
    expect(hourStem('己', '未')).toBe('辛');
    expect(hourStem('癸', '未')).toBe('己');
  });

  spec('two-hour branches, including the 23:00 start of 子', () => {
    expect(hourBranchOf('23:00')).toBe('子');
    expect(hourBranchOf('00:59')).toBe('子');
    expect(hourBranchOf('01:00')).toBe('丑');
    expect(hourBranchOf('11:00')).toBe('午');
    expect(hourBranchOf('12:59')).toBe('午');
    expect(hourBranchOf('22:59')).toBe('亥');
  });
});

describe('[WS1] reference charts', () => {
  spec('Example A: 06 Sep 1988 01:30 → 戊辰 庚申 甲子 乙丑', () => {
    expect(pillars(at('1988-09-06', '01:30'))).toBe('戊辰 庚申 甲子 乙丑');
  });

  spec('client doc sample: 15 Nov 1988 12:00 → 戊辰 癸亥 甲戌 庚午', () => {
    expect(pillars(at('1988-11-15', '12:00'))).toBe('戊辰 癸亥 甲戌 庚午');
  });

  spec("Ray's hour doc: 3 Feb 1978 13:45 → hour 乙未 (丙 day, 未 hour)", () => {
    expect(pillars(at('1978-02-03', '13:45'))).toBe('丁巳 癸丑 丙申 乙未');
  });

  spec('unknown hour → no hour pillar', () => {
    const p = computePillars(
      { date: '1988-09-06', time: { kind: 'unknown' }, gender: 'F' },
      DEFAULT_SETTINGS,
    );
    expect(p.hour).toBeNull();
    expect(formatGanZhi(p.day)).toBe('甲子');
  });

  spec('a two-hour slot still gives the hour pillar', () => {
    const p = computePillars(
      { date: '1988-09-06', time: { kind: 'slot', branch: '丑' }, gender: 'F' },
      DEFAULT_SETTINGS,
    );
    expect(p.hour && formatGanZhi(p.hour)).toBe('乙丑');
  });
});

describe('[WS1] boundaries', () => {
  // 立春 2026 = 2026-02-04 04:02:08 (UTC+8)
  spec('Li Chun 2026: the year AND month change at 04:02', () => {
    expect(
      pillars(at('2026-02-04', '04:01', '+08:00'))
        .split(' ')
        .slice(0, 2),
    ).toEqual(['乙巳', '己丑']);
    expect(
      pillars(at('2026-02-04', '04:03', '+08:00'))
        .split(' ')
        .slice(0, 2),
    ).toEqual(['丙午', '庚寅']);
  });

  // 白露 1988 = 1988-09-07 18:11:31 (UTC+8) — Example A is one day before it
  spec('白露 1988: the month changes 申 → 酉 at 18:11', () => {
    expect(pillars(at('1988-09-07', '18:10')).split(' ')[1]).toBe('庚申');
    expect(pillars(at('1988-09-07', '18:12')).split(' ')[1]).toBe('辛酉');
  });

  // CONFIRMED rule (Ray, Determining_Hour Pillar.docx): day pillar stays, hour stem from next day.
  spec("late 子 hour, Ray's example: 3 Feb 1978 23:59 → 丁巳 癸丑 丙申 庚子 (Q3 closed)", () => {
    expect(pillars(at('1978-02-03', '23:59'))).toBe('丁巳 癸丑 丙申 庚子');
  });

  spec("late 子 hour: 'next-day' moves the day pillar too", () => {
    const nextDay = resolveSettings({ lateZiHour: 'next-day' });
    expect(pillars(at('1978-02-03', '23:59'), nextDay)).toBe('丁巳 癸丑 丁酉 庚子');
    expect(pillars(at('2026-09-23', '23:30'), nextDay).split(' ')[2]).toBe('辛丑');
    expect(pillars(at('2026-09-23', '23:30')).split(' ')[2]).toBe('庚子');
  });

  spec('Singapore offsets: +07:30 before 1982, +09:00 in 1942, +08:00 after', () => {
    expect(defaultUtcOffset('1942-06-01')).toBe('+09:00');
    expect(defaultUtcOffset('1975-06-06')).toBe('+07:30');
    expect(defaultUtcOffset('1981-12-31')).toBe('+07:30');
    expect(defaultUtcOffset('1982-01-01')).toBe('+08:00');
  });

  // Default 'ignore': the reference plotter never asks for a birthplace, so it reads the recorded
  // time as-is. The 1978 chart proves it: corrected from +07:30 it would be a 丁酉 day, not 丙申.
  spec('historical offset: the default reads the recorded time as-is, like the reference', () => {
    const apply = resolveSettings({ historicalUtcOffset: 'apply' });
    expect(pillars(at('1978-02-03', '23:59'), apply)).toBe('丁巳 癸丑 丁酉 庚子');
    expect(pillars(at('1978-02-03', '23:59'))).toBe('丁巳 癸丑 丙申 庚子');
  });

  // 芒种 1975 = 1975-06-06 15:42:01 (UTC+8). 15:22 on a +07:30 clock is 15:52 on the UTC+8 clock.
  spec(
    "pre-1982 birth 20 min before 芒种: only 'apply' (or an explicit offset) moves the month",
    () => {
      const apply = resolveSettings({ historicalUtcOffset: 'apply' });
      expect(pillars(at('1975-06-06', '15:22'))).toBe('乙卯 辛巳 癸未 庚申');
      expect(pillars(at('1975-06-06', '15:22'), apply)).toBe('乙卯 壬午 癸未 庚申');
      expect(pillars(at('1975-06-06', '15:22', '+07:30'))).toBe('乙卯 壬午 癸未 庚申');
    },
  );
});
