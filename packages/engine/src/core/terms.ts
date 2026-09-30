/**
 * Ten Gods (十神 — Ray calls them the "10 Profiles") and the Five Structures, as identifiers plus
 * their EN / 中文 / Pinyin labels. Codes and English names follow Ray's deck
 * ("Project_Bazi_plotting_tool.pdf" p.8) so the UI matches what he reads today.
 *
 * WS2 owns this terms table (tracker: "EN / 中文 / Pinyin terms table"): review the wording with Ray,
 * and add any further labels the UI needs here rather than in the UI.
 *
 * COPYRIGHT: the reference charts come from Joey Yap's software, whose footer claims its charts,
 * designs and TERMINOLOGY ("reproduction … prohibited"). Use classical Chinese terms, common
 * translations, or Ray's own deck wording — never the software's branded labels (e.g. the named
 * profile archetypes). Raise any doubt with the faculty advisor (risk R10).
 */

export const TEN_GODS = ['F', 'RW', 'EG', 'HO', 'DW', 'IW', 'DO', '7K', 'DR', 'IR'] as const;
export type TenGod = (typeof TEN_GODS)[number];

export interface Term {
  en: string;
  zh: string;
  pinyin: string;
}

export const TEN_GOD_TERMS: Record<TenGod, Term> = {
  F: { en: 'Friend', zh: '比肩', pinyin: 'bǐ jiān' },
  RW: { en: 'Rob Wealth', zh: '劫财', pinyin: 'jié cái' },
  EG: { en: 'Eating God', zh: '食神', pinyin: 'shí shén' },
  HO: { en: 'Hurting Officer', zh: '伤官', pinyin: 'shāng guān' },
  DW: { en: 'Direct Wealth', zh: '正财', pinyin: 'zhèng cái' },
  IW: { en: 'Indirect Wealth', zh: '偏财', pinyin: 'piān cái' },
  DO: { en: 'Direct Officer', zh: '正官', pinyin: 'zhèng guān' },
  '7K': { en: '7 Killings', zh: '七杀', pinyin: 'qī shā' },
  DR: { en: 'Direct Resource', zh: '正印', pinyin: 'zhèng yìn' },
  IR: { en: 'Indirect Resource', zh: '偏印', pinyin: 'piān yìn' },
};

export const STRUCTURES = ['self', 'inspiration', 'action', 'discipline', 'knowledge'] as const;
export type StructureId = (typeof STRUCTURES)[number];

/**
 * Which two Ten Gods make up each structure. Inferred from the order in which Ray's deck lists the
 * structures (Connector, Creator, Manager, Leader, Thinker ↔ Self, Inspiration, Action, Discipline,
 * Knowledge) and the traditional grouping. Consistent with the sample charts' radar, where each
 * structure is labelled with the element that plays that role for the Day Master.
 */
export const STRUCTURE_GODS: Record<StructureId, readonly [TenGod, TenGod]> = {
  self: ['F', 'RW'],
  inspiration: ['EG', 'HO'],
  action: ['DW', 'IW'],
  discipline: ['DO', '7K'],
  knowledge: ['DR', 'IR'],
};

export const STRUCTURE_TERMS: Record<StructureId, Term & { archetype: string }> = {
  self: { en: 'Self', zh: '比劫', pinyin: 'bǐ jié', archetype: 'Connector / Networker' },
  inspiration: {
    en: 'Inspiration',
    zh: '食伤',
    pinyin: 'shí shāng',
    archetype: 'Creator / Expressor',
  },
  action: { en: 'Action', zh: '财', pinyin: 'cái', archetype: 'Manager / Executor' },
  discipline: { en: 'Discipline', zh: '官杀', pinyin: 'guān shā', archetype: 'Leader / Regulator' },
  knowledge: { en: 'Knowledge', zh: '印', pinyin: 'yìn', archetype: 'Thinker / Strategist' },
};

export const PILLAR_TERMS = {
  year: { en: 'Year', zh: '年柱', pinyin: 'nián zhù' },
  month: { en: 'Month', zh: '月柱', pinyin: 'yuè zhù' },
  day: { en: 'Day', zh: '日柱', pinyin: 'rì zhù' },
  hour: { en: 'Hour', zh: '时柱', pinyin: 'shí zhù' },
} as const satisfies Record<string, Term>;

