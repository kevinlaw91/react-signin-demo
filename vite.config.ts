/// <reference types="vitest" />
import path from 'path';
import { fileURLToPath } from 'url';
import { configDefaults, defineConfig } from 'vitest/config';
import tailwindcss from '@tailwindcss/vite';
import legacy from '@vitejs/plugin-legacy';
import react from '@vitejs/plugin-react-swc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vitejs.dev/config/
export default defineConfig({
  base: '/react-signin-demo/',
  server: {
    port: 3000,
    watch: {
      ignored: [
        '**/e2e/**',
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'test': path.resolve(__dirname, './test'),
    },
  },
  plugins: [
    react(),
    tailwindcss(),
    legacy(),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    environmentOptions: {
      jsdom: {
        resources: 'usable',
      },
    },
    exclude: [
      ...configDefaults.exclude,
      '**/e2e/**',
    ],
    setupFiles: [
      path.resolve(__dirname, './test/vitest-setup.ts'),
    ],
  },
});
