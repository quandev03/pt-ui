/// <reference types='vitest' />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { resolve } from 'node:path';
import svgr from '@svgr/rollup';

export default defineConfig({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/apps/Partner',
  resolve: {
    alias: [{ find: '@', replacement: resolve(__dirname, 'apps/Partner/src') }],
  },
  server: {
    port: 4200,
    host: 'localhost',
  },

  preview: {
    port: 4300,
    host: 'localhost',
  },

  plugins: [react(), nxViteTsPaths(), svgr()],

  // Uncomment this if you are using workers.
  // worker: {
  //  plugins: [ nxViteTsPaths() ],
  // },

  build: {
    outDir: '../../dist/apps/Partner',
    emptyOutDir: true,
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    minify: 'terser',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          axios: ['axios'],
          lodash: ['lodash'],
          antd: ['antd'],
          'react-query': ['@tanstack/react-query'],
          apexcharts: ['apexcharts'],
          million: ['million'],
        },
      },
    },
  },
  optimizeDeps: {
    exclude: ['js-big-decimal'],
  },
});
