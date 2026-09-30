/**
 * WS8 — turn the cells of Ray's client file into validated engine inputs.
 * Owner: Jia Jun · Backup: Jia Rui (CD1 report §8). Pure TypeScript, so it is unit-tested in
 * Node (test/rows.test.ts) without Apps Script.
 *
 * Template v2 (03_client_materials/CD1_followup2_2026-09-30/Clients_particulars_v2.xlsx): Ray asked
 * for a Gender column and an estimated 2-hour slot column on 30 Sep. The title sits in row 1 and
 * the header in row 3; header cells contain line breaks ("Birth date\n(DD/MM/YYYY)").
 *
 * Rules the specs pin down:
 *  - find the header row by matching the headers (ignore case, spaces and line breaks); columns may move
 *  - accept the v1 template too (no Gender / slot columns) — gender is then null
 *  - skip rows where only the s/n is filled — the template ships with numbered empty rows 1–28
 *  - date DD/MM/YYYY → YYYY-MM-DD; an impossible date rejects THAT ROW with a reason
 *  - hour 'HH:MM', 'H:MM', 'HHMM' or 'HH:MM:SS' → exact time
 *  - no hour but a slot like '23:00-00:59 (Zi)' (the template's dropdown) → slot 子
 *  - no hour and no slot → unknown ("leave both E and G blank", template note)
 *  - both an hour and a slot → the exact hour wins
 *  - one bad row never stops the batch; a file with no recognisable header is an InputError
 */
import { todo, type BirthInput } from '@bazi/engine';

/** Header row of template v1 (Clients_particulars.xlsx, 26 Sep), line breaks removed. */
export const TEMPLATE_HEADERS = [
  's/n',
  'Client name (last name)',
  'Client name (first name)',
  'Birth date (DD/MM/YYYY)',
  'Birth hour (24-hour format)',
] as const;

/** Columns added in template v2 (30 Sep), line breaks removed. */
export const TEMPLATE_V2_HEADERS = [
  ...TEMPLATE_HEADERS,
  'Gender (M/F)',
  'Estimated birth hour (2-hour slot, if exact hour not known)',
] as const;

/** The v2 template's slot dropdown ('Lists' sheet), in branch order 子 … 亥. */
export const SLOT_OPTIONS = [
  '23:00-00:59 (Zi)',
  '01:00-02:59 (Chou)',
  '03:00-04:59 (Yin)',
  '05:00-06:59 (Mao)',
  '07:00-08:59 (Chen)',
  '09:00-10:59 (Si)',
  '11:00-12:59 (Wu)',
  '13:00-14:59 (Wei)',
  '15:00-16:59 (Shen)',
  '17:00-18:59 (You)',
  '19:00-20:59 (Xu)',
  '21:00-22:59 (Hai)',
] as const;

export interface ClientRow {
  /** 1-based row number in the sheet, so Ray can find it. */
  rowNumber: number;
  serial: string;
  lastName: string;
  firstName: string;
  birth: BirthInput;
}

export interface RejectedRow {
  rowNumber: number;
  reason: string;
}

export interface ParsedBatch {
  accepted: ClientRow[];
  rejected: RejectedRow[];
}

export function parseRows(table: string[][]): ParsedBatch {
  return todo('WS8', `parseRows(${table.length} rows)`);
}
