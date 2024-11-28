import type { Plugin } from 'vite';
import type { VTJumpOptions } from './types';
import MagicString from 'magic-string';
import { parse, compileTemplate } from '@vue/compiler-sfc';

const createOverlayStyles = () => `
<style>
@keyframes vtjump-overlay-appear {
  from {
    opacity: 0;
    transform: scale(0.98);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes vtjump-info-appear {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes vtjump-toast-appear {
  0% {
    opacity: 0;
    transform: translate(-50%, 16px);
    filter: blur(8px);
  }
  15% {
    opacity: 1;
    transform: translate(-50%, 0);
    filter: blur(0);
  }
  85% {
    opacity: 1;
    transform: translate(-50%, 0);
    filter: blur(0);
  }
  100% {
    opacity: 0;
    transform: translate(-50%, -16px);
    filter: blur(4px);
  }
}

.vtjump-overlay {
  position: absolute;
  background: linear-gradient(135deg, rgba(66, 153, 225, 0.04), rgba(49, 130, 206, 0.06));
  border: 1.5px solid rgba(66, 153, 225, 0.25);
  border-radius: 4px;
  pointer-events: none;
  z-index: 9998;
  box-shadow: 
    0 0 0 1px rgba(66, 153, 225, 0.08),
    0 2px 4px rgba(66, 153, 225, 0.08),
    inset 0 0 15px rgba(66, 153, 225, 0.03);
  backdrop-filter: blur(2px);
  animation: vtjump-overlay-appear 0.2s ease-out;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.vtjump-overlay::before {
  content: '';
  position: absolute;
  inset: -1px;
  background: linear-gradient(135deg, rgba(66, 153, 225, 0.15), transparent);
  border-radius: inherit;
  z-index: -1;
  opacity: 0.3;
}

.vtjump-info {
  position: absolute;
  display: flex;
  align-items: center;
  gap: 10px;
  background: linear-gradient(135deg, rgba(45, 55, 72, 0.85), rgba(26, 32, 44, 0.95));
  color: #fff;
  padding: 10px 14px;
  border-radius: 8px;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 12px;
  line-height: 1.4;
  white-space: nowrap;
  z-index: 9999;
  pointer-events: none;
  box-shadow: 
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06),
    0 0 0 1px rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(4px);
  animation: vtjump-info-appear 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  transform-origin: center bottom;
}

.vtjump-info::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 50%;
  transform: translateX(-50%);
  width: 8px;
  height: 8px;
  background: inherit;
  border-radius: 1px;
  transform-origin: center;
  rotate: 45deg;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
}

.vtjump-info-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background: rgba(66, 153, 225, 0.2);
  border-radius: 6px;
  padding: 5px;
  box-shadow: 
    0 0 0 1px rgba(66, 153, 225, 0.3),
    inset 0 1px 1px rgba(255, 255, 255, 0.1);
}

.vtjump-info-icon svg {
  width: 100%;
  height: 100%;
  filter: drop-shadow(0 1px 1px rgba(0, 0, 0, 0.1));
}

.vtjump-info-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.vtjump-info-file {
  font-weight: 500;
  color: #fff;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  letter-spacing: 0.01em;
  position: relative;
  padding-left: 12px;
}

.vtjump-info-file::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 6px;
  height: 6px;
  background: #4299e1;
  border-radius: 50%;
  box-shadow: 0 0 8px rgba(66, 153, 225, 0.6);
}

.vtjump-info-line {
  color: rgba(255, 255, 255, 0.6);
  font-size: 11px;
  font-weight: 400;
  letter-spacing: 0.02em;
}

.vtjump-info-line span {
  color: #4299e1;
  font-weight: 500;
}

.vtjump-info:hover {
  opacity: 1;
}

.vtjump-toast {
  position: fixed;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(17, 24, 39, 0.85);
  color: #e2e8f0;
  padding: 8px 16px 8px 12px;
  border-radius: 6px;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 12px;
  font-weight: 400;
  line-height: 1.5;
  letter-spacing: 0.01em;
  white-space: nowrap;
  z-index: 10000;
  display: flex;
  align-items: center;
  gap: 6px;
  box-shadow: 
    0 0 0 1px rgba(255, 255, 255, 0.1),
    0 2px 4px rgba(0, 0, 0, 0.1),
    0 8px 16px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(8px);
  animation: vtjump-toast-appear 1.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  pointer-events: none;
}

.vtjump-toast::before {
  content: '';
  width: 14px;
  height: 14px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'%3E%3Cpath stroke='%234ADE80' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' d='M9 6.75 15 12l-6 5.25'/%3E%3C/svg%3E");
  opacity: 0.9;
}

.vtjump-toast-content {
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.vtjump-toast-label {
  color: #9ca3af;
  font-weight: 400;
}

.vtjump-toast-file {
  color: #ffffff;
  font-weight: 500;
}

.vtjump-toast-line {
  color: #4ADE80;
  font-weight: 500;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
}

@keyframes vtjump-ripple {
  0% {
    transform: scale(0.5);
    opacity: 0.8;
  }
  100% {
    transform: scale(2);
    opacity: 0;
  }
}
</style>
`;

