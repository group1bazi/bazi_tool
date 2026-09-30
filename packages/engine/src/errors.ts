export type Workstream =
  'WS1' | 'WS2' | 'WS3' | 'WS4' | 'WS5' | 'WS6' | 'WS7' | 'WS8' | 'WS9' | 'WS10';

/**
 * Thrown by every scaffold stub. The test helper `spec()` turns this into a SKIPPED test,
 * so a workstream's specs switch themselves on as soon as the stub is replaced.
 */
export class NotImplementedError extends Error {
  constructor(
    readonly workstream: Workstream,
    readonly what: string,
  ) {
    super(`${workstream}: ${what} is not implemented yet`);
    this.name = 'NotImplementedError';
  }
}

export function todo(workstream: Workstream, what: string): never {
  throw new NotImplementedError(workstream, what);
}

/** Bad input (malformed date, impossible time). Batch mode reports these per row; it never stops the batch. */
export class InputError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InputError';
  }
}
