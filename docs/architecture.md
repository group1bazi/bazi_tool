# Architecture — one engine, two ways in

Owner: WS10 · Source: CD1 report §7, `Solution_Approach_Proposal.md` §2–§5

```
                        ┌──────────────────────────────────────────────────────────┐
 BirthInput ──────────► │  packages/engine   (@bazi/engine — pure TypeScript)      │ ──► ChartResult v1
 + Settings             │                                                          │     (src/types.ts)
                        │  calendar/  WS1  four pillars, late 子 hour, UTC offset  │
                        │  stems/     WS2  hidden stems, Ten Gods, life stages     │
                        │  profiles/  WS3  Ten Profiles % + 6 Aspects (nat/ann)    │
                        │  cycles/    WS4  luck, annual, monthly pillars           │
                        │  relations/ WS5  clash, harm, punishment, combination    │
                        │  lookups/   WS6  空亡, 8 personal details, Gua, warnings  │
                        │  core/      shared vocabulary · chart.ts  WS10 glue      │
                        │  on top of lunar-javascript (solar terms, 60-day cycle)  │
                        └──────────────┬──────────────────────────┬────────────────┘
                                       │                          │
              ┌────────────────────────▼─────────┐   ┌────────────▼──────────────────────────┐
              │ apps/web  (WS7)                  │   │ apps/batch  (WS8)                      │
              │ React + Vite static app          │   │ Google Apps Script in Ray's account    │
              │ engine runs IN THE BROWSER       │   │ 5-min trigger → Inbox → parseRows →    │
              │ single-client entry, chart view, │   │ computeChart → PDF → email Ray →       │
              │ EN / 中文 / Pinyin, export       │   │ move file to Processed                 │
              └──────────────────────────────────┘   └────────────────────────────────────────┘
```

## Why this shape

- **The screen and the emailed chart can never disagree** — both run the same engine code.
- **No server of our own** to host, pay for or secure. Ray pays nothing (free static host, Apps Script free tier).
- **Client data stays with Ray.** Single mode never leaves his device; batch mode stays in his Google account.
- **Workstreams meet at one interface**, the ChartResult, so they can be built and tested in parallel.

## Rules that keep it working

1. **The engine is runtime-neutral.** It runs in Node (tests), browsers and Apps Script. No `node:` imports,
   no DOM, no Apps Script services in `packages/engine/src` — `test/toolchain.test.ts` enforces this.
   Avoid very new built-ins (e.g. `Array.prototype.at`) — the Apps Script bundle targets ES2019.
2. **The engine is pure.** Same input + settings → same output. The current date only enters through
   `ChartOptions.annualYear`.
3. **Conventions are settings, not code.** Anything schools disagree on lives in `Settings`
   (`src/settings.ts`, documented in `conventions.md`).
4. **One module owns each rule.** `chart.ts` only assembles; it holds no Bazi logic.
5. **No build step for the engine.** Packages import its TypeScript source directly (`exports` → `src/index.ts`);
   Vite bundles it for the web app and esbuild for Apps Script.

## Build outputs

| Command | Output | Deployed to |
|---|---|---|
| `npm run build -w @bazi/web` | `apps/web/dist/` (static files) | Free static host — decided by spike S4 |
| `npm run build -w @bazi/batch` | `apps/batch/dist/Code.js` + `appsscript.json` | Ray's Apps Script project via `clasp push` |

Both bundles are ~540 kB, and lunar-javascript is most of that.

## Decisions log

| Date | Decision | Where |
|---|---|---|
| 23 Sep | One engine, two ways in; Apps Script for batch (n8n as the alternative) | CD1 report §7 |
| 30 Sep | Monorepo with npm workspaces; TypeScript throughout; Vitest; React + Vite for the web app (WS7 may swap it) | This scaffold |
| 30 Sep | Specs skip until implemented (`NotImplementedError`), so CI stays green while showing progress | `packages/engine/test/helpers.ts` |
| 30 Sep | Late 子 hour = lunar-javascript sect 2 (confirmed by Ray); no historical UTC offset by default (matches the reference) | `settings.ts`, `conventions.md` |
| 30 Sep | Gua / Life Star / 8 directions and the 8 personal details added (RC-01); 6 Aspects slot reserved (RC-02) | `types.ts`, `requirements-changes.md` |
| 30 Sep | The sample charts double as a validation set for every workstream, not only the percentages | `test/samples.test.ts` |
