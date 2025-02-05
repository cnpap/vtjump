import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import MagicString from 'magic-string';
import { parse, compileTemplate, transform } from '@vue/compiler-sfc';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    {
      name: 'vue-debug-plugin',
      transform(code, id) {
        if (!id.endsWith('.vue')) return;

        const { descriptor } = parse(code);
        const { template } = descriptor;

        if (template) {
          const s = new MagicString(code);
          const lines = code.split('\n');

          // 解析模板并获取 AST
          const compiled = compileTemplate({ source: template.content, filename: id });

          if (compiled.errors.length) {
            console.error(compiled.errors);
            return;
          }

          // 计算文件中的行号偏移量
          const templateStartLine = template.loc.start.line;

          // 判断一个标签是否是内置 HTML 标签
          function isHTMLTag(tag) {
            console.log(tag);
            // 判断 tag 是否有大写字母，如果有则认为是组件
            if (/[A-Z]/.test(tag)) {
              return false;
            }
            return true;
            return [
              'html',
              'body',
              'base',
              'head',
              'link',
              'meta',
              'style',
              'title',
              'address',
              'article',
              'aside',
              'footer',
              'header',
              'h1',
              'h2',
              'h3',
              'h4',
              'h5',
              'h6',
              'hgroup',
              'nav',
              'section',
              'div',
              'dd',
              'dl',
              'dt',
              'figcaption',
              'figure',
              'picture',
              'hr',
              'img',
              'li',
              'main',
              'ol',
              'p',
              'pre',
              'ul',
              'a',
              'b',
              'abbr',
              'bdi',
              'bdo',
              'br',
              'cite',
              'code',
              'data',
              'dfn',
              'em',
              'i',
              'kbd',
              'mark',
              'q',
              'rp',
              'rt',
              'rtc',
              'ruby',
              's',
              'samp',
              'small',
              'span',
              'strong',
              'sub',
              'sup',
              'time',
              'u',
              'var',
              'wbr',
              'area',
              'audio',
              'map',
              'track',
              'video',
              'embed',
              'object',
              'param',
              'source',
              'canvas',
              'script',
              'noscript',
              'del',
              'ins',
              'caption',
              'col',
              'colgroup',
              'table',
              'thead',
              'tbody',
              'td',
              'th',
              'tr',
              'button',
              'datalist',
              'fieldset',
              'form',
              'input',
              'label',
              'legend',
              'meter',
              'optgroup',
              'option',
              'output',
              'progress',
              'select',
              'textarea',
              'details',
              'dialog',
              'menu',
              'summary',
              'template',
              'blockquote',
              'iframe',
              'tfoot',
            ].includes(tag);
          }

          // 遍历 AST 并在每个普通 DOM 元素上添加 data-start-line 和 data-end-line 属性
          function traverseNode(node) {
            if (node.type === 1 && isHTMLTag(node.tag)) {
              // 1 表示 ELEMENT 类型节点，且是内置 HTML 标签
              const startLine = templateStartLine + node.loc.start.line - 1;
              const endLine = templateStartLine + node.loc.end.line - 1;
              const start = template.loc.start.offset + node.loc.start.offset;
              s.appendLeft(
                start + node.tag.length + 1,
                ` data-start-line="${startLine}" data-end-line="${endLine}"`
              );
            }

            if (node.children) {
              node.children.forEach((child) => traverseNode(child));
            }
          }

          compiled.ast.children.forEach((node) => traverseNode(node));

          return {
            code: s.toString(),
            map: s.generateMap({ hires: true }),
          };
        }
      },
    },
    vue(),
  ],
});
