/// <reference path="./vendor/lunar-javascript.d.ts" />
import { Solar } from 'lunar-javascript';

/**
 * Spike S2 probe: does lunar-javascript load and compute in THIS runtime (Node, browser, Apps Script)?
 * Uses Example A — 06 Sep 1988 01:30 → 戊辰 庚申 甲子 乙丑, verified independently (tracker V-12).
 * This is a toolchain check, not the WS1 engine: it ignores every convention setting on purpose.
 */
export function libraryCheck(): { ok: boolean; expected: string; got: string } {
  const expected = '戊辰 庚申 甲子 乙丑';
  let got: string;
  try {
    const ec = Solar.fromYmdHms(1988, 9, 6, 1, 30, 0).getLunar().getEightChar();
    got = [ec.getYear(), ec.getMonth(), ec.getDay(), ec.getTime()].join(' ');
  } catch (error) {
    got = `error: ${error instanceof Error ? error.message : String(error)}`;
  }
  return { ok: got === expected, expected, got };
}