/** 十二长生 — the Day Master's twelve life stages, shown per month on the reference month strip. */
export const LIFE_STAGES = [
  'growth',
  'bath',
  'youth',
  'thriving',
  'prosperous',
  'weakening',
  'sickness',
  'death',
  'grave',
  'extinction',
  'conceived',
  'nourishing',
] as const;
export type LifeStage = (typeof LIFE_STAGES)[number];

export const LIFE_STAGE_TERMS: Record<LifeStage, Term> = {
  growth: { en: 'Growth', zh: '长生', pinyin: 'cháng shēng' },
  bath: { en: 'Bath', zh: '沐浴', pinyin: 'mù yù' },
  youth: { en: 'Youth', zh: '冠带', pinyin: 'guān dài' },
  thriving: { en: 'Thriving', zh: '临官', pinyin: 'lín guān' },
  prosperous: { en: 'Prosperous', zh: '帝旺', pinyin: 'dì wàng' },
  weakening: { en: 'Weakening', zh: '衰', pinyin: 'shuāi' },
  sickness: { en: 'Sickness', zh: '病', pinyin: 'bìng' },
  death: { en: 'Death', zh: '死', pinyin: 'sǐ' },
  grave: { en: 'Grave', zh: '墓', pinyin: 'mù' },
  extinction: { en: 'Extinction', zh: '绝', pinyin: 'jué' },
  conceived: { en: 'Conceived', zh: '胎', pinyin: 'tāi' },
  nourishing: { en: 'Nourishing', zh: '养', pinyin: 'yǎng' },
};

/** Life Gua trigrams by Gua number (5 has no trigram of its own). */
export const TRIGRAMS = ['坎', '坤', '震', '巽', '乾', '兑', '艮', '离'] as const;
export type Trigram = (typeof TRIGRAMS)[number];

export const TRIGRAM_BY_NUMBER: Record<number, Trigram> = {
  1: '坎',
  2: '坤',
  3: '震',
  4: '巽',
  6: '乾',
  7: '兑',
  8: '艮',
  9: '离',
};

/** Nine-star names used for the Life Star (the chart shows e.g. "3 Jade 三碧 Wood"). */
export const NINE_STAR_TERMS: Record<number, Term & { element: string }> = {
  1: { en: 'White', zh: '一白', pinyin: 'yī bái', element: 'water' },
  2: { en: 'Black', zh: '二黑', pinyin: 'èr hēi', element: 'earth' },
  3: { en: 'Jade', zh: '三碧', pinyin: 'sān bì', element: 'wood' },
  4: { en: 'Green', zh: '四绿', pinyin: 'sì lǜ', element: 'wood' },
  5: { en: 'Yellow', zh: '五黄', pinyin: 'wǔ huáng', element: 'earth' },
  6: { en: 'White', zh: '六白', pinyin: 'liù bái', element: 'metal' },
  7: { en: 'Red', zh: '七赤', pinyin: 'qī chì', element: 'metal' },
  8: { en: 'White', zh: '八白', pinyin: 'bā bái', element: 'earth' },
  9: { en: 'Purple', zh: '九紫', pinyin: 'jiǔ zǐ', element: 'fire' },
};

/** Eight Mansions sectors: the first four favourable, the last four unfavourable. */
export const MANSION_TERMS = {
  shengQi: { en: 'Life Generating', zh: '生气', pinyin: 'shēng qì' },
  tianYi: { en: 'Heavenly Doctor', zh: '天医', pinyin: 'tiān yī' },
  yanNian: { en: 'Longevity', zh: '延年', pinyin: 'yán nián' },
  fuWei: { en: 'Stability', zh: '伏位', pinyin: 'fú wèi' },
  huoHai: { en: 'Mishaps', zh: '祸害', pinyin: 'huò hài' },
  wuGui: { en: 'Five Ghosts', zh: '五鬼', pinyin: 'wǔ guǐ' },
  liuSha: { en: 'Six Killings', zh: '六煞', pinyin: 'liù shà' },
  jueMing: { en: 'Life Threatening', zh: '绝命', pinyin: 'jué mìng' },
} as const satisfies Record<string, Term>;

/**
 * "6 Aspects" — internal IDs only. The display wording needs Ray's agreement: the English words on
 * the reference chart may count as the software's terminology (see the copyright note above).
 */
export const ASPECTS = [
  'lifePurpose',
  'financial',
  'relationship',
  'family',
  'wellness',
  'contribution',
] as const;
export type AspectId = (typeof ASPECTS)[number];
