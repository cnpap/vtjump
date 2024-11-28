import { defineConfig } from 'vite';
import vtjump from '../../src/plugin/index';

export default defineConfig({
  plugins: [
    vtjump({
      protocol: 'windsurf',
    }),
  ],
});
