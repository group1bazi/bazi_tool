import type { BirthInput, LifeGua, PillarPosition } from '../src/types';
import docSample from './golden/doc-sample.json';
import exampleA from './golden/example-a.json';
import monthStrip2026 from './golden/month-strip-2026.json';
import ziHour1978 from './golden/zi-hour-1978.json';

export { EXAMPLE_A_CHART } from './example-a.chart';

type Positions<T> = Partial<Record<PillarPosition, T>>;

/**
 * A verified reference chart. `expected` is asserted by test/golden.test.ts; `hypotheses` is kept
 * for context and never asserted. Only anonymised or synthetic cases belong here — see
 * docs/data-handling.md.
 */
export interface GoldenChart {
  id: string;
  description: string;
  source: string;
  input: BirthInput;
  annualYear: number;
  expected: {
    pillars: Positions<string> & Record<'year' | 'month' | 'day', string>;
    hiddenStems?: Positions<string[]>;
    hiddenStemsDisplay?: Positions<string[]>;
    stemGods?: Positions<string>;
    hiddenGods?: Positions<string[]>;
    voids?: string[];
    /** Branches as characters; lifePalace / conceptionPalace as pillars, e.g. '己未'. */
    supporting?: Record<string, string | string[]>;
    gua?: LifeGua;
    annual?: string;
  };
  hypotheses: Record<string, unknown>;
}

interface StripMonth {
  month: number;
  pillar: string;
  starts: string;
}

export interface GoldenMonthStrip {
  id: string;
  description: string;
  source: string;
  annualYear: number;
  dayPillar: string;
  expected: {
    baziYear: StripMonth[];
    calendarYear: StripMonth[];
    voidMonths: number[];
  };
}

// JSON imports are typed loosely ('exact' becomes string), hence the one cast here.
export const GOLDEN_CHARTS = [exampleA, docSample, ziHour1978] as unknown as GoldenChart[];
export const GOLDEN_MONTH_STRIPS = [monthStrip2026] as unknown as GoldenMonthStrip[];
