/**
 * WS2 specs — hidden stems and Ten Gods. They SKIP until src/stems stops throwing NotImplementedError.
 * Expected values: client doc §4 (hidden-stem table) and the Ten Gods section; display order as
 * on every reference chart (Q4); life stages as on the reference month strip (30 Sep).
 */
import { describe, expect } from 'vitest';
import { BRANCHES, STEMS, type Branch, type LifeStage } from '../src/core';
import { hiddenStems, lifeStage, orderForDisplay, tenGod } from '../src/stems';
import { spec } from './helpers';

const TABLE: Record<Branch, string> = {
  子: '癸',
  丑: '己癸辛',
  寅: '甲丙戊',
  卯: '乙',
  辰: '戊乙癸',
  巳: '丙戊庚',
  午: '丁己',
  未: '己丁乙',
  申: '庚壬戊',
  酉: '辛',
  戌: '戊辛丁',
  亥: '壬甲',
};

// Ray's charts: residual – main – middle, main qi centred. 2-stem branches keep main, middle.
const DISPLAY: Record<Branch, string> = {
  子: '癸',
  丑: '辛己癸',
  寅: '戊甲丙',
  卯: '乙',
  辰: '癸戊乙',
  巳: '庚丙戊',
  午: '丁己',
  未: '乙己丁',
  申: '戊庚壬',
  酉: '辛',
  戌: '丁戊辛',
  亥: '壬甲',
};

const join = (hs: Array<{ stem: string }>) => hs.map((h) => h.stem).join('');

describe('[WS2] hidden stems', () => {
  spec('canonical order for all 12 branches matches the client table', () => {
    for (const b of BRANCHES) expect(join(hiddenStems(b)), b).toBe(TABLE[b]);
  });

  spec('qi labels run main → middle → residual', () => {
    expect(hiddenStems('丑').map((h) => h.qi)).toEqual(['main', 'middle', 'residual']);
    expect(hiddenStems('午').map((h) => h.qi)).toEqual(['main', 'middle']);
    expect(hiddenStems('子').map((h) => h.qi)).toEqual(['main']);
  });

  spec("display order 'residual-main-middle' matches Ray's charts", () => {
    for (const b of BRANCHES) {
      expect(join(orderForDisplay(hiddenStems(b), 'residual-main-middle')), b).toBe(DISPLAY[b]);
    }
  });

  spec("display order 'canonical' leaves the table order", () => {
    for (const b of BRANCHES)
      expect(join(orderForDisplay(hiddenStems(b), 'canonical')), b).toBe(TABLE[b]);
  });
});

describe('[WS2] Ten Gods', () => {
  spec('relative to 甲 (Example A and the client doc)', () => {
    const expected = ['F', 'RW', 'EG', 'HO', 'IW', 'DW', '7K', 'DO', 'IR', 'DR'];
    expect(STEMS.map((s) => tenGod('甲', s))).toEqual(expected);
  });

  spec('relative to 丙 (the Day Master of the month-strip chart)', () => {
    const expected = ['IR', 'DR', 'F', 'RW', 'EG', 'HO', 'IW', 'DW', '7K', 'DO'];
    expect(STEMS.map((s) => tenGod('丙', s))).toEqual(expected);
  });

  spec('relative to 辛 (a yin Day Master, as labelled on the reference profile chart)', () => {
    const expected = ['DW', 'IW', 'DO', '7K', 'DR', 'IR', 'RW', 'F', 'HO', 'EG'];
    expect(STEMS.map((s) => tenGod('辛', s))).toEqual(expected);
  });

  spec('every Day Master sees itself as Friend', () => {
    for (const s of STEMS) expect(tenGod(s, s)).toBe('F');
  });
});

describe('[WS2] 十二长生 life stages (reference month strip)', () => {
  const stages = (dm: '甲' | '辛') =>
    Object.fromEntries(BRANCHES.map((b) => [b, lifeStage(dm, b)])) as Record<Branch, LifeStage>;

  // As labelled on the reference "Monthly Influence" strip: yin stems run BACKWARD.
  spec('辛 (yin metal): 长生 at 子, 帝旺 at 申, 胎 at 寅', () => {
    expect(stages('辛')).toEqual({
      子: 'growth',
      亥: 'bath',
      戌: 'youth',
      酉: 'thriving',
      申: 'prosperous',
      未: 'weakening',
      午: 'sickness',
      巳: 'death',
      辰: 'grave',
      卯: 'extinction',
      寅: 'conceived',
      丑: 'nourishing',
    });
  });

  // Standard table; yang stems run forward.
  spec('甲 (yang wood): 长生 at 亥, 帝旺 at 卯, 墓 at 未', () => {
    expect(stages('甲')).toEqual({
      亥: 'growth',
      子: 'bath',
      丑: 'youth',
      寅: 'thriving',
      卯: 'prosperous',
      辰: 'weakening',
      巳: 'sickness',
      午: 'death',
      未: 'grave',
      申: 'extinction',
      酉: 'conceived',
      戌: 'nourishing',
    });
  });
});
