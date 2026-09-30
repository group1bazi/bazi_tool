/**
 * WS6 specs — void markers, personal chart details, Life Gua, boundary warnings. They SKIP until
 * src/lookups stops throwing. Void rule source: Determining_DE.docx (Ray, 26 Sep) — six 旬 groups.
 */
import { describe, expect, it } from 'vitest';
import { formatGanZhi, parseGanZhi } from '../src/core';
import { boundaryWarnings, lifeGua, supportingDetails, voidBranches } from '../src/lookups';
import { DEFAULT_SETTINGS } from '../src/settings';
import type { BirthInput, WarningCode } from '../src/types';
import { natal, spec } from './helpers';

const voids = (day: string) => voidBranches(parseGanZhi(day)).join('');

describe('[WS6] 空亡 — confirmed rule (Determining_DE.docx)', () => {
  spec('each 旬 gives the two branches it never reaches', () => {
    expect(voids('甲子')).toBe('戌亥');
    expect(voids('癸酉')).toBe('戌亥');
    expect(voids('甲戌')).toBe('申酉');
    expect(voids('甲申')).toBe('午未');
    expect(voids('甲午')).toBe('辰巳');
    expect(voids('甲辰')).toBe('寅卯');
    expect(voids('癸亥')).toBe('子丑');
  });

  spec("Ray's worked example: 丙戌 day → 午未", () => {
    expect(voids('丙戌')).toBe('午未');
  });
});

describe('[WS6] personal chart details', () => {
  spec("Example A's panel: 龍 / 丑 未 / 巳 / 酉 / 寅 (tracker V-17)", () => {
    const s = supportingDetails(natal('戊辰 庚申 甲子 乙丑'));
    expect(s.celestialAnimal).toBe('辰');
    expect([...s.noblePeople].sort()).toEqual(['丑', '未']);
    expect(s.intelligence).toBe('巳');
    expect(s.peachBlossom).toBe('酉');
    expect(s.skyHorse).toBe('寅');
  });

  // Read off Ray's natal-layout chart for Example A (client_chart_natal_layout.png).
  // CONFLICT (30 Sep): 己未 fits (16 − month − hour) mod 12, but all 30 sample charts fit
  // (17 − month − hour) mod 12, which gives 庚申 here. Ask Ray which build he uses (conventions.md).
  spec("Example A's extra details: Solitary 寅, Life Palace 己未, Conception Palace 辛亥", () => {
    const s = supportingDetails(natal('戊辰 庚申 甲子 乙丑'));
    expect(s.solitary).toBe('寅');
    expect(formatGanZhi(s.lifePalace)).toBe('己未');
    expect(formatGanZhi(s.conceptionPalace)).toBe('辛亥');
  });

  // CONFIRMED on the 30 samples (30 Sep): 孤辰, 桃花 and 驛馬 all follow the DAY branch. Here the day
  // branch 巳 and the year branch 子 give different answers (the year would give 寅 / 酉 / 寅).
  spec('Solitary, Peach Blossom and Sky Horse are taken from the day branch', () => {
    const s = supportingDetails(natal('甲子 丙寅 丁巳 庚子'));
    expect(s.solitary).toBe('申');
    expect(s.peachBlossom).toBe('午');
    expect(s.skyHorse).toBe('亥');
  });

  it.todo(
    '[WS6] Life Palace branch: settle the samples (17 − month − hour) vs Example A (16 − month − hour) with Ray',
  );

  spec('Conception Palace = month stem + 1, month branch + 3', () => {
    expect(formatGanZhi(supportingDetails(natal('甲子 丙寅 丁巳 庚子')).conceptionPalace)).toBe(
      '丁巳',
    );
  });
});

