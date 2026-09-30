# Data handling — what may go into this repository

Client birth data is **personal data** (PDPA; CD1 report §5.5 and §13, risk R5). This repository is shared
across ten people and GitHub, so the rule is simple:

> **Nothing from a real client, and no raw sample chart data, is ever committed** — not in code, tests,
> fixtures, screenshots, issues, PR descriptions or commit messages.

| Material | Where it lives | In the repo? |
|---|---|---|
| Ray's operational client files | Ray's own Google Drive (batch mode) | ❌ Never. The team never receives them. |
| Sample charts 1–30 (PDFs) and the keyed `samples.csv` | Restricted team drive + `research/profiles/data/` (git-ignored) | ❌ Only aggregate results (match rates, model weights) and general rules read off them (e.g. "yin stems run their life stages backward") |
| **Client names printed on the sample PDFs** | Only in the PDFs | ❌ Never keyed, never quoted, never in a screenshot. Refer to a sample by its number |
| Example A, the computation-doc sample and **Ray's 1978 子-hour example** | Ray's own teaching material (deck, computation doc, `Determining_Hour Pillar.docx`); no name attached | ✅ As golden fixtures |
| Synthetic rows (e.g. "Test Alpha", made-up dates) | Tests | ✅ |
| Rule documents (hidden stems, void, hour pillar, harms) | Restricted team drive | Cite them; don't copy them in |
| The client template (`Clients_particulars_v2.xlsx`) | Team drive; Ray's Drive once in use | The *headers* are in the code (`apps/batch/src/rows.ts`); a filled copy never is |

**Copyright (risk R10):** the sample charts are output of Joey Yap's software, whose footer claims copyright in
its charts, designs and terminology. Use them to check our *numbers*. Don't reproduce their layout, wording or
images in the product, the repo or public material. Screenshots of them belong only in internal notes.

**Guard rails already in place**

- `.gitignore` excludes `data/private/`, `research/profiles/data/`, `*.xlsx`, `*.pdf` and `.clasp.json`.
- The PR template asks every author to confirm "no real client or sample data".
- `samples.test.ts` reads the private CSV only if it exists locally, so CI never needs it.

**At handover** (CD6): delete every local copy of the samples, and the restricted-drive copies too, as
report §13 commits us to. The Apps Script project and its data already belong to Ray's account.

**If something slips in:** tell the Scrum Master straight away. Deleting the file in a new commit is not
enough, because it stays in the git history — the history has to be rewritten and GitHub asked to purge caches.
