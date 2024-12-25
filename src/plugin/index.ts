import type { Plugin } from 'vite';
import type { VTJumpOptions } from './types';
import MagicString from 'magic-string';
import { parse, compileTemplate } from '@vue/compiler-sfc';
import styleRaw from '@client/client-style.css?raw';
import scriptRaw from '@client/client-script.js?raw';

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

const createEmptyContainer = () => `
<div id="vtjump-container"></div>
`;

const injectScript = `
<script>
  document.addEventListener('DOMContentLoaded', () => {
    // Empty initialization script
  });
</script>
`;

function isHTMLTag(tag: string): boolean {
  return !/[A-Z]/.test(tag);
}

export default function vtjump(options: VTJumpOptions = {}): Plugin {
  return {
    name: 'vite-plugin-vtjump',
    transform(code: string, id: string) {
      if (!id.endsWith('.vue')) return;

      const { descriptor } = parse(code);
      const { template } = descriptor;

      if (template) {
        const s = new MagicString(code);
        const templateStartLine = template.loc.start.line;

        const compiled = compileTemplate({
          source: template.content,
          filename: id,
          id: id,
        });

        if (compiled.errors.length) {
          console.error('Template compilation errors:', compiled.errors);
          return;
        }

        function traverseNode(node: any) {
          if (node.type === 1 && isHTMLTag(node.tag)) {
            const startLine = templateStartLine + node.loc.start.line - 1;
            const endLine = templateStartLine + node.loc.end.line - 1;
            if (template && template.loc) {
              const start = template.loc.start.offset + node.loc.start.offset;
              s.appendLeft(
                start + node.tag.length + 1,
                ` data-start-line="${startLine}" data-end-line="${endLine}" data-file="${id}"`
              );
            }
          }

          if (node.children) {
            node.children.forEach((child: any) => traverseNode(child));
          }
        }

        if (compiled.ast) {
          compiled.ast.children.forEach((node: any) => traverseNode(node));
        }

        return {
          code: s.toString(),
          map: s.generateMap({ hires: true }),
        };
      }
    },
    transformIndexHtml(html: string) {
      const ms = new MagicString(html);
      const bodyMatch = html.match(/<\/body>/i);
      if (bodyMatch) {
        ms.appendLeft(
          bodyMatch.index!,
          `${createOverlayStyles()}${createOverlayScript()}${createEmptyContainer()}${injectScript}</body>`
        );
      }
      return {
        html: ms.toString(),
        tags: []
      };
    },
  };
}
