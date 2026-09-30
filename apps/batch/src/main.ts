/**
 * WS8 — Drive inbox → engine → PDF → email, running in Ray's own Google account.
 * Owner: Jia Jun · Backup: Jia Rui (CD1 report §8). Flow: CD1 report §7.2 / proposal §5.1.
 *
 * Run once from the Apps Script editor: `setup` (creates Drive › Bazi Tool › Inbox/Processing/
 * Processed/Output and a 5-minute trigger), then `selfTest` (spike S2, Apps Script half).
 *
 * UNTESTED against a live account — the scaffold only guarantees it type-checks and bundles.
 * Still to do (WS8): resumable batches (6-minute execution limit), a run-log sheet, S3 rendering,
 * S7 reading .xlsx files.
 */
import { computeChart, libraryCheck, todo } from '@bazi/engine';
import { renderChartPdf } from './render';
import { parseRows, type ClientRow, type RejectedRow } from './rows';

const ROOT = 'Bazi Tool';
const FOLDERS = ['Inbox', 'Processing', 'Processed', 'Output'] as const;
type FolderName = (typeof FOLDERS)[number];

const props = () => PropertiesService.getScriptProperties();

export function setup(): void {
  const root = findOrCreate(DriveApp.getRootFolder(), ROOT);
  for (const name of FOLDERS)
    props().setProperty(`FOLDER_${name}`, findOrCreate(root, name).getId());
  props().setProperty('NOTIFY_EMAIL', Session.getEffectiveUser().getEmail());

  for (const t of ScriptApp.getProjectTriggers()) {
    if (t.getHandlerFunction() === 'processInbox') ScriptApp.deleteTrigger(t);
  }
  ScriptApp.newTrigger('processInbox').timeBased().everyMinutes(5).create();
  Logger.log(`Ready. Drop client files into Drive › ${ROOT} › Inbox.`);
}

export function selfTest(): void {
  Logger.log(JSON.stringify(libraryCheck()));
}

export function processInbox(): void {
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(1000)) return; // the previous run is still working
  try {
    const files = folder('Inbox').getFiles();
    while (files.hasNext()) processFile(files.next());
  } finally {
    lock.releaseLock();
  }
}

function processFile(file: GoogleAppsScript.Drive.File): void {
  file.moveTo(folder('Processing'));
  const { accepted, rejected } = parseRows(readTable(file));
  const today = Utilities.formatDate(new Date(), 'Asia/Singapore', 'yyyy-MM-dd');
  const output = findOrCreate(folder('Output'), today);

  const pdfs: GoogleAppsScript.Base.Blob[] = [];
  const failed: RejectedRow[] = [...rejected];
  const warnings: string[] = [];
  for (const row of accepted) {
    try {
      const chart = computeChart(row.birth);
      const pdf = renderChartPdf(chart, labelOf(row));
      output.createFile(pdf);
      pdfs.push(pdf);
      for (const w of chart.warnings) warnings.push(`${labelOf(row)}: ${w.message}`);
    } catch (error) {
      failed.push({
        rowNumber: row.rowNumber,
        reason: error instanceof Error ? error.message : String(error),
      });
    }
  }

  sendSummary(file.getName(), pdfs, failed, warnings);
  file.moveTo(folder('Processed'));
}

function readTable(file: GoogleAppsScript.Drive.File): string[][] {
  const type = file.getMimeType();
  if (type === MimeType.GOOGLE_SHEETS) {
    return SpreadsheetApp.open(file).getSheets()[0]!.getDataRange().getDisplayValues();
  }
  if (type === MimeType.CSV || type === MimeType.PLAIN_TEXT) {
    return Utilities.parseCsv(file.getBlob().getDataAsString('UTF-8'));
  }
  return todo('WS8', `reading ${type} files — spike S7 (Ray's template is .xlsx)`);
}

function sendSummary(
  fileName: string,
  pdfs: GoogleAppsScript.Base.Blob[],
  failed: RejectedRow[],
  warnings: string[],
): void {
  const list = (items: string[]) =>
    items.length ? `<ul><li>${items.join('</li><li>')}</li></ul>` : '<p>None.</p>';
  MailApp.sendEmail({
    to: props().getProperty('NOTIFY_EMAIL')!,
    subject: `Bazi charts: ${pdfs.length} plotted from ${fileName}`,
    htmlBody: [
      `<p>${pdfs.length} chart(s) attached.</p>`,
      `<h3>Rows not plotted</h3>`,
      list(failed.map((r) => `Row ${r.rowNumber}: ${r.reason}`)),
      `<h3>Check before the consultation</h3>`,
      list(warnings),
    ].join(''),
    attachments: pdfs,
  });
}

function labelOf(row: ClientRow): string {
  return `${row.serial} ${row.lastName} ${row.firstName}`.trim();
}

function folder(name: FolderName): GoogleAppsScript.Drive.Folder {
  const id = props().getProperty(`FOLDER_${name}`);
  if (!id) throw new Error('Run setup() once before processing.');
  return DriveApp.getFolderById(id);
}

function findOrCreate(
  parent: GoogleAppsScript.Drive.Folder,
  name: string,
): GoogleAppsScript.Drive.Folder {
  const existing = parent.getFoldersByName(name);
  return existing.hasNext() ? existing.next() : parent.createFolder(name);
}
