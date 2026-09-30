import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  // Relative base so the build works from any static host or sub-path (spike S4 picks the host).
  base: './',
  plugins: [react()],
  // lunar-javascript alone is ~500 kB minified (~170 kB gzipped); fine for an installable app.
  build: { chunkSizeWarningLimit: 800 },
});
