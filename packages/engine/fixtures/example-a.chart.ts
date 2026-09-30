/**
 * A complete, hand-written ChartResult for Example A (06 Sep 1988 01:30 F), annual year 2026.
 *
 * PURPOSE: lets the web app (WS7) and the Drive automation (WS8) build and demo against the real
 * data shape before the engine is finished. It is NOT a test oracle:
 *  - pillars, hidden stems, Ten Gods, voids, personal chart details, Gua, annual and month strip:
 *    verified (see golden/example-a.json and golden/month-strip-2026.json);
 *  - month strip: the Bazi year Feb 2026 → Jan 2027, as on the Joey Yap samples;
 *    life stages from the standard table for a 甲 Day Master;
 *  - luck pillars: lunar-javascript's answer, still a hypothesis (Q2);
 *  - relationships: standard rules applied by hand, for illustration;
 *  - profiles and aspects: null — no model yet (WS3).
 */
import type { LifeStage, TenGod } from '../src/core';
import { parseGanZhi } from '../src/core';
import { DEFAULT_SETTINGS } from '../src/settings';
import type { ChartResult, Pillar, Qi } from '../src/types';

const QI: Qi[] = ['main', 'middle', 'residual'];

/** p('戊辰', 'IW', 'IW RW DR') — hidden stems come from the branch table in canonical order. */
function p(ganZhi: string, stemGod: TenGod | null, hiddenGods: string, isVoid = false): Pillar {
  const gz = parseGanZhi(ganZhi);
  const gods = hiddenGods.split(' ') as TenGod[];
  const stems = HIDDEN[gz.branch];
  return {
    ...gz,
    stemGod,
    hidden: stems.map((stem, i) => ({ stem, qi: QI[i]!, god: gods[i]! })),
    void: isVoid,
  };
}

// Canonical hidden stems (client doc §4). Duplicated here on purpose: fixtures must not depend on
// the WS2 implementation they are used to check.
const HIDDEN = {
  子: ['癸'],
  丑: ['己', '癸', '辛'],
  寅: ['甲', '丙', '戊'],
  卯: ['乙'],
  辰: ['戊', '乙', '癸'],
  巳: ['丙', '戊', '庚'],
  午: ['丁', '己'],
  未: ['己', '丁', '乙'],
  申: ['庚', '壬', '戊'],
  酉: ['辛'],
  戌: ['戊', '辛', '丁'],
  亥: ['壬', '甲'],
} as const;

const LUCK: Array<[string, TenGod, string]> = [
  ['己未', 'DW', 'DW HO RW'],
  ['戊午', 'IW', 'HO DW'],
  ['丁巳', 'HO', 'EG IW 7K'],
  ['丙辰', 'EG', 'IW RW DR'],
  ['乙卯', 'RW', 'RW'],
  ['甲寅', 'F', 'F EG IW'],
  ['癸丑', 'DR', 'DW DR DO'],
  ['壬子', 'IR', 'DR'],
];

const MONTHS: Array<[string, TenGod, string, string, LifeStage]> = [
  ['庚寅', '7K', 'F EG IW', '2026-02-04T04:02:08+08:00', 'thriving'],
  ['辛卯', 'DO', 'RW', '2026-03-05T21:59:00+08:00', 'prosperous'],
  ['壬辰', 'IR', 'IW RW DR', '2026-04-05T02:40:00+08:00', 'weakening'],
  ['癸巳', 'DR', 'EG IW 7K', '2026-05-05T19:48:44+08:00', 'sickness'],
  ['甲午', 'F', 'HO DW', '2026-06-05T23:48:21+08:00', 'death'],
  ['乙未', 'RW', 'DW HO RW', '2026-07-07T09:56:57+08:00', 'grave'],
  ['丙申', 'EG', '7K IR IW', '2026-08-07T19:42:43+08:00', 'extinction'],
  ['丁酉', 'HO', 'DO', '2026-09-07T22:41:16+08:00', 'conceived'],
  ['戊戌', 'IW', 'IW DO HO', '2026-10-08T14:29:17+08:00', 'nourishing'],
  ['己亥', 'DW', 'IR F', '2026-11-07T17:52:05+08:00', 'growth'],
  ['庚子', '7K', 'DR', '2026-12-07T10:52:32+08:00', 'bath'],
  ['辛丑', 'DO', 'DW DR DO', '2027-01-05T22:09:58+08:00', 'youth'],
];

export const EXAMPLE_A_CHART: ChartResult = {
  schemaVersion: 1,
  input: { date: '1988-09-06', time: { kind: 'exact', time: '01:30' }, gender: 'F' },
  settings: DEFAULT_SETTINGS,
  pillars: {
    year: p('戊辰', 'IW', 'IW RW DR'),
    month: p('庚申', '7K', '7K IR IW'),
    day: p('甲子', null, 'DR'),
    hour: p('乙丑', 'RW', 'DW DR DO'),
  },
  dayMaster: '甲',
  voids: ['戌', '亥'],
  luck: {
    direction: 'backward',
    start: { years: 9, months: 9, days: 20 },
    pillars: LUCK.map(([gz, god, hidden], i) => ({
      ...p(gz, god, hidden),
      startAge: 9 + 10 * i,
      startYear: 1998 + 10 * i,
    })),
  },
  annual: { ...p('丙午', 'EG', 'HO DW'), year: 2026 },
  monthly: MONTHS.map(([gz, god, hidden, starts, lifeStage]) => ({
    ...p(gz, god, hidden, gz.endsWith('戌') || gz.endsWith('亥')),
    month: Number(starts.slice(5, 7)),
    starts,
    lifeStage,
  })),
  supporting: {
    celestialAnimal: '辰',
    noblePeople: ['丑', '未'],
    intelligence: '巳',
    peachBlossom: '酉',
    skyHorse: '寅',
    solitary: '寅',
    lifePalace: parseGanZhi('己未'),
    conceptionPalace: parseGanZhi('辛亥'),
  },
  gua: {
    number: 3,
    trigram: '震',
    group: 'east',
    lifeStar: 3,
    directions: {
      shengQi: 'S',
      tianYi: 'N',
      yanNian: 'SE',
      fuWei: 'E',
      huoHai: 'SW',
      wuGui: 'NW',
      liuSha: 'NE',
      jueMing: 'W',
    },
  },
  relationships: [
    {
      kind: 'three-harmony',
      between: ['year', 'month', 'day'],
      chars: ['辰', '申', '子'],
      resultElement: 'water',
    },
    {
      kind: 'six-combination',
      between: ['day', 'hour'],
      chars: ['子', '丑'],
      resultElement: 'earth',
    },
    {
      kind: 'stem-combination',
      between: ['month', 'hour'],
      chars: ['庚', '乙'],
      resultElement: 'metal',
    },
    { kind: 'stem-clash', between: ['day', 'month'], chars: ['甲', '庚'] },
    { kind: 'clash', between: ['day', 'annual'], chars: ['子', '午'] },
    { kind: 'harm', between: ['hour', 'annual'], chars: ['丑', '午'] },
  ],
  profiles: null,
  aspects: null,
  warnings: [],
};
