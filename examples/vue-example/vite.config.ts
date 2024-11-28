import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vtjump from '../../dist';

export default defineConfig({
  plugins: [
    vtjump({
      protocol: 'windsurf',
    }),
    vue(),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
  },
});
