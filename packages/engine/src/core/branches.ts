/**
 * The twelve Earthly Branches (地支). Source: "Computing Elements of Bazi Chart" §3 (client document).
 * The element here is the branch's primary element only — the full picture is its Hidden Stems (WS2).
 */
import type { Element, Polarity } from './stems';

export const BRANCHES = [
  '子',
  '丑',
  '寅',
  '卯',
  '辰',
  '巳',
  '午',
  '未',
  '申',
  '酉',
  '戌',
  '亥',
] as const;
export type Branch = (typeof BRANCHES)[number];

export interface BranchInfo {
  char: Branch;
  pinyin: string;
  animal: string;
  element: Element;
  polarity: Polarity;
}

const PINYIN = ['zǐ', 'chǒu', 'yín', 'mǎo', 'chén', 'sì', 'wǔ', 'wèi', 'shēn', 'yǒu', 'xū', 'hài'];
const ANIMALS = [
  'Rat',
  'Ox',
  'Tiger',
  'Rabbit',
  'Dragon',
  'Snake',
  'Horse',
  'Goat',
  'Monkey',
  'Rooster',
  'Dog',
  'Pig',
];
const ELEMENTS: Element[] = [
  'water',
  'earth',
  'wood',
  'wood',
  'earth',
  'fire',
  'fire',
  'earth',
  'metal',
  'metal',
  'earth',
  'water',
];

export const BRANCH_INFO: Record<Branch, BranchInfo> = Object.fromEntries(
  BRANCHES.map((char, i) => [
    char,
    {
      char,
      pinyin: PINYIN[i]!,
      animal: ANIMALS[i]!,
      element: ELEMENTS[i]!,
      polarity: i % 2 === 0 ? 'yang' : 'yin',
    },
  ]),
) as Record<Branch, BranchInfo>;

export function isBranch(value: string): value is Branch {
  return (BRANCHES as readonly string[]).includes(value);
}

export function branchIndex(branch: Branch): number {
  return BRANCHES.indexOf(branch);
}
