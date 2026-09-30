/**
 * ChartResult v1 — the ONE data format shared by the engine, the web app (WS7) and the Drive
 * automation (WS8). Owner: WS1, agreed with WS7 + WS8 (spike S1, due 2 Oct). Reviewed by WS10.
 *
 * Rules (see docs/chart-result.md for the reasoning):
 *  - Characters are the identifiers: '甲', '子', never translated strings. Labels come from core/terms.
 *  - Hidden stems are stored in CANONICAL order (main, middle, residual). Display order is a UI setting.
 *  - Anything that changes this file needs a PR reviewed by the WS7 and WS8 owners, and bumps
 *    `schemaVersion` if an existing field changes meaning.
 */
import type {
  AspectId,
  Branch,
  Element,
  GanZhi,
  LifeStage,
  Stem,
  StructureId,
  TenGod,
  Trigram,
} from './core';

// ── Input ────────────────────────────────────────────────────────────────────

export type Gender = 'M' | 'F';

export type BirthTime =
  /** Recorded clock time, 24-hour 'HH:MM', as on the birth certificate. */
  | { kind: 'exact'; time: string }
  /** The client only knows the two-hour slot (Ray's form allows this). */
  | { kind: 'slot'; branch: Branch }
  /** The client does not know. Ray considers such charts unreliable — the result carries a warning. */
  | { kind: 'unknown' };

export interface BirthInput {
  /** Local civil date as recorded, 'YYYY-MM-DD'. */
  date: string;
  time: BirthTime;
  /** Needed for the luck-pillar direction. null → luck pillars are omitted with GENDER_MISSING. */
  gender: Gender | null;
  /** '+08:00'. Omitted → derived from the date (Singapore used +07:30 before 1982; see conventions.md). */
  utcOffset?: string;
}

// ── Conventions ──────────────────────────────────────────────────────────────

/** Points on which schools differ. Defaults live in settings.ts with the source of each. */
export interface Settings {
  /**
   * Births 23:00–23:59 (the late 子 hour).
   * 'split' — CONFIRMED for Ray (Determining_Hour Pillar.docx): the day pillar stays on the calendar
   *   date, the hour stem is taken from the NEXT day's stem (lunar-javascript sect 2).
   * 'next-day' — the whole chart moves to the next day from 23:00 (lunar-javascript sect 1).
   */
  lateZiHour: 'split' | 'next-day';
  timeBasis: 'clock' | 'true-solar';
  /**
   * Old records kept on a different clock (Singapore/Malaysia used UTC+7:30 until 1982).
   * 'ignore' — read the recorded time as UTC+8, as the reference plotter does (it never asks for a
   *   birthplace; the 1978 chart in Determining_Hour Pillar.docx only matches this way).
   * 'apply' — convert from the historical Singapore offset first.
   * An explicit `BirthInput.utcOffset` always wins.
   */
  historicalUtcOffset: 'ignore' | 'apply';
  /** How the UI lays out hidden stems. The engine always stores canonical order. */
  hiddenStemDisplay: 'canonical' | 'residual-main-middle';
  /** lunar-javascript getYun sect 1 (days ÷ 3) or 2 (minute-based). */
  luckStartMethod: 'days-div-3' | 'minutes';
  /** Ray's charts show real ages; lunar-javascript reports nominal (虚岁) ages. */
  ageReckoning: 'real' | 'nominal';
  /**
   * 'bazi-year' — 寅 month (Li Chun, ~4 Feb) to 丑 month (~5 Jan next year), as on the Joey Yap
   *   sample charts ("FEB 4 … JAN 5 (2027)"). 'calendar-year' — Jan to Dec, as on Ray's deck slide.
   */
  monthStripSpan: 'bazi-year' | 'calendar-year';
}

// ── Output ───────────────────────────────────────────────────────────────────

export type Qi = 'main' | 'middle' | 'residual';

export interface HiddenStem {
  stem: Stem;
  qi: Qi;
  god: TenGod;
}

export interface Pillar extends GanZhi {
  /** Ten God of the stem relative to the Day Master; null only on the day pillar (it IS the Day Master). */
  stemGod: TenGod | null;
  /** Canonical order: main, middle, residual. */
  hidden: HiddenStem[];
  /** True when this branch is one of the chart's 空亡 (void / Death & Emptiness) pair. */
  void: boolean;
}

export type PillarPosition = 'year' | 'month' | 'day' | 'hour';

export interface LuckPillar extends Pillar {
  /** Age at which this pillar begins, in `settings.ageReckoning`. */
  startAge: number;
  startYear: number;
}

export interface LuckCycle {
  direction: 'forward' | 'backward';
  /** Time from birth to the first luck pillar. */
  start: { years: number; months: number; days: number };
  /** Chronological order. The UI draws them right → left (Ray, CD1 minutes §2.7). */
  pillars: LuckPillar[];
}

export interface AnnualPillar extends Pillar {
  year: number;
}

