import type { Plugin } from 'vite';
import type { VTJumpOptions } from './types';
import { parse, compileTemplate } from '@vue/compiler-sfc';
import vtjump from '../inject/index';
import { styles } from '../shared/styles';

export default function VTJumpPlugin(options: VTJumpOptions = {}): Plugin {
  let config: any;

  return {
    name: 'vite-plugin-vtjump',
    configResolved(resolvedConfig) {
      config = resolvedConfig;
    },
    configureServer(server) {
      // 在开发服务器启动时注入脚本
      server.middlewares.use((req, res, next) => {
        if (req.url?.endsWith('.html')) {
          res.setHeader('Content-Type', 'text/html');
          const html = `
            <script type="module">
              (${vtjump.initialize.toString()})(${JSON.stringify(options)});
            </script>
          `;
          res.end(html);
        } else {
          next();
        }
      });
    },
    transform(code, id) {
      // 只处理 Vue 文件
      if (!id.endsWith('.vue')) return;

      try {
        // 处理 Vue 文件
        const { descriptor } = parse(code);
        if (descriptor.template) {
          const template = descriptor.template.content;
          const compiled = compileTemplate({
            source: template,
            filename: id,
            id: id,
          });

          // 添加跳转属性
          return `<template><div data-file="${id}" data-start-line="1" data-end-line="1">${code}</div></template>`;
        }
      } catch (e) {
        console.error('Failed to transform file:', e);
        return code;
      }

      return code;
    },
    transformIndexHtml(html) {
      // 在 HTML 文件中注入样式和初始化代码
      const initCode = `(${vtjump.initialize.toString()})(${JSON.stringify(options)})`;
      
      return {
        html,
        tags: [
          {
            tag: 'style',
            children: styles,
            injectTo: 'head'
          },
          {
            tag: 'script',
            children: initCode,
            injectTo: 'body'
          }
        ]
      };
    }
  };
}
