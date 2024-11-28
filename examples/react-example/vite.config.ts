import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import vtjump from '../../src/plugin/index';

export default defineConfig({
  plugins: [
    react(),
    vtjump({
      protocol: 'windsurf',
    }),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
  },
});
