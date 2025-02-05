import { parse } from '@vue/compiler-sfc';
import MagicString from 'magic-string';
import { generateId } from './util';

function isHTMLTag(tag: string): boolean {
  // 基础 HTML 标签列表
  const basicHtmlTags = [
    'div',
    'span',
    'p',
    'a',
    'img',
    'button',
    'input',
    'label',
    'select',
    'option',
    'form',
    'table',
    'tr',
    'td',
    'th',
    'ul',
    'ol',
    'li',
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'header',
    'footer',
    'main',
    'section',
    'article',
    'nav',
    'aside',
    'figure',
    'figcaption',
    'video',
    'audio',
    'source',
    'canvas',
    'textarea',
    'pre',
    'code',
    'br',
    'hr',
  ];
  return basicHtmlTags.includes(tag.toLowerCase());
}

function isVueComponent(tag: string): boolean {
  // Vue组件通常以大写字母开头或包含连字符
  return /^[A-Z]/.test(tag) || tag.includes('-');
}

export function transformVueTemplate(code: string, id: string) {
  if (!id.endsWith('.vue')) return null;

  const { descriptor } = parse(code);
  if (!descriptor.template) return null;

  const ms = new MagicString(code);
  const templateContent = descriptor.template.content;
  const templateStartOffset = descriptor.template.loc.start.offset;

  // 匹配开始标签，包括自闭合标签
  const startTagRE = /<([a-zA-Z][a-zA-Z0-9-]*)\s*([^>]*?)(\/)?>/gi;
  let match;
  let hasChanges = false;

  while ((match = startTagRE.exec(templateContent)) !== null) {
    const [fullMatch, tagName, attributes, selfClosing] = match;

    // 跳过Vue组件和已有data-vtjump属性的标签
    if (isVueComponent(tagName) || attributes.includes('data-vtjump')) continue;

    // 只处理基础HTML标签
    if (!isHTMLTag(tagName)) continue;

    // 计算当前标签在源文件中的位置
    const tagOffset = templateStartOffset + match.index;
    const contentBeforeTag = code.slice(0, tagOffset);
    const currentLine = contentBeforeTag.split('\n').length;

    // 生成唯一ID和行号
    const { id: vtjumpId, line } = generateId(id, currentLine);

    // 确定插入位置：在结束的 > 或 /> 之前
    const insertPos = tagOffset + fullMatch.length - (selfClosing ? 2 : 1);
    const vtjumpAttr = ` data-vtjump="${vtjumpId}" data-vtjump-line="${line}" data-vtjump-file="${id}"`;

    ms.appendLeft(insertPos, vtjumpAttr);
    hasChanges = true;
  }

  // 只有在实际进行了修改时才返回新代码
  return hasChanges
    ? {
        code: ms.toString(),
        map: ms.generateMap(),
      }
    : null;
}
