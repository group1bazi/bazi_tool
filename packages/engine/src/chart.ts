/**
 * computeChart — glue that assembles one ChartResult from the six workstream modules.
 * Owner: WS10 (integration) · Reviewers: WS1, WS7, WS8. Keep logic OUT of here: if a rule is
 * needed, it belongs in the module that owns it.
 */
import { computePillars } from './calendar';
import type { Branch, GanZhi, Stem } from './core';
import { annualPillar, computeLuck, monthStrip } from './cycles';
import { boundaryWarnings, lifeGua, supportingDetails, voidBranches } from './lookups';
import { computeAspects, computeProfiles } from './profiles';
import { detectRelationships } from './relations';
import { resolveSettings } from './settings';
import { hiddenStems, lifeStage, tenGod } from './stems';
import type { BirthInput, ChartOptions, ChartResult, Pillar } from './types';

export function computeChart(input: BirthInput, options: ChartOptions = {}): ChartResult {
  const settings = resolveSettings(options.settings);
  const annualYear = options.annualYear ?? new Date().getFullYear();

  const natal = computePillars(input, settings);
  const dayMaster = natal.day.stem;
  const voids = voidBranches(natal.day);
  const build = (gz: GanZhi, isDayMaster = false): Pillar =>
    toPillar(gz, dayMaster, voids, isDayMaster);

  const luckRaw = computeLuck(input, natal, settings);
  const luck = luckRaw && {
    ...luckRaw,
    pillars: luckRaw.pillars.map((p) => ({
      ...build(p),
      startAge: p.startAge,
      startYear: p.startYear,
    })),
  };
  // Not .at(-1): the same bundle runs in Apps Script, so stick to long-supported built-ins.
  const currentLuck =
    [...(luckRaw?.pillars ?? [])].reverse().find((p) => p.startYear <= annualYear) ?? null;
  const annualGz = annualPillar(annualYear);
  const context = { annual: annualGz, luck: currentLuck };

  return {
    schemaVersion: 1,
    input,
    settings,
    pillars: {
      year: build(natal.year),
      month: build(natal.month),
      day: build(natal.day, true),
      hour: natal.hour && build(natal.hour),
    },
    dayMaster,
    voids,
    luck,
    annual: { ...build(annualGz), year: annualYear },
    monthly: monthStrip(annualYear, settings.monthStripSpan).map((m) => ({
      ...build(m),
      month: m.month,
      starts: m.starts,
      lifeStage: lifeStage(dayMaster, m.branch),
    })),
    supporting: supportingDetails(natal),
    gua: lifeGua(input),
    relationships: detectRelationships(natal, context),
    profiles: computeProfiles(natal, context),
    aspects: computeAspects(natal, context),
    warnings: [...natal.warnings, ...boundaryWarnings(input, settings)],
  };
}

function toPillar(
  gz: GanZhi,
  dayMaster: Stem,
  voids: [Branch, Branch],
  isDayMaster: boolean,
): Pillar {
  return {
    stem: gz.stem,
    branch: gz.branch,
    stemGod: isDayMaster ? null : tenGod(dayMaster, gz.stem),
    hidden: hiddenStems(gz.branch).map((h) => ({ ...h, god: tenGod(dayMaster, h.stem) })),
    void: voids.includes(gz.branch),
  };
}
