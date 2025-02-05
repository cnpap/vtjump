import { parse, compileTemplate } from '@vue/compiler-sfc';
import MagicString from 'magic-string';
import { generateId } from './util';
import { NodeTypes } from '@vue/compiler-core';
import type { ElementNode, NodeTransform, TemplateChildNode } from '@vue/compiler-core';

function hasVtJumpAttribute(attributes: string): boolean {
  // 更严格地检查是否已经存在 vtjump 相关属性
  return /\bdata-vtjump(?:=|\s|$)|\bdata-vtjump-line(?:=|\s|$)|\bdata-vtjump-file(?:=|\s|$)/.test(
    attributes
  );
}

export function transformVueTemplate(code: string, id: string) {
  if (!id.endsWith('.vue')) return null;

  const { descriptor } = parse(code);
  if (!descriptor.template) return null;

  const ms = new MagicString(code);
  const templateContent = descriptor.template.content;
  const templateStartOffset = descriptor.template.loc.start.offset;
  const processedNodes = new Set<string>(); // 用于跟踪已处理的节点

  // 创建一个处理节点的函数
  const processNode = (node: TemplateChildNode) => {
    if (node.type === NodeTypes.ELEMENT) {
      const element = node as ElementNode;
      const nodeKey = `${element.loc.start.offset}-${element.loc.end.offset}`;

      // 如果节点已经处理过，直接返回
      if (processedNodes.has(nodeKey)) {
        return;
      }

      // 计算标签在源码中的位置
      const startOffset = templateStartOffset + element.loc.start.offset;
      const endOffset = templateStartOffset + element.loc.end.offset;
      const contentBeforeTag = code.slice(0, startOffset);
      const currentLine = contentBeforeTag.split('\n').length;

      // 获取标签的原始内容
      const originalTag = code.slice(startOffset, endOffset);
      const tagMatch = /<([a-zA-Z][a-zA-Z0-9-]*)\s*([^>]*?)(\/)?>/i.exec(originalTag);

      if (tagMatch) {
        const [fullMatch, tagName, attributes] = tagMatch;

        // 检查是否已经有 vtjump 相关属性
        if (!hasVtJumpAttribute(attributes)) {
          const { id: vtjumpId, line } = generateId(id, currentLine);
          const vtjumpAttr = ` data-vtjump="${vtjumpId}" data-vtjump-line="${line}" data-vtjump-file="${id}"`;

          // 找到标签结束的位置
          const insertPos = startOffset + tagMatch.index + fullMatch.length - (tagMatch[3] ? 2 : 1);
          ms.appendLeft(insertPos, vtjumpAttr);

          // 标记节点已处理
          processedNodes.add(nodeKey);
        }
      }

      // 递归处理子节点
      if (element.children) {
        element.children.forEach((child) => {
          if (child.type === NodeTypes.ELEMENT) {
            processNode(child);
          }
        });
      }
    }
  };

  // 使用编译器解析整个模板
  const result = compileTemplate({
    source: templateContent,
    filename: id,
    id: id,
    compilerOptions: {
      nodeTransforms: [processNode as NodeTransform],
    },
  });

  if (result.errors && result.errors.length) {
    console.error(result.errors);
    return null;
  }

  // 检查是否有修改
  if (ms.hasChanged()) {
    return {
      code: ms.toString(),
      map: ms.generateMap(),
    };
  }

  return null;
}
