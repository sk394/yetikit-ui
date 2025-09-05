/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import tsconfigPaths from 'vite-tsconfig-paths';
import tailwindcss from '@tailwindcss/vite';
import path from 'node:path';
import dts from 'unplugin-dts/vite';

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
    // Generate and roll up type declarations only from our library sources
    dts(({ bundleTypes: true, tsconfigPath: resolve(__dirname, "tsconfig.lib.json") })),
    tailwindcss()
  ],
  build: {
    // library entry and output settings
    lib: {
      entry: resolve(__dirname, 'lib/main.ts'),
      name: 'yetikit-ui',
      fileName: 'yetikit-ui'
    },
    // bundler options
    // extendernal react-related imports
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react/jsx-runtime': 'react/jsx-runtime'
        }
      }
    }
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./lib/test/setup.ts'],
    css: true,
  }
});