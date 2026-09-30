/**
 * Golden harness (WS9). Every section in a fixture's `expected` becomes one test. Each section
 * feeds the module under test with the fixture's OWN upstream values (e.g. the Ten God check uses
 * the expected pillars, not WS1's output), so a workstream can go green without waiting for another.
 * Add a case: drop a JSON file in fixtures/golden/ and register it in fixtures/index.ts.
 */
import { describe, expect } from 'vitest';
import { GOLDEN_CHARTS, GOLDEN_MONTH_STRIPS } from '../fixtures';
import { computePillars } from '../src/calendar';
import { formatGanZhi, parseGanZhi, type Branch, type Stem } from '../src/core';
import { annualPillar, monthStrip } from '../src/cycles';
import { lifeGua, supportingDetails, voidBranches } from '../src/lookups';
import { DEFAULT_SETTINGS } from '../src/settings';
import { hiddenStems, orderForDisplay, tenGod } from '../src/stems';
import type { PillarPosition } from '../src/types';
import { natal, spec } from './helpers';

for (const fixture of GOLDEN_CHARTS) {
  const { expected: exp } = fixture;
  const positions = Object.keys(exp.pillars) as PillarPosition[];
  const pillarOf = (pos: PillarPosition) => exp.pillars[pos] ?? '';
  const branchOf = (pos: PillarPosition) => [...pillarOf(pos)][1] as Branch;
  const dayMaster = [...exp.pillars.day][0] as Stem;

  describe(`golden: ${fixture.id}`, () => {
    spec('[WS1] pillars', () => {
      const p = computePillars(fixture.input, DEFAULT_SETTINGS);
      const got = { year: p.year, month: p.month, day: p.day, hour: p.hour };
      for (const pos of positions)
        expect(got[pos] && formatGanZhi(got[pos]), pos).toBe(exp.pillars[pos]);
    });

    if (exp.hiddenStems) {
      const want = exp.hiddenStems;
      spec('[WS2] hidden stems (canonical)', () => {
        for (const pos of positions) {
          expect(
            hiddenStems(branchOf(pos)).map((h) => h.stem),
            pos,
          ).toEqual(want[pos]);
        }
      });
    }

    if (exp.hiddenStemsDisplay) {
      const want = exp.hiddenStemsDisplay;
      spec("[WS2] hidden stems (Ray's display order)", () => {
        for (const pos of positions) {
          const shown = orderForDisplay(hiddenStems(branchOf(pos)), 'residual-main-middle');
          expect(
            shown.map((h) => h.stem),
            pos,
          ).toEqual(want[pos]);
        }
      });
    }

    if (exp.stemGods) {
      const want = exp.stemGods;
      spec('[WS2] Ten Gods of the stems', () => {
        for (const [pos, god] of Object.entries(want)) {
          const stem = [...pillarOf(pos as PillarPosition)][0] as Stem;
          expect(tenGod(dayMaster, stem), pos).toBe(god);
        }
      });
    }

    if (exp.hiddenGods && exp.hiddenStems) {
      const [wantGods, wantStems] = [exp.hiddenGods, exp.hiddenStems];
      spec('[WS2] Ten Gods of the hidden stems', () => {
        for (const pos of positions) {
          const gods = (wantStems[pos] ?? []).map((s) => tenGod(dayMaster, s as Stem));
          expect(gods, pos).toEqual(wantGods[pos]);
        }
      });
    }

    if (exp.voids) {
      const want = exp.voids;
      spec('[WS6] 空亡', () => {
        expect(voidBranches(parseGanZhi(exp.pillars.day))).toEqual(want);
      });
    }

    if (exp.supporting) {
      const want = exp.supporting;
      spec('[WS6] personal chart details', () => {
        const p = exp.pillars;
        const got = supportingDetails(natal(`${p.year} ${p.month} ${p.day} ${p.hour ?? '-'}`));
        const shown: Record<string, string | string[]> = {
          ...got,
          noblePeople: [...got.noblePeople].sort(),
          lifePalace: formatGanZhi(got.lifePalace),
          conceptionPalace: formatGanZhi(got.conceptionPalace),
        };
        // Only the details the fixture records are compared.
        for (const key of Object.keys(want)) expect(shown[key], key).toEqual(want[key]);
      });
    }

    if (exp.gua) {
      const want = exp.gua;
      spec('[WS6] Life Gua, Life Star and directions', () => {
        expect(lifeGua(fixture.input)).toEqual(want);
      });
    }

    if (exp.annual) {
      const want = exp.annual;
      spec(`[WS4] annual pillar ${fixture.annualYear}`, () => {
        expect(formatGanZhi(annualPillar(fixture.annualYear))).toBe(want);
      });
    }
  });
}

for (const fixture of GOLDEN_MONTH_STRIPS) {
  describe(`golden: ${fixture.id}`, () => {
    const spans = [
      ['bazi-year', fixture.expected.baziYear],
      ['calendar-year', fixture.expected.calendarYear],
    ] as const;

    for (const [span, want] of spans) {
      spec(`[WS4] ${span} month pillars and their start instants (±1 min)`, () => {
        const strip = monthStrip(fixture.annualYear, span);
        expect(strip.map((m) => [m.month, formatGanZhi(m)])).toEqual(
          want.map((m) => [m.month, m.pillar]),
        );
        strip.forEach((m, i) => {
          const drift = Math.abs(Date.parse(m.starts) - Date.parse(want[i]!.starts));
          expect(drift, `month ${m.month} starts`).toBeLessThanOrEqual(60_000);
        });
      });
    }

    spec('[WS6] 空亡 tags fall on the right months', () => {
      const voids = voidBranches(parseGanZhi(fixture.dayPillar));
      const tagged = fixture.expected.calendarYear
        .filter((m) => voids.includes([...m.pillar][1] as Branch))
        .map((m) => m.month);
      expect(tagged).toEqual(fixture.expected.voidMonths);
    });
  });
}