export interface MonthPillar extends Pillar {
  /** Gregorian month (1–12) in which this solar month begins. */
  month: number;
  /** ISO 8601 instant of the 节 (jie) solar term that starts it. */
  starts: string;
  /** The Day Master's 十二长生 stage in this month's branch (shown on the reference month strip). */
  lifeStage: LifeStage;
}

/** Ray's "Personal Chart Details" panel — eight lookups (reference charts, 30 Sep). */
export interface SupportingDetails {
  celestialAnimal: Branch;
  noblePeople: Branch[];
  intelligence: Branch;
  peachBlossom: Branch;
  skyHorse: Branch;
  /** 孤辰. Both reference charts take it from the DAY branch, not the year branch. */
  solitary: Branch;
  /** 命宫 */
  lifePalace: GanZhi;
  /** 胎元 */
  conceptionPalace: GanZhi;
}

export type Direction = 'N' | 'NE' | 'E' | 'SE' | 'S' | 'SW' | 'W' | 'NW';
export type Mansion =
  'shengQi' | 'tianYi' | 'yanNian' | 'fuWei' | 'huoHai' | 'wuGui' | 'liuSha' | 'jueMing';

/** Life Gua (命卦), Life Star and the eight direction sectors — REQUESTED by Ray on 30 Sep (RC-05). */
export interface LifeGua {
  /** 1–9, never 5 (a 5 becomes 2 for men and 8 for women). */
  number: number;
  trigram: Trigram;
  group: 'east' | 'west';
  /** Nine-star name of the Gua number, e.g. 3 → 三碧 Jade, Wood (labels in core/terms.ts). */
  lifeStar: number;
  /** shengQi, tianYi, yanNian, fuWei are favourable; the other four unfavourable. */
  directions: Record<Mansion, Direction>;
}

/** The "6 Aspects" bar chart, natal and annual — REQUESTED on 30 Sep; method unknown (RC-06, R11). */
export interface SixAspects {
  model: string;
  natal: Record<AspectId, number>;
  annual: Record<AspectId, number> | null;
}

export type RelationshipKind =
  | 'clash'
  | 'harm'
  | 'punishment'
  | 'self-punishment'
  | 'destruction'
  | 'six-combination'
  | 'three-harmony'
  | 'half-three-harmony'
  | 'directional-combination'
  | 'stem-combination'
  | 'stem-clash';

/** 'luck' = the luck pillar in force during the annual year shown. */
export type RelationshipScope = PillarPosition | 'luck' | 'annual';

export interface Relationship {
  kind: RelationshipKind;
  between: RelationshipScope[];
  chars: Array<Stem | Branch>;
  /** Element produced, for combinations that transform. */
  resultElement?: Element;
}

export interface ProfileSet {
  /** 0–100 per Ten God; the strongest is 100 on Ray's reference plotter. */
  tenGods: Record<TenGod, number>;
  structures: Record<StructureId, number>;
  mainStructure: StructureId;
  mainProfile: TenGod;
}

export interface Profiles {
  /** Identifies the model version (WS3), so a chart can be traced back to the model that scored it. */
  model: string;
  natal: ProfileSet;
  /**
   * Ray's reference shows natal AND annual (e.g. "Annual 2026") percentages. Lead from the samples:
   * the annual set seems to include the current luck pillar as well as the annual pillar.
   */
  annual: ProfileSet | null;
}

export type WarningCode =
  | 'HOUR_UNKNOWN'
  | 'HOUR_SLOT_ONLY'
  | 'GENDER_MISSING'
  | 'NEAR_LI_CHUN'
  | 'NEAR_SOLAR_TERM'
  | 'NEAR_DAY_BOUNDARY'
  | 'NEAR_HOUR_BOUNDARY'
  | 'HISTORICAL_UTC_OFFSET';

export interface ChartWarning {
  code: WarningCode;
  message: string;
  /** Distance to the boundary, for the NEAR_* codes. */
  minutes?: number;
}

export interface ChartResult {
  schemaVersion: 1;
  input: BirthInput;
  settings: Settings;
  pillars: Record<Exclude<PillarPosition, 'hour'>, Pillar> & { hour: Pillar | null };
  dayMaster: Stem;
  /** The two 空亡 branches, from the day pillar's 旬 (Determining_DE.docx). */
  voids: [Branch, Branch];
  luck: LuckCycle | null;
  annual: AnnualPillar;
  /** The 12 solar months of the annual year (Ray's month strip). */
  monthly: MonthPillar[];
  supporting: SupportingDetails;
  /** null when gender is missing — the Gua formula differs for men and women. */
  gua: LifeGua | null;
  relationships: Relationship[];
  /** null until the WS3 model is accepted. */
  profiles: Profiles | null;
  /** null until a model is found (WS3 + WS9). */
  aspects: SixAspects | null;
  warnings: ChartWarning[];
}

export interface ChartOptions {
  settings?: Partial<Settings>;
  /** Year for the annual pillar and month strip. Default: the current year. */
  annualYear?: number;
}
