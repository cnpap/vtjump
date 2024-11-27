import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vtjump from '../../dist/index';

export default defineConfig({
  plugins: [
    vue(),
    vtjump({
      modalTitle: 'Vue Example',
      modalContent: 'This is the Vue example with vtjump plugin.',
    }),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
  },
});
