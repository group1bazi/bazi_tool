/**
 * WS8 specs — parsing Ray's client file (template v2). They SKIP until src/rows stops throwing.
 * Names below are synthetic. Never paste real client rows into a test.
 */
import { InputError } from '@bazi/engine';
import { describe, expect } from 'vitest';
import { spec, thrownBy } from '../../../packages/engine/test/helpers';
import { SLOT_OPTIONS, TEMPLATE_HEADERS, TEMPLATE_V2_HEADERS, parseRows } from '../src/rows';

// As the sheet really reads: a title in row 1, a blank row 2, and header cells with line breaks.
const title = ['Particulars of clients for generation of Bazi Chart'];
const header = [
  's/n',
  'Client name (last name)',
  'Client name (first name)',
  'Birth date\n(DD/MM/YYYY)',
  'Birth hour\n(24-hour format)',
  'Gender\n(M/F)',
  'Estimated birth hour\n(2-hour slot, if exact\nhour not known)',
];
const sheet = (...rows: string[][]) => [title, [], header, ...rows];

describe('[WS8] parseRows — template v2', () => {
  spec('parses a valid row, reporting the real sheet row number', () => {
    const { accepted, rejected } = parseRows(
      sheet(['1', 'Test', 'Alpha', '06/09/1988', '01:30', 'F', '']),
    );
    expect(rejected).toEqual([]);
    expect(accepted).toEqual([
      {
        rowNumber: 4,
        serial: '1',
        lastName: 'Test',
        firstName: 'Alpha',
        birth: { date: '1988-09-06', time: { kind: 'exact', time: '01:30' }, gender: 'F' },
      },
    ]);
  });

  spec("skips the template's numbered-but-empty rows", () => {
    const { accepted, rejected } = parseRows(sheet(['1', '', '', '', '', '', ''], ['2']));
    expect(accepted).toEqual([]);
    expect(rejected).toEqual([]);
  });

  spec('rejects an impossible date with a reason and keeps going', () => {
    const { accepted, rejected } = parseRows(
      sheet(
        ['1', 'Test', 'Bravo', '31/02/1990', '10:00', 'M', ''],
        ['2', 'Test', 'Charlie', '15/11/1988', '12:00', 'F', ''],
      ),
    );
    expect(rejected).toHaveLength(1);
    expect(rejected[0]).toMatchObject({ rowNumber: 4, reason: expect.stringMatching(/date/i) });
    expect(accepted.map((r) => r.firstName)).toEqual(['Charlie']);
  });

  spec('accepts common hour spellings', () => {
    const { accepted } = parseRows(
      sheet(
        ['1', 'Test', 'A', '06/09/1988', '1:30', 'F', ''],
        ['2', 'Test', 'B', '06/09/1988', '0130', 'F', ''],
        ['3', 'Test', 'C', '06/09/1988', '01:30:00', 'F', ''],
      ),
    );
    expect(accepted.map((r) => r.birth.time)).toEqual([
      { kind: 'exact', time: '01:30' },
      { kind: 'exact', time: '01:30' },
      { kind: 'exact', time: '01:30' },
    ]);
  });

  spec('slot column: a dropdown value gives a 2-hour slot; both blank means unknown', () => {
    const { accepted } = parseRows(
      sheet(
        ['1', 'Test', 'A', '06/09/1988', '', 'F', SLOT_OPTIONS[0]],
        ['2', 'Test', 'B', '06/09/1988', '', 'F', SLOT_OPTIONS[1]],
        ['3', 'Test', 'C', '06/09/1988', '', 'F', ''],
      ),
    );
    expect(accepted.map((r) => r.birth.time)).toEqual([
      { kind: 'slot', branch: '子' },
      { kind: 'slot', branch: '丑' },
      { kind: 'unknown' },
    ]);
  });

  spec('an exact hour wins over a slot filled in by mistake', () => {
    const { accepted } = parseRows(
      sheet(['1', 'Test', 'A', '06/09/1988', '01:30', 'F', SLOT_OPTIONS[6]]),
    );
    expect(accepted[0]?.birth.time).toEqual({ kind: 'exact', time: '01:30' });
  });

  spec('rejects an hour outside 00:00–23:59 and a gender other than M/F', () => {
    const { rejected } = parseRows(
      sheet(
        ['1', 'Test', 'D', '06/09/1988', '25:10', 'F', ''],
        ['2', 'Test', 'E', '06/09/1988', '10:00', 'X', ''],
      ),
    );
    expect(rejected[0]?.reason).toMatch(/hour|time/i);
    expect(rejected[1]?.reason).toMatch(/gender/i);
  });

  spec(
    'a blank gender is accepted (luck pillars and Gua are then left out, with a warning)',
    () => {
      const { accepted } = parseRows(sheet(['1', 'Test', 'F', '06/09/1988', '10:00', '', '']));
      expect(accepted[0]?.birth.gender).toBeNull();
    },
  );

  spec('columns may be reordered', () => {
    const { accepted } = parseRows([
      [header[5]!, ...header.slice(0, 5), header[6]!],
      ['M', '1', 'Test', 'G', '06/09/1988', '10:00', ''],
    ]);
    expect(accepted[0]?.birth.gender).toBe('M');
  });

  spec('the v1 template (no Gender / slot columns) still parses', () => {
    const { accepted } = parseRows([
      [...TEMPLATE_HEADERS],
      ['1', 'Test', 'H', '06/09/1988', '01:30'],
    ]);
    expect(accepted[0]?.birth).toEqual({
      date: '1988-09-06',
      time: { kind: 'exact', time: '01:30' },
      gender: null,
    });
  });

  spec('a file without the template header is an InputError', () => {
    expect(
      thrownBy(() =>
        parseRows([
          ['name', 'dob'],
          ['x', 'y'],
        ]),
      ),
    ).toBeInstanceOf(InputError);
  });
});

// Keeps the constant honest: the v2 header list is the v1 list plus the two new columns.
describe('[WS8] template constants', () => {
  spec('v2 adds Gender and the slot column', () => {
    expect(TEMPLATE_V2_HEADERS.slice(0, 5)).toEqual([...TEMPLATE_HEADERS]);
    expect(TEMPLATE_V2_HEADERS).toHaveLength(7);
    expect(SLOT_OPTIONS).toHaveLength(12);
  });
});
