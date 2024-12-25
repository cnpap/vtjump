import type { VTJumpOptions } from '../plugin/types';
import { styles } from '../shared/styles';
import {
  createJumpUrl,
  isMacPlatform,
  createRippleEffect,
  createToast,
  createInfoIcon,
  injectStyles,
  getFileName,
  openUrl,
} from '../shared/utils';

// 全局变量
let overlay: HTMLElement | null = null;
let info: HTMLElement | null = null;
let isCtrlPressed = false;
let currentTarget: HTMLElement | null = null;
let lastHoverTarget: HTMLElement | null = null;
let lastValidTarget: HTMLElement | null = null;

function exitJumpMode() {
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

function initialize(options: VTJumpOptions = {}) {
  // 注入样式
  injectStyles(styles);

  function executeJump(target: HTMLElement, clientX: number | null = null, clientY: number | null = null) {
    const startLine = target.getAttribute('data-start-line');
    const file = target.getAttribute('data-file');
    if (startLine && file) {
      if (clientX !== null && clientY !== null) {
        createRippleEffect(clientX, clientY);
      }

      createToast(file, startLine);

      const url = createJumpUrl(file, startLine, options);
      openUrl(url);
    }
  }

  function showOverlay(target: HTMLElement) {
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

      const fileName = getFileName(file);
      
      info.innerHTML = `
        ${createInfoIcon()}
        <div class="vtjump-info-text">
          <span class="vtjump-info-file">${fileName}</span>
          <span class="vtjump-info-line">Line <span>${startLine}</span>-<span>${endLine}</span></span>
        </div>
      `;

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
    if (e.key === 'Control' || (e.key === 'Meta' && isMacPlatform())) {
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
    if (e.key === 'Control' || (e.key === 'Meta' && isMacPlatform())) {
      exitJumpMode();
    }
  });

  document.addEventListener('mouseover', (e) => {
    const target = e.target as HTMLElement;
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
      executeJump(currentTarget, e.clientX, e.clientY);
      exitJumpMode();
    }
  });

  window.addEventListener('blur', exitJumpMode);
}

// 导出对象而不是函数
export default {
  initialize
};
