import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/inject/index.ts'),
      name: 'vtjump',
      formats: ['iife', 'es'],
      fileName: (format) => {
        if (format === 'iife') {
          return `inject/vtjump.iife.js`;
        }
        return `inject/vtjump.${format}.js`;
      },
    },
    outDir: 'dist',
    emptyOutDir: false,
    rollupOptions: {
      output: {
        // 为 IIFE 格式设置全局变量名
        name: 'vtjump',
        extend: false,
        format: 'iife',
      },
    },
  },
});
