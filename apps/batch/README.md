# apps/batch — Drive inbox → charts by email (WS8)

Runs as **Google Apps Script inside Ray's own Google account**, so client data never leaves it. During
development, use a **team test Google account** — never Ray's — and synthetic client rows only.

## Flow

```
Ray drops a file in  Drive › Bazi Tool › Inbox
      │  (time trigger every 5 min; a lock prevents overlapping runs)
      ▼
move to Processing → parseRows (validate each row; bad rows are listed, never fatal)
      → computeChart (same engine as the web app) → renderChartPdf (spike S3)
      → save PDFs to Output/<yyyy-MM-dd> → one email to Ray: PDFs + rejected rows + warnings
      → move the file to Processed
```

## Input file — template v2

`03_client_materials/CD1_followup2_2026-09-30/Clients_particulars_v2.xlsx`: title in row 1, headers in row 3,
numbered rows 1–28. Columns: `s/n`, last name, first name, birth date (DD/MM/YYYY), birth hour (24-hour),
**Gender (M/F)** and **Estimated birth hour (2-hour slot)**, both added on 30 Sep at Ray's request. The slot
column is a dropdown fed from the `Lists` sheet (`23:00-00:59 (Zi)` … `21:00-22:59 (Hai)`). Both hour and slot
blank means "hour unknown". The parser also accepts the old v1 layout (gender then comes out as null).
**Waiting on Ray** to confirm the slot format (RC-08).

## First deployment (test account)

```bash
npm run build -w @bazi/batch                  # → apps/batch/dist/Code.js + appsscript.json
npx @google/clasp login                       # opens a browser; sign in to the TEST account
npx @google/clasp create-script --type standalone --title "Bazi Tool" --rootDir dist   # clasp 2.x: `create`
#   → move the generated .clasp.json from dist/ to apps/batch/ (it is git-ignored),
#     or copy .clasp.json.example and paste the script ID
npm run push -w @bazi/batch                   # build + clasp push
```

Then, in the Apps Script editor: run **`selfTest`** (spike S2 — the log must show `"ok":true`), then
**`setup`** once (creates the folders and the trigger, and asks for permissions).

## Permissions (`appsscript.json`)

| Scope | Why |
|---|---|
| `drive` | Read files Ray drops in the Inbox and move them between folders (the narrower `drive.file` can't see files he uploads himself) |
| `spreadsheets.readonly` | Read a Google Sheet client file |
| `script.send_mail` | Email the charts to Ray (MailApp) |
| `script.scriptapp` | Create the 5-minute trigger |
| `userinfo.email` | Send the summary to the account owner, i.e. Ray |

## Still to build (WS8)

- `src/rows.ts` `parseRows` — the specs in `test/rows.test.ts` define the behaviour
- `src/render.ts` — spike S3 decides the route
- Reading `.xlsx` — spike S7
- Resumable batches: an execution stops after about 6 minutes, so save progress and continue on the next trigger
- A run-log sheet (date, file, plotted, rejected)
