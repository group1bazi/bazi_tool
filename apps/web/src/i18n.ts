import {
  BRANCH_INFO,
  NotImplementedError,
  STEM_INFO,
  TEN_GOD_TERMS,
  type Branch,
  type Stem,
  type TenGod,
  type Term,
} from '@bazi/engine';

/** Label language. Characters are always shown in Chinese — they ARE the chart. */
export type Lang = 'en' | 'zh';

export interface Display {
  lang: Lang;
  pinyin: boolean;
}

export const label = (term: Term, lang: Lang) => (lang === 'zh' ? term.zh : term.en);

/** Short Ten God tag for the grid: '7K' in English (Ray's deck), 七杀 in Chinese. */
export const godTag = (god: TenGod, lang: Lang) => (lang === 'zh' ? TEN_GOD_TERMS[god].zh : god);

export const pinyinOf = (char: Stem | Branch) =>
  char in STEM_INFO ? STEM_INFO[char as Stem].pinyin : BRANCH_INFO[char as Branch].pinyin;

export const elementOf = (char: Stem | Branch) =>
  char in STEM_INFO ? STEM_INFO[char as Stem].element : BRANCH_INFO[char as Branch].element;

/** Call an engine function; while it is still a scaffold stub, fall back instead of crashing the UI. */
export function whenReady<T>(fn: () => T, fallback: T): T {
  try {
    return fn();
  } catch (error) {
    if (error instanceof NotImplementedError) return fallback;
    throw error;
  }
}
