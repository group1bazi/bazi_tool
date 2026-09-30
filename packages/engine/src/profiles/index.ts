/**
 * WS3 — Five Structures & Ten Profiles percentages, and the "6 Aspects" chart.
 * Owner: Hanzalah · Backup: Cleavant (CD1 report §8). Works with WS9 on the sample comparison.
 *
 * Both algorithms are unknown (risks R1 and R11). Ray repeated on 30 Sep that the percentages are
 * the critical piece, and asked us to work out the 6 Aspects too. Each exists in a NATAL and an
 * ANNUAL (e.g. 2026) version. The fitting work happens in research/profiles/; only an accepted
 * model is implemented here, tagged with a model id. Until then the chart carries null.
 *
 * Lead from the samples: a Ten God missing from both the natal and the annual pillar can still
 * score above 0 in the annual profile when it sits in the CURRENT LUCK PILLAR — so the annual
 * versions probably take natal + current luck pillar + annual pillar.
 *
 * Done when: test/profiles.test.ts passes AND research/profiles reports the match rate on every
 * sample. Milestone: first hypothesis scored against all 30 samples by 21 Oct.
 */
import type { GanZhi } from '../core';
import type { FourPillars } from '../calendar';
import { todo } from '../errors';
import type { Profiles, SixAspects } from '../types';

export interface TimeContext {
  annual: GanZhi | null;
  /** The luck pillar in force in the annual year. */
  luck: GanZhi | null;
}

export function computeProfiles(natal: FourPillars, context: TimeContext): Profiles | null {
  return todo(
    'WS3',
    `computeProfiles(day master ${natal.day.stem}, annual ${context.annual ? 'yes' : 'no'})`,
  );
}

export function computeAspects(natal: FourPillars, context: TimeContext): SixAspects | null {
  return todo(
    'WS3',
    `computeAspects(day master ${natal.day.stem}, annual ${context.annual ? 'yes' : 'no'})`,
  );
}
