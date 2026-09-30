# Contributing

## Workflow

1. **Pick a Jira issue** and create its branch from Jira ("Create branch"), so it is named
   `SCRUM-<n>-short-summary` and links back to the issue. Never commit to `main` directly (CD1 report §13).
2. **Commit messages start with the Jira key**: `SCRUM-12 Implement Five Tigers month stem`.
3. **Run `npm run check`** before you push. It runs format, typecheck, tests and build, the same as CI.
4. **Open a PR** using the template, and request review from your workstream's **backup** (README map).
   The backup is the default reviewer, so that no module depends on one person.
5. **Merge** once CI is green and one review approves. Delete the branch.

Changes to `packages/engine/src/types.ts` (ChartResult) need the WS1, WS7 and WS8 owners to approve.

## How the specs work

Every workstream module starts as a stub that calls `todo('WSn', …)`, which throws `NotImplementedError`.
The test helper `spec()` turns that error into a **skipped** test. So:

- CI is green from day one, and the skipped count shows what's left.
- When you replace a stub, **its specs run automatically.** A wrong answer fails as usual.
- **Never delete or weaken a spec to get green.** If you believe a spec's expected value is wrong, say so in
  the PR and cite the source. The values come from Ray's documents or verified calculations, each noted in
  the test file.
- Inside a spec, use `thrownBy(() => …)` instead of `expect(…).toThrow()` — otherwise the stub's error
  gets swallowed and the spec fails instead of skipping.

Add a case: extend the module's `test/*.test.ts`, or add a golden JSON in `packages/engine/fixtures/golden/`
and register it in `fixtures/index.ts`.

## Definition of Done

- [ ] The feature's specs pass; new behaviour has new specs (a boundary case, a Ray sample, or a rule citation)
- [ ] `npm run check` is green locally and in CI
- [ ] Reviewed by the workstream backup
- [ ] Docs updated if behaviour, conventions (`docs/conventions.md`) or the ChartResult changed
- [ ] No real client or sample data anywhere ([data handling](docs/data-handling.md))
- [ ] Jira issue moved to Done, with hours logged (the reports need man-hours)

## Code style

- TypeScript `strict`. Prettier formats everything (`npm run format`). Line length is 100.
- Chinese characters are the identifiers (`'甲'`, `'子'`). Labels come from `core/terms.ts`.
- The engine must stay runtime-neutral: no `node:` imports, no DOM, no Apps Script APIs in `packages/engine/src`.
- Comments explain *why* and cite the source (Ray's doc, a tracker ID, a transcript line) for any Bazi rule.
