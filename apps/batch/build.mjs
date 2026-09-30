// Bundles src/main.ts + the engine + lunar-javascript into ONE file Apps Script can run.
// Output: dist/Code.js and dist/appsscript.json — `clasp push` uploads the dist folder.
import { copyFileSync, mkdirSync } from 'node:fs';
import { build } from 'esbuild';

// Apps Script only calls top-level functions (triggers, the editor's Run menu),
// so these forward into the bundle's namespace.
const entryPoints = `
function setup() { BaziBatch.setup(); }
function processInbox() { BaziBatch.processInbox(); }
function selfTest() { BaziBatch.selfTest(); }
`;

mkdirSync('dist', { recursive: true });
await build({
  entryPoints: ['src/main.ts'],
  bundle: true,
  format: 'iife',
  globalName: 'BaziBatch',
  target: 'es2019',
  charset: 'utf8',
  outfile: 'dist/Code.js',
  footer: { js: entryPoints },
  logLevel: 'info',
});
copyFileSync('appsscript.json', 'dist/appsscript.json');
