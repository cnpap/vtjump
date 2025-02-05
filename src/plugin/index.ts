import type { Plugin, ViteDevServer } from 'vite';
import type { VTJumpOptions } from './types';
import styleRaw from '@client/client-style.css?raw';
import scriptRaw from '@client/client-script.js?raw';
import child_process from 'child_process';
import MagicString from 'magic-string';
import { locationMap } from './util';
import { transformVueTemplate } from './transform';

const createOverlayStyles = () => `
<style>
${styleRaw}
</style>
`;

const createOverlayScript = () => `
<script>
${scriptRaw}
</script>
`;

const vtjump = (options: VTJumpOptions = {}): Plugin => {
  let server: ViteDevServer;

  return {
    name: 'vite:vtjump',
    configureServer(_server) {
      server = _server;

      server.middlewares.use(async (req, res, next) => {
        if (req.url === '/__vtjump') {
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
          res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
          if (req.method === 'GET' || req.method === 'OPTIONS') {
            res.setHeader('Content-Type', 'application/json');
            res.end('__vtjump');
            return;
          }
          const chunks: Buffer[] = [];
          req.on('data', (chunk) => chunks.push(chunk));
          req.on('end', () => {
            const data = JSON.parse(Buffer.concat(chunks).toString());
            const { getConfig } = data;

            if (getConfig) {
              res.setHeader('Content-Type', 'application/json');
              res.end(
                JSON.stringify({
                  protocol: options.protocol || 'vscode',
                  clientSideOpen: options.clientSideOpen || false,
                  workingDir: process.cwd(),
                })
              );
              return;
            }

            const { id, getInfo } = data;
            const location = locationMap.get(id);

            if (!location) {
              res.statusCode = 404;
              res.end(JSON.stringify({ error: 'Location not found' }));
              return;
            }

            if (getInfo) {
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ location }));
            } else {
              const protocol = options.protocol || 'vscode';
              const filePath = `${location.file}:${location.startLine}`;

              if (options.clientSideOpen) {
                // 让客户端处理跳转
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ url: `${protocol}://file/${filePath}` }));
              } else {
                // 服务器端处理跳转
                let command = '';
                if (process.platform === 'win32') {
                  const url = `${protocol}://file/${filePath}`;
                  command = `start ${url}`;
                } else {
                  if (['windsurf', 'cursor'].includes(protocol)) {
                    command = `${protocol} -g "${filePath}:${location.startLine}"`;
                  } else if (protocol === 'vscode') {
                    command = `code -g "${filePath}:${location.startLine}"`;
                  }
                }

                child_process.exec(command, (error) => {
                  if (error) {
                    console.warn('Failed to open URL with system command:', error);

                    // 如果系统命令失败，尝试直接使用协议
                    const fallbackCommand = `${protocol} "${filePath}"`;
                    child_process.exec(fallbackCommand, (fallbackError) => {
                      if (fallbackError) {
                        console.error('Failed to open with protocol command:', fallbackError);
                        res.statusCode = 500;
                        res.end(JSON.stringify({ error: 'Failed to open file' }));
                      } else {
                        res.end(JSON.stringify({ success: true }));
                      }
                    });
                  } else {
                    res.end(JSON.stringify({ success: true }));
                  }
                });
              }
            }
          });
          return;
        }
        next();
      });
    },
    transform(code: string, id: string) {
      return transformVueTemplate(code, id);
    },
    transformIndexHtml(html) {
      const ms = new MagicString(html);
      const bodyMatch = html.match(/<\/body>/i);
      if (bodyMatch) {
        ms.appendLeft(bodyMatch.index!, `${createOverlayStyles()}${createOverlayScript()}</body>`);
      }
      return {
        html: ms.toString(),
        tags: [],
      };
    },
  };
};

export default vtjump;
