import { defineConfig } from 'vite';
import vtjump from '../../dist/index';

export default defineConfig({
  plugins: [
    vtjump({
      modalTitle: 'Custom Title',
      modalContent: 'This is a custom modal content.',
    }),
  ],
});
