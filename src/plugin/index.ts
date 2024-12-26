import type { Plugin, ViteDevServer } from 'vite';
import type { VTJumpOptions } from './types';
import { parse } from '@vue/compiler-sfc';
import styleRaw from '@client/client-style.css?raw';
import scriptRaw from '@client/client-script.js?raw';
import child_process from 'child_process';
import MagicString from 'magic-string';

// 存储位置映射关系
const locationMap = new Map<string, { file: string; startLine: number; endLine: number }>();
let idCounter = 0;

function generateId(filePath: string, line: number): { id: string; line: number } {
  const id = `vtj-${++idCounter}`;
  locationMap.set(id, {
    file: filePath,
    startLine: line,
    endLine: line
  });
  return { id, line };
}

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

function isHTMLTag(tag: string): boolean {
  return !/[A-Z]/.test(tag);
}

const vtjump = (options: VTJumpOptions = {}): Plugin => {
  let server: ViteDevServer;

  return {
    name: 'vite:vtjump',
    configureServer(_server) {
      server = _server;
      
      server.middlewares.use(async (req, res, next) => {
        if (req.url === '/__vtjump') {
          res.setHeader("Access-Control-Allow-Origin", "*");
          res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
          res.setHeader("Access-Control-Allow-Headers", "Content-Type");
          if (req.method === 'GET' || req.method === 'OPTIONS') {
            res.setHeader('Content-Type', 'application/json');
            res.end('__vtjump');
            return;
          }
          const chunks: Buffer[] = [];
          req.on('data', chunk => chunks.push(chunk));
          req.on('end', () => {
            const data = JSON.parse(Buffer.concat(chunks).toString());
            const { getConfig } = data;
            
            if (getConfig) {
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({
                ide: options.protocol || 'vscode',
                workingDir: process.cwd()
              }));
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
                const url = `${protocol}://file/${filePath}`;

                // 首先尝试使用系统命令打开
                const command = process.platform === 'win32' ? 
                  `start ${url}` : 
                  process.platform === 'darwin' ? 
                    `open "${url}"` : 
                    `xdg-open "${url}"`;
                
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
      if (!id.endsWith('.vue')) return;

      const { descriptor } = parse(code);
      if (!descriptor.template) return;

      const ms = new MagicString(code);
      const templateContent = descriptor.template.content;
      const templateStartLine = descriptor.template.loc.start.line;
      const templateStartOffset = descriptor.template.loc.start.offset;

      // 使用正则表达式匹配开始标签
      const startTagRE = /<(\w+)([^>]*)>/g;
      let match;

      while ((match = startTagRE.exec(templateContent)) !== null) {
        const [fullMatch, tagName, attributes] = match;
        if (!isHTMLTag(tagName)) continue;
        if (attributes.includes('data-vtjump')) continue;

        // 计算当前标签在源文件中的位置
        const tagOffset = templateStartOffset + match.index;
        const contentBeforeTag = code.slice(0, tagOffset);
        const currentLine = contentBeforeTag.split('\n').length;

        // 生成唯一ID和行号
        const { id: vtjumpId, line } = generateId(id, currentLine);

        // 在标签结束之前插入属性
        const insertPos = tagOffset + tagName.length + 1;
        ms.appendLeft(insertPos, ` data-vtjump="${vtjumpId}" data-vtjump-line="${line}" data-vtjump-file="${id}"`);
      }

      return {
        code: ms.toString(),
        map: ms.generateMap()
      };
    },
    transformIndexHtml(html) {
      const ms = new MagicString(html);
      const bodyMatch = html.match(/<\/body>/i);
      if (bodyMatch) {
        ms.appendLeft(
          bodyMatch.index!,
          `${createOverlayStyles()}${createOverlayScript()}</body>`
        );
      }
      return {
        html: ms.toString(),
        tags: []
      };
    },
  };
};

export default vtjump;
