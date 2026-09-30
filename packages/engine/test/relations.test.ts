/**
 * WS5 specs — clash / harmony / punishment detection. They SKIP until src/relations stops throwing.
 * Expected values: standard rule tables. Cite Harms_Punishments.pdf (26 Sep batch) as the rule
 * source when you implement, and add a spec for every rule you take from it.
 */
import { describe, expect } from 'vitest';
import { parseGanZhi } from '../src/core';
import { detectRelationships } from '../src/relations';
import type { Relationship } from '../src/types';
import { natal, spec } from './helpers';

const exampleA = natal('戊辰 庚申 甲子 乙丑');

/** Compare ignoring order of `between`/`chars` and ignoring any extra findings. */
function norm(r: Relationship) {
  return { kind: r.kind, between: [...r.between].sort(), chars: [...r.chars].sort() };
}

describe('[WS5] Example A natal pillars + 2026 annual pillar 丙午', () => {
  spec('finds the standard relationships', () => {
    const found = detectRelationships(exampleA, { annual: parseGanZhi('丙午') }).map(norm);
    const expected: Relationship[] = [
      { kind: 'three-harmony', between: ['year', 'month', 'day'], chars: ['辰', '申', '子'] },
      { kind: 'six-combination', between: ['day', 'hour'], chars: ['子', '丑'] },
      { kind: 'stem-combination', between: ['month', 'hour'], chars: ['庚', '乙'] },
      { kind: 'stem-clash', between: ['day', 'month'], chars: ['甲', '庚'] },
      { kind: 'clash', between: ['day', 'annual'], chars: ['子', '午'] },
      { kind: 'harm', between: ['hour', 'annual'], chars: ['丑', '午'] },
    ];
    expect(found).toEqual(expect.arrayContaining(expected.map(norm)));
  });

  spec('does not invent a self-punishment from a single 辰', () => {
    const found = detectRelationships(exampleA, {});
    expect(found.filter((r) => r.kind === 'self-punishment')).toEqual([]);
  });
});

describe('[WS5] rule coverage', () => {
  spec('self-punishment needs two of the same branch (辰辰, 午午, 酉酉, 亥亥)', () => {
    const found = detectRelationships(natal('壬辰 甲辰 丙子 戊子'), {});
    expect(
      found.some((r) => r.kind === 'self-punishment' && r.chars.every((c) => c === '辰')),
    ).toBe(true);
  });

  spec('子卯 is a punishment', () => {
    const found = detectRelationships(natal('甲子 丁卯 丙子 戊子'), {});
    expect(found.some((r) => r.kind === 'punishment' && r.chars.includes('卯'))).toBe(true);
  });
});
