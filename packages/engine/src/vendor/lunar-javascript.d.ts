/**
 * Minimal typings for lunar-javascript (6tail, MIT) — the package ships none.
 * Only what the engine calls is declared; add methods here as you start using them.
 * API reference: https://6tail.cn/calendar/api.html
 */
declare module 'lunar-javascript' {
  export class Solar {
    static fromYmd(year: number, month: number, day: number): Solar;
    static fromYmdHms(
      year: number,
      month: number,
      day: number,
      hour: number,
      minute: number,
      second: number,
    ): Solar;
    getYear(): number;
    getMonth(): number;
    getDay(): number;
    getHour(): number;
    getMinute(): number;
    toYmdHms(): string;
    getLunar(): Lunar;
  }

  export class Lunar {
    getEightChar(): EightChar;
    /** Solar-term name (e.g. '立春', '白露') → the instant it begins, on the UTC+8 clock. */
    getJieQiTable(): Record<string, Solar>;
  }

  export class EightChar {
    /** 1: 23:00–23:59 counts as the next day. 2 (default): the day changes at midnight. */
    setSect(sect: 1 | 2): void;
    getSect(): 1 | 2;
    getYear(): string;
    getMonth(): string;
    getDay(): string;
    getTime(): string;
    getYearHideGan(): string[];
    getMonthHideGan(): string[];
    getDayHideGan(): string[];
    getTimeHideGan(): string[];
    getDayXunKong(): string;
    /** gender: 1 = male, 0 = female. sect: 1 = days ÷ 3, 2 = minute-based. */
    getYun(gender: 0 | 1, sect?: 1 | 2): Yun;
  }

  export class Yun {
    isForward(): boolean;
    getStartYear(): number;
    getStartMonth(): number;
    getStartDay(): number;
    getStartSolar(): Solar;
    getDaYun(count?: number): DaYun[];
  }

  export class DaYun {
    /** Empty string for index 0 (the years before the first luck pillar). */
    getGanZhi(): string;
    getStartYear(): number;
    getEndYear(): number;
    /** Nominal (虚岁) age. */
    getStartAge(): number;
    getEndAge(): number;
  }
}
