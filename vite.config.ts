/// <reference types="vitest" />
import path from 'path';
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import legacy from '@vitejs/plugin-legacy';
import react from '@vitejs/plugin-react-swc';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 3000,
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
    setupFiles: [
      path.resolve(__dirname, './test/vitest-setup.ts'),
    ],
  },
});