// RC-05 (30 Sep): Gua, Life Star and the 8 directions are now requested.
describe('[WS6] Life Gua', () => {
  const born = (date: string, gender: 'M' | 'F' | null): BirthInput => ({
    date,
    time: { kind: 'exact', time: '12:00' },
    gender,
  });

  spec("Example A (1988, female) → 3 震, East group, as on Ray's chart", () => {
    expect(lifeGua(born('1988-09-06', 'F'))).toEqual({
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
    });
  });

  // Direction table for 坤 as printed on a reference sample chart.
  spec('1996 female → 2 坤, West group', () => {
    expect(lifeGua(born('1996-06-01', 'F'))).toEqual({
      number: 2,
      trigram: '坤',
      group: 'west',
      lifeStar: 2,
      directions: {
        shengQi: 'NE',
        tianYi: 'W',
        yanNian: 'NW',
        fuWei: 'SW',
        huoHai: 'E',
        wuGui: 'SE',
        liuSha: 'S',
        jueMing: 'N',
      },
    });
  });

  spec(
    'men and women use different formulas; a 5 becomes 2 (M) or 8 (F); post-2000 changes',
    () => {
      expect(lifeGua(born('1996-06-01', 'M'))?.trigram).toBe('巽'); // 4
      expect(lifeGua(born('1995-06-01', 'M'))?.number).toBe(2); // 5 → 2 for men
      expect(lifeGua(born('2004-06-01', 'F'))?.trigram).toBe('坎'); // 1
    },
  );

  // CONFIRMED on 7 samples (30 Sep): the trigram becomes 坤 / 艮 but the Life Star stays 5 (五黃).
  spec('a 5 keeps Life Star 5', () => {
    expect(lifeGua(born('1995-06-01', 'M'))?.lifeStar).toBe(5);
  });

  // CONFIRMED on the 30 samples (30 Sep): the Gua year changes on a fixed 4 Feb. In 1980 Li Chun fell
  // on 5 Feb, yet 4 Feb already counts as 1980 (men: 1980 → 2 坤, 1979 → 3 震).
  spec('the Gua year changes on 4 Feb, not at Li Chun', () => {
    expect(lifeGua(born('1980-02-04', 'M'))?.trigram).toBe('坤');
    expect(lifeGua(born('1980-02-03', 'M'))?.trigram).toBe('震');
  });

  spec('no gender → no Gua', () => {
    expect(lifeGua(born('1988-09-06', null))).toBeNull();
  });
});

describe('[WS6] warnings', () => {
  const base: BirthInput = {
    date: '1988-09-06',
    time: { kind: 'exact', time: '01:30' },
    gender: 'F',
  };
  const codes = (input: BirthInput): WarningCode[] =>
    boundaryWarnings(input, DEFAULT_SETTINGS).map((w) => w.code);

  spec('unknown hour, slot-only hour and missing gender are flagged', () => {
    expect(codes({ ...base, time: { kind: 'unknown' } })).toContain('HOUR_UNKNOWN');
    expect(codes({ ...base, time: { kind: 'slot', branch: '丑' } })).toContain('HOUR_SLOT_ONLY');
    expect(codes({ ...base, gender: null })).toContain('GENDER_MISSING');
  });

  spec('12 minutes before Li Chun 2026 (04:02) is flagged', () => {
    const near = boundaryWarnings(
      {
        date: '2026-02-04',
        time: { kind: 'exact', time: '03:50' },
        gender: 'M',
        utcOffset: '+08:00',
      },
      DEFAULT_SETTINGS,
    ).find((w) => w.code === 'NEAR_LI_CHUN');
    expect(near?.minutes).toBe(12);
  });

  spec('Example A is nowhere near a solar term', () => {
    expect(codes(base)).not.toContain('NEAR_LI_CHUN');
    expect(codes(base)).not.toContain('NEAR_SOLAR_TERM');
  });

  // The chart is still plotted on the recorded time (default 'ignore'); the warning says why a
  // corrected chart could differ.
  spec('a pre-1982 birth is flagged for its historical UTC offset', () => {
    expect(codes({ ...base, date: '1975-06-06' })).toContain('HISTORICAL_UTC_OFFSET');
    expect(codes(base)).not.toContain('HISTORICAL_UTC_OFFSET');
  });

  spec('a late-子-hour birth (23:00–23:59) is flagged', () => {
    const late = { ...base, date: '1978-02-03', time: { kind: 'exact', time: '23:59' } } as const;
    expect(codes(late)).toContain('NEAR_DAY_BOUNDARY');
  });
});
