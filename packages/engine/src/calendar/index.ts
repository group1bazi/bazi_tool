/**
 * WS1 — Four-pillar calendar engine.
 * Owner: Isaac · Backup: Darrius (CD1 report §8).
 *
 * Birth date + time → the four pillars. Solar-term instants and the 60-day count come from
 * lunar-javascript (see ../diagnostics.ts for the import pattern); the conventions are ours:
 * the late 子 hour, clock vs true solar time, and the UTC offset of older records.
 *
 * Late 子 hour — CONFIRMED by Ray (Determining_Hour Pillar.docx, 30 Sep): 23:00–23:59 keeps the
 * day pillar on the calendar date but takes the hour stem from the next day's stem. That is
 * lunar-javascript's sect 2 (also its default): 3 Feb 1978 23:59 → 丁巳 癸丑 丙申 庚子.
 *
 * Done when: every spec in test/calendar.test.ts runs and passes (they skip until the stub goes).
 * Milestone: Example A + doc sample + 1978 子-hour chart + 2026 Li Chun + boundary set by 16 Oct.
 */
import type { Branch, GanZhi, Stem } from '../core';
import { todo } from '../errors';
import type { BirthInput, ChartWarning, Settings } from '../types';

export interface FourPillars {
  year: GanZhi;
  month: GanZhi;
  day: GanZhi;
  /** null when the birth hour is unknown. A 2-hour slot still gives an hour pillar. */
  hour: GanZhi | null;
  warnings: ChartWarning[];
}

export function computePillars(input: BirthInput, settings: Settings): FourPillars {
  return todo('WS1', `computePillars(${input.date}, lateZiHour=${settings.lateZiHour})`);
}

/** Five Tigers (五虎遁): the month stem follows from the year stem and the solar-month branch. */
export function monthStem(yearStem: Stem, monthBranch: Branch): Stem {
  return todo('WS1', `monthStem(${yearStem}, ${monthBranch})`);
}

/** Five Rats (五鼠遁): the hour stem follows from the day stem and the hour branch. */
export function hourStem(dayStem: Stem, hourBranch: Branch): Stem {
  return todo('WS1', `hourStem(${dayStem}, ${hourBranch})`);
}

/** Two-hour branch for a clock time 'HH:MM': 23:00–00:59 → 子, 01:00–02:59 → 丑, … */
export function hourBranchOf(time: string): Branch {
  return todo('WS1', `hourBranchOf(${time})`);
}

/**
 * UTC offset in force for a birth recorded in Singapore on `date` ('YYYY-MM-DD').
 * Hint: Intl.DateTimeFormat with timeZone 'Asia/Singapore' carries the historical offsets
 * (+07:30 until 31 Dec 1981, +09:00 in 1942–45). Check it also works inside Apps Script.
 * Only used when `settings.historicalUtcOffset` is 'apply' (default 'ignore', like the reference
 * plotter) and for the HISTORICAL_UTC_OFFSET warning.
 */
export function defaultUtcOffset(date: string): string {
  return todo('WS1', `defaultUtcOffset(${date})`);
}
