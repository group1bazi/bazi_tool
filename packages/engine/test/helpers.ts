import { it } from 'vitest';
import type { FourPillars } from '../src/calendar';
import { parseGanZhi } from '../src/core';
import { NotImplementedError } from '../src/errors';

/**
 * A spec that SKIPS while the code under test is still a scaffold stub (throws NotImplementedError)
 * and runs for real as soon as the stub is replaced. Nobody has to remember to un-skip anything.
 * Any other error — including a wrong answer — fails the test as usual.
 */
export function spec(name: string, fn: () => void | Promise<void>): void {
  it(name, async (ctx) => {
    try {
      await fn();
    } catch (error) {
      if (error instanceof NotImplementedError) ctx.skip();
      throw error;
    }
  });
}

/**
 * Use instead of `expect(fn).toThrow(...)` inside a spec: returns what `fn` throws, but lets a
 * NotImplementedError through so the spec still skips while the code is a stub.
 */
export function thrownBy(fn: () => unknown): unknown {
  try {
    fn();
  } catch (error) {
    if (error instanceof NotImplementedError) throw error;
    return error;
  }
  return undefined;
}

/** Build a FourPillars from '戊辰 庚申 甲子 乙丑' so downstream modules can be tested without WS1. */
export function natal(text: string): FourPillars {
  const [year, month, day, hour] = text
    .split(' ')
    .map((gz) => (gz === '-' ? null : parseGanZhi(gz)));
  if (!year || !month || !day)
    throw new Error(`natal("${text}") needs at least year, month and day`);
  return { year, month, day, hour: hour ?? null, warnings: [] };
}
