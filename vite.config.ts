import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { resolve } from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [svelte()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/client/script.ts'),
      formats: ['es'],
      fileName: (format) => `client-script.js`,
    },
    rollupOptions: {
      output: {
        dir: 'dist/client',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'style.css') {
            return 'client-style.css';
          }
          return assetInfo.name!;
        },
      },
    },
    emptyOutDir: false,
  },
});
