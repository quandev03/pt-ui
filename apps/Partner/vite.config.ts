/// <reference types='vitest' />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { resolve } from 'path';

export default defineConfig({
  root: __dirname,
  base: '/daily/',
  cacheDir: '../../node_modules/.vite/apps/partner',

  server: {
    port: 4201,
    host: true,
    strictPort: true,
    fs: {
      allow: ['..'],
    },
    allowedHosts: ['hivn.mobifone.vn']
  },

  preview: {
    port: 4301,
    host: 'localhost',
    strictPort: true,
  },

  plugins: [react(), nxViteTsPaths()],

  resolve: {
    alias: {
      'apps/Partner/src': resolve(__dirname, 'src'),
      'apps/Partner': resolve(__dirname),
    },
  },
  // Uncomment this if you are using workers.
  // worker: {
  //  plugins: [ nxViteTsPaths() ],
  // },

  build: {
    outDir: '../../dist/apps/partner',
    emptyOutDir: true,
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },

  test: {
    watch: false,
    globals: true,
    environment: 'jsdom',
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],

    reporters: ['default'],
    coverage: {
      reportsDirectory: '../../coverage/apps/partner',
      provider: 'v8',
    },
  },
});
