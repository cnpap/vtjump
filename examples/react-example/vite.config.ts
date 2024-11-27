import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import vtjump from '../../dist/index';

export default defineConfig({
  plugins: [
    react(),
    vtjump({
      modalTitle: 'React Example',
      modalContent: 'This is the React example with vtjump plugin.',
    }),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
  },
});