const createOverlayScript = (options: VTJumpOptions) => `
<script>
(function() {
  let overlay = null;
  let info = null;
  let isCtrlPressed = false;
  let currentTarget = null;
  let lastHoverTarget = null;
  let lastValidTarget = null;  

  function executeJump(target, clientX = null, clientY = null) {
    const startLine = target.getAttribute('data-start-line');
    const file = target.getAttribute('data-file');
    if (startLine && file) {
      if (clientX !== null && clientY !== null) {
        const ripple = document.createElement('div');
        ripple.style.cssText = \`
          position: fixed;
          left: \${clientX - 6}px;
          top: \${clientY - 6}px;
          width: 12px;
          height: 12px;
          background: rgba(74, 222, 128, 0.6);
          border-radius: 50%;
          pointer-events: none;
          z-index: 10000;
          animation: vtjump-ripple 0.4s ease-out forwards;
        \`;
        document.body.appendChild(ripple);
        setTimeout(() => ripple.remove(), 400);
      }

      const toast = document.createElement('div');
      toast.className = 'vtjump-toast';
      const fileName = file.split('/').pop() || file;
      toast.innerHTML = \`
        <div class="vtjump-toast-content">
          <span class="vtjump-toast-label">Jumping to</span>
          <span class="vtjump-toast-file">\${fileName}</span>
          <span class="vtjump-toast-line">:\${startLine}</span>
        </div>
      \`;
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 1800);

      const link = document.createElement('a');
      link.href = createJumpUrl(file, startLine);
      link.click();
    }
  }

  function createJumpUrl(file, line) {
    const protocol = '${options.protocol || 'vscode'}';
    return \`\${protocol}://file/\${file}:\${line}\`;
  }

  function showOverlay(target) {
    if (!target) return;
    
    const startLine = target.getAttribute('data-start-line');
    const endLine = target.getAttribute('data-end-line');
    const file = target.getAttribute('data-file');

    if (startLine && endLine && file) {
      if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'vtjump-overlay';
        document.body.appendChild(overlay);
      }

      if (!info) {
        info = document.createElement('div');
        info.className = 'vtjump-info';
        document.body.appendChild(info);
      }

      const rect = target.getBoundingClientRect();
      const scrollX = window.scrollX;
      const scrollY = window.scrollY;

      overlay.style.left = rect.left + scrollX + 'px';
      overlay.style.top = rect.top + scrollY + 'px';
      overlay.style.width = rect.width + 'px';
      overlay.style.height = rect.height + 'px';

      const fileName = file.split('/').pop() || file;
      
      const iconSvg = \`
        <div class="vtjump-info-icon">
          <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 2.5A2.5 2.5 0 014.5 0h7A2.5 2.5 0 0114 2.5v11a2.5 2.5 0 01-2.5 2.5h-7A2.5 2.5 0 012 13.5v-11z" fill="#4299e1"/>
            <path d="M6 5h4M6 8h4M6 11h4" stroke="#fff" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
        </div>
      \`;

      info.innerHTML = \`
        \${iconSvg}
        <div class="vtjump-info-text">
          <span class="vtjump-info-file">\${fileName}</span>
          <span class="vtjump-info-line">Line <span>\${startLine}</span>-<span>\${endLine}</span></span>
        </div>
      \`;

      const infoRect = info.getBoundingClientRect();
      let left = rect.left + scrollX + (rect.width - infoRect.width) / 2;
      let top = rect.top + scrollY - 8;

      if (left + infoRect.width > window.innerWidth) {
        left = window.innerWidth - infoRect.width - 16;
      }
      if (left < 16) {
        left = 16;
      }

      if (top - infoRect.height < 0) {
        top = rect.bottom + scrollY + 8;
        info.style.transform = 'none';
        info.classList.add('vtjump-info-bottom');
      } else {
        top = rect.top + scrollY - infoRect.height - 8;
        info.style.transform = 'none';
        info.classList.remove('vtjump-info-bottom');
      }

      info.style.left = left + 'px';
      info.style.top = top + 'px';
    }
  }

  document.addEventListener('keydown', (e) => {
    // 支持 Control 键和 Command 键 (macOS)
    if (e.key === 'Control' || (e.key === 'Meta' && /Mac|iPod|iPhone|iPad/.test(navigator.platform))) {
      isCtrlPressed = true;
      document.body.style.cursor = 'crosshair';
      if (lastHoverTarget) {
        const startLine = lastHoverTarget.getAttribute('data-start-line');
        const endLine = lastHoverTarget.getAttribute('data-end-line');
        const file = lastHoverTarget.getAttribute('data-file');
        if (startLine && endLine && file) {
          currentTarget = lastHoverTarget;
          lastValidTarget = lastHoverTarget;  
          showOverlay(lastHoverTarget);
        }
      }
    } else if (e.key.toLowerCase() === 'x' && lastValidTarget) {
      executeJump(lastValidTarget);
    }
  });

  document.addEventListener('keyup', (e) => {
    // 支持 Control 键和 Command 键 (macOS)
    if (e.key === 'Control' || (e.key === 'Meta' && /Mac|iPod|iPhone|iPad/.test(navigator.platform))) {
      isCtrlPressed = false;
      document.body.style.cursor = '';
      if (overlay) {
        overlay.remove();
        overlay = null;
      }
      if (info) {
        info.remove();
        info = null;
      }
      currentTarget = null;
    }
  });

  document.addEventListener('mouseover', (e) => {
    const target = e.target;
    lastHoverTarget = target;
    
    if (!isCtrlPressed) return;

    const startLine = target.getAttribute('data-start-line');
    const endLine = target.getAttribute('data-end-line');
    const file = target.getAttribute('data-file');
    
    if (startLine && endLine && file) {
      currentTarget = target;
      lastValidTarget = target;  
      showOverlay(target);
    }
  });

  document.addEventListener('mouseout', (e) => {
    if (!isCtrlPressed) return;
    if (e.relatedTarget === null) {
      if (overlay) {
        overlay.remove();
        overlay = null;
      }
      if (info) {
        info.remove();
        info = null;
      }
      currentTarget = null;
      lastHoverTarget = null;
    }
  });

  document.addEventListener('click', (e) => {
    if (isCtrlPressed && currentTarget) {
      e.preventDefault();
      e.stopPropagation();
      executeJump(currentTarget, e.clientX, e.clientY);
    }
  });

  const style = document.createElement('style');
  style.textContent = \`
    @keyframes vtjump-ripple {
      0% {
        transform: scale(0.5);
        opacity: 0.8;
      }
      100% {
        transform: scale(2);
        opacity: 0;
      }
    }
  \`;
  document.head.appendChild(style);
})();
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
      const injectedHtml = html.replace(
        '</body>',
        `${createOverlayStyles()}${createOverlayScript(options)}${createEmptyContainer()}${injectScript}</body>`
      );
      return injectedHtml;
    },
  };
}
