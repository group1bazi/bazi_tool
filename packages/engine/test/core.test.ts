import { describe, expect, it } from 'vitest';
import {
  BRANCH_INFO,
  STEM_INFO,
  STRUCTURE_GODS,
  TEN_GODS,
  formatGanZhi,
  ganZhiFromIndex,
  ganZhiIndex,
  parseGanZhi,
} from '../src/core';

describe('core vocabulary (client doc §2–§5)', () => {
  it('stems alternate yang/yin and pair up by element', () => {
    expect(STEM_INFO['甲']).toMatchObject({ element: 'wood', polarity: 'yang', pinyin: 'jiǎ' });
    expect(STEM_INFO['乙']).toMatchObject({ element: 'wood', polarity: 'yin' });
    expect(STEM_INFO['癸']).toMatchObject({ element: 'water', polarity: 'yin' });
  });

  it('branches carry the primary element and animal from the client table', () => {
    expect(BRANCH_INFO['子']).toMatchObject({ animal: 'Rat', element: 'water' });
    expect(BRANCH_INFO['戌']).toMatchObject({ animal: 'Dog', element: 'earth' });
    expect(BRANCH_INFO['亥']).toMatchObject({ animal: 'Pig', element: 'water' });
  });

  it('every Ten God belongs to exactly one structure', () => {
    const grouped = Object.values(STRUCTURE_GODS).flat().sort();
    expect(grouped).toEqual([...TEN_GODS].sort());
  });
});

describe('60 Jia-Zi cycle', () => {
  it('position 11 is 甲戌, as in the client doc', () => {
    expect(formatGanZhi(ganZhiFromIndex(10))).toBe('甲戌');
  });

  it('round-trips all 60 pairs and wraps around', () => {
    for (let i = 0; i < 60; i++) expect(ganZhiIndex(ganZhiFromIndex(i))).toBe(i);
    expect(formatGanZhi(ganZhiFromIndex(60))).toBe('甲子');
    expect(formatGanZhi(ganZhiFromIndex(-1))).toBe('癸亥');
  });

  it('rejects pairs that are not in the cycle', () => {
    expect(() => parseGanZhi('甲丑')).toThrow(/not in the 60/);
    expect(() => parseGanZhi('甲')).toThrow();
    expect(parseGanZhi('戊辰')).toEqual({ stem: '戊', branch: '辰' });
  });
});
