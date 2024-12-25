import { defineConfig } from 'vite';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    dts({
      include: ['src/plugin/**/*.ts'],
      outDir: 'dist',
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/plugin/index.ts'),
      name: 'VitePluginVtjump',
      fileName: 'index',
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: ['vite', '@vue/compiler-sfc', 'magic-string', 'child_process'],
    },
    emptyOutDir: false,
  },
  resolve: {
    alias: {
      '@client': resolve(__dirname, 'dist/client')
    }
  }
});
