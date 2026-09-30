/**
 * The ten Heavenly Stems (天干). Source: "Computing Elements of Bazi Chart" §2 (client document).
 * Shared vocabulary — every workstream uses these; change only by agreement in a PR.
 */

export const STEMS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'] as const;
export type Stem = (typeof STEMS)[number];

export type Element = 'wood' | 'fire' | 'earth' | 'metal' | 'water';
export type Polarity = 'yang' | 'yin';

export interface StemInfo {
  char: Stem;
  pinyin: string;
  element: Element;
  polarity: Polarity;
}

const ELEMENT_CYCLE: Element[] = ['wood', 'fire', 'earth', 'metal', 'water'];
const PINYIN = ['jiǎ', 'yǐ', 'bǐng', 'dīng', 'wù', 'jǐ', 'gēng', 'xīn', 'rén', 'guǐ'];

export const STEM_INFO: Record<Stem, StemInfo> = Object.fromEntries(
  STEMS.map((char, i) => [
    char,
    {
      char,
      pinyin: PINYIN[i]!,
      element: ELEMENT_CYCLE[Math.floor(i / 2)]!,
      polarity: i % 2 === 0 ? 'yang' : 'yin',
    },
  ]),
) as Record<Stem, StemInfo>;

export function isStem(value: string): value is Stem {
  return (STEMS as readonly string[]).includes(value);
}

export function stemIndex(stem: Stem): number {
  return STEMS.indexOf(stem);
}
