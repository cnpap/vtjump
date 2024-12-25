import type { VTJumpOptions } from '../plugin/types';

export function createJumpUrl(file: string, line: string, options: VTJumpOptions = {}) {
  const protocol = options.protocol || 'windsurf';
  // 根据不同的IDE使用不同的URL格式
  switch (protocol) {
    case 'vscode':
      return `vscode://file/${file}:${line}`;
    case 'phpstorm':
      return `phpstorm://open?file=${file}&line=${line}`;
    case 'sublime':
      return `subl://open?url=file://${file}&line=${line}`;
    case 'webstorm':
      return `webstorm://open?file=${file}&line=${line}`;
    case 'idea':
      return `idea://open?file=${file}&line=${line}`;
    default:
      // 如果是自定义协议，使用标准格式
      return `${protocol}://file/${file}:${line}`;
  }
}

export function openUrl(url: string) {
    // 直接使用 window.open，不使用隐藏的 iframe
    try {
        window.open(url, '_blank');
    } catch (e) {
        console.warn('Failed to open URL:', url, e);
        showErrorToast('Failed to open URL. Please make sure you have the appropriate IDE protocol handler installed.');
    }
}

export function showErrorToast(message: string) {
  const toast = document.createElement('div');
  toast.className = 'vtjump-toast vtjump-toast-error';
  toast.innerHTML = `
    <div class="vtjump-toast-content">
      <span class="vtjump-toast-label">Error:</span>
      <span class="vtjump-toast-message">${message}</span>
    </div>
  `;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 5000);
}

export function isMacPlatform() {
  return /Mac|iPod|iPhone|iPad/.test(navigator.platform);
}

export function createRippleEffect(clientX: number, clientY: number) {
  const ripple = document.createElement('div');
  ripple.style.cssText = `
    position: fixed;
    left: ${clientX - 6}px;
    top: ${clientY - 6}px;
    width: 12px;
    height: 12px;
    background: rgba(74, 222, 128, 0.6);
    border-radius: 50%;
    pointer-events: none;
    z-index: 10000;
    animation: vtjump-ripple 0.4s ease-out forwards;
  `;
  document.body.appendChild(ripple);
  setTimeout(() => ripple.remove(), 400);
}

export function createToast(file: string, startLine: string) {
  const toast = document.createElement('div');
  toast.className = 'vtjump-toast';
  const fileName = file.split('/').pop() || file;
  toast.innerHTML = `
    <div class="vtjump-toast-content">
      <span class="vtjump-toast-label">Jumping to</span>
      <span class="vtjump-toast-file">${fileName}</span>
      <span class="vtjump-toast-line">:${startLine}</span>
    </div>
  `;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 1800);
}

export function createInfoIcon() {
  return `
    <div class="vtjump-info-icon">
      <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M2 2.5A2.5 2.5 0 014.5 0h7A2.5 2.5 0 0114 2.5v11a2.5 2.5 0 01-2.5 2.5h-7A2.5 2.5 0 012 13.5v-11z" fill="#4299e1"/>
        <path d="M6 5h4M6 8h4M6 11h4" stroke="#fff" stroke-width="1.5" stroke-linecap="round"/>
      </svg>
    </div>
  `;
}

export function injectStyles(stylesContent: string) {
  const styleElement = document.createElement('style');
  styleElement.textContent = stylesContent;
  document.head.appendChild(styleElement);
}

export function getFileName(file: string) {
  return file.split('/').pop() || file;
}
