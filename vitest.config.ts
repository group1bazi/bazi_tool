import { defineConfig } from 'vitest/config';

// One test run for the whole repo. Engine specs live in packages/engine/test,
// batch-automation specs in apps/batch/test.
export default defineConfig({
  test: {
    include: ['packages/*/test/**/*.test.ts', 'apps/*/test/**/*.test.ts'],
    environment: 'node',
  },
});
