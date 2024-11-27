import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vtjump from '../../dist';

export default defineConfig({
  plugins: [
    vtjump({
      protocol: 'windsurf',
      modalTitle: 'Vue Example',
      modalContent: 'This is the Vue example with vtjump plugin.',
    }),
    vue(),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
  },
});
