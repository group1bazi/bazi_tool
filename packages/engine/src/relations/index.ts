/**
 * WS5 — Clash / harmony / punishment detection.
 * Owner: Dave · Backup: Raees (CD1 report §8).
 *
 * Proposed by Group 1 and endorsed by Ray at CD1 (minutes §2.11): clashes, harms, punishments,
 * self-punishments and combinations between the natal pillars, and against the current luck and
 * annual pillars. Presented as a summary view, not only highlighted in place.
 * Rule sources to cite: Harms_Punishments.pdf; Bazi_hidden stems.docx (26 Sep batch) for the
 * Growth / Cardinal / Graveyard branch groups and what a clash does to the hidden stems (e.g. 丑未).
 *
 * Done when: every spec in test/relations.test.ts runs and passes.
 * Milestone: rule tables built and run on Example A against 2026 (21 Oct).
 */
import type { GanZhi } from '../core';
import type { FourPillars } from '../calendar';
import { todo } from '../errors';
import type { Relationship } from '../types';

export function detectRelationships(
  natal: FourPillars,
  extra: { luck?: GanZhi | null; annual?: GanZhi | null } = {},
): Relationship[] {
  return todo(
    'WS5',
    `detectRelationships(${natal.day.stem}${natal.day.branch} day, luck=${!!extra.luck}, annual=${!!extra.annual})`,
  );
}
