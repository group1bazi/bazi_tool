/**
 * Match-rate harness for Ray's 30 sample charts (WS9) — the numbers the CD reports quote.
 *
 * Reads research/profiles/data/samples.csv, which is PRIVATE and git-ignored: the values are keyed
 * in by hand from the sample PDFs (they have no text layer) using research/profiles/samples.template.csv.
 * Every workstream is scored against the same rows; a check reports "pending" while its module is
 * a stub and "no data" while a column is still blank. Without the file this suite is skipped.
 *
 *   npx vitest run packages/engine/test/samples.test.ts
 */
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { computePillars, type FourPillars } from '../src/calendar';
import { formatGanZhi, parseGanZhi, TEN_GODS } from '../src/core';
import { annualPillar, computeLuck } from '../src/cycles';
import { NotImplementedError } from '../src/errors';
import { lifeGua, supportingDetails, voidBranches } from '../src/lookups';
import { computeProfiles } from '../src/profiles';
import { DEFAULT_SETTINGS } from '../src/settings';
import type { BirthInput } from '../src/types';

const CSV = fileURLToPath(new URL('../../../research/profiles/data/samples.csv', import.meta.url));

type Row = Record<string, string>;
type Outcome = 'pass' | 'fail' | 'pending' | 'no data';

function readCsv(path: string): Row[] {
  const [header, ...lines] = readFileSync(path, 'utf8')
    .split(/\r?\n/)
    .filter((l) => l.trim() && !l.startsWith('#'));
  const cols = header!.split(',').map((c) => c.trim());
  return lines.map((line) => {
    const cells = line.split(',');
    return Object.fromEntries(cols.map((c, i) => [c, (cells[i] ?? '').trim()]));
  });
}

const input = (r: Row): BirthInput => ({
  date: r.birth_date!,
  time: r.birth_time ? { kind: 'exact', time: r.birth_time } : { kind: 'unknown' },
  gender: r.gender === 'M' || r.gender === 'F' ? r.gender : null,
});

/** The keyed pillars, so each check below is independent of WS1. */
const keyed = (r: Row): FourPillars => ({
  year: parseGanZhi(r.year!),
  month: parseGanZhi(r.month!),
  day: parseGanZhi(r.day!),
  hour: r.hour ? parseGanZhi(r.hour) : null,
  warnings: [],
});

const sorted = (s: string) => [...s].sort().join('');

interface Check {
  name: string;
  needs: string[];
  run: (r: Row) => boolean;
}

const CHECKS: Check[] = [
  {
    name: '[WS1] four pillars',
    needs: ['year', 'month', 'day'],
    run: (r) => {
      const p = computePillars(input(r), DEFAULT_SETTINGS);
      const got = [p.year, p.month, p.day, p.hour].map((g) => (g ? formatGanZhi(g) : ''));
      return got.join(' ') === [r.year, r.month, r.day, r.hour].join(' ');
    },
  },
  {
    name: '[WS6] 空亡',
    needs: ['voids'],
    run: (r) => sorted(voidBranches(parseGanZhi(r.day!)).join('')) === sorted(r.voids!),
  },
  {
    name: '[WS6] personal chart details',
    needs: ['solitary', 'life_palace', 'conception_palace'],
    run: (r) => {
      const s = supportingDetails(keyed(r));
      const want: Record<string, string | undefined> = {
        noble_people: r.noble_people && sorted(r.noble_people),
        intelligence: r.intelligence,
        peach_blossom: r.peach_blossom,
        sky_horse: r.sky_horse,
        solitary: r.solitary,
        life_palace: r.life_palace,
        conception_palace: r.conception_palace,
      };
      const got: Record<string, string> = {
        noble_people: sorted(s.noblePeople.join('')),
        intelligence: s.intelligence,
        peach_blossom: s.peachBlossom,
        sky_horse: s.skyHorse,
        solitary: s.solitary,
        life_palace: formatGanZhi(s.lifePalace),
        conception_palace: formatGanZhi(s.conceptionPalace),
      };
      return Object.entries(want).every(([k, v]) => !v || got[k] === v);
    },
  },
  {
    name: '[WS6] Life Gua number',
    needs: ['gua_number', 'gender'],
    run: (r) => String(lifeGua(input(r))?.number) === r.gua_number,
  },
  {
    name: '[WS4] first luck pillar + displayed age',
    needs: ['luck_first_pillar', 'luck_first_age', 'gender'],
    run: (r) => {
      const first = computeLuck(input(r), keyed(r), DEFAULT_SETTINGS)?.pillars[0];
      return (
        !!first &&
        formatGanZhi(first) === r.luck_first_pillar &&
        String(first.startAge) === r.luck_first_age
      );
    },
  },
  {
    name: '[WS3] natal Ten Profiles %',
    needs: ['natal_F'],
    run: (r) => {
      const prof = computeProfiles(keyed(r), { annual: null, luck: null });
      return !!prof && TEN_GODS.every((g) => String(prof.natal.tenGods[g]) === r[`natal_${g}`]);
    },
  },
  {
    name: '[WS3] annual Ten Profiles %',
    needs: ['annual_F', 'annual_year', 'gender'],
    run: (r) => {
      const year = Number(r.annual_year);
      const luck = computeLuck(input(r), keyed(r), DEFAULT_SETTINGS)?.pillars ?? [];
      const current = [...luck].reverse().find((p) => p.startYear <= year) ?? null;
      const prof = computeProfiles(keyed(r), { annual: annualPillar(year), luck: current });
      return (
        !!prof?.annual &&
        TEN_GODS.every((g) => String(prof.annual!.tenGods[g]) === r[`annual_${g}`])
      );
    },
  },
];

function outcome(check: Check, r: Row): Outcome {
  if (check.needs.some((c) => !r[c])) return 'no data';
  try {
    return check.run(r) ? 'pass' : 'fail';
  } catch (error) {
    if (error instanceof NotImplementedError) return 'pending';
    throw error;
  }
}

describe.skipIf(!existsSync(CSV))("Ray's samples — match rate", () => {
  const rows = existsSync(CSV) ? readCsv(CSV).filter((r) => r.birth_date) : [];

  it('reports how many samples each module reproduces exactly', () => {
    const table: Record<string, Record<string, string | number>> = {};
    const misses: string[] = [];
    for (const check of CHECKS) {
      const counts = { pass: 0, fail: 0, pending: 0, 'no data': 0 };
      for (const r of rows) {
        const o = outcome(check, r);
        counts[o]++;
        if (o === 'fail') misses.push(`${r.sample_id}: ${check.name}`);
      }
      const scored = counts.pass + counts.fail;
      table[check.name] = { ...counts, 'match rate': scored ? `${counts.pass}/${scored}` : '—' };
    }
    console.table(table);
    if (misses.length) console.log(misses.join('\n'));
    expect(rows.length).toBeGreaterThan(0);
  });
});
