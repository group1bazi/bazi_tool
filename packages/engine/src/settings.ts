import type { Settings } from './types';

/**
 * Defaults. Each line cites where the value comes from; "TBC" ones must be confirmed with Ray
 * (tracked in docs/conventions.md) — change the default here, never inside a module.
 */
export const DEFAULT_SETTINGS: Settings = {
  lateZiHour: 'split', // CONFIRMED 30 Sep — Ray's Determining_Hour Pillar.docx (Q3 closed). Sect 2.
  timeBasis: 'clock', // TBC — Q14 still open; his hour table is headed "Local/solar time*".
  historicalUtcOffset: 'ignore', // Reference plotter takes no birthplace; the 1978 chart only fits this way.
  hiddenStemDisplay: 'residual-main-middle', // Main qi centred on every reference chart (1978 chart, samples).
  luckStartMethod: 'days-div-3', // OURS TO CHOOSE — Ray doesn't know the method (30 Sep). Validate on samples.
  ageReckoning: 'real', // TBC — check the displayed luck ages on the 30 samples.
  monthStripSpan: 'bazi-year', // Joey Yap samples run FEB 4 → JAN 5 (next year); Ray's deck slide ran Jan–Dec.
};

export function resolveSettings(overrides: Partial<Settings> = {}): Settings {
  return { ...DEFAULT_SETTINGS, ...overrides };
}
