import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { expect, it } from 'vitest';
import { libraryCheck } from '../src/diagnostics';

// Spike S2, Node half: the calendar library loads through our ESM toolchain and agrees with the
// independently verified Example A. The browser half is the footer of the web app; the Apps Script
// half is `selfTest()` in apps/batch.
it('lunar-javascript reproduces Example A in Node', () => {
  const result = libraryCheck();
  expect(result.got).toBe(result.expected);
});

// The same engine code runs in Node (tests), the browser (web app) and Apps Script (batch), so
// src/ must not reach for any one runtime's APIs.
it('engine source uses no Node, DOM or Apps Script APIs', () => {
  const src = fileURLToPath(new URL('../src', import.meta.url));
  const files = (readdirSync(src, { recursive: true }) as string[]).filter((f) =>
    f.endsWith('.ts'),
  );
  const banned =
    /from ['"]node:|\brequire\(|\b(window|document|localStorage|DriveApp|SpreadsheetApp|UrlFetchApp)\./;
  const offenders = files.filter((f) => banned.test(readFileSync(join(src, f), 'utf8')));
  expect(offenders).toEqual([]);
});
