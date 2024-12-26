import './styles.css';

(() => {
  let overlay: HTMLDivElement | null = null;
  let info: HTMLDivElement | null = null;
  let isCtrlPressed = false;
  let currentTarget: HTMLElement | null = null;
  let lastHoverTarget: HTMLElement | null = null;
  let lastValidTarget: HTMLElement | null = null;
  let config: { ide?: string; workingDir?: string } | null = null;

  async function fetchConfig(): Promise<void> {
    try {
      // 获取自定义的基础 URL，默认为当前域名
      const baseUrl = (window as any).__VTJUMP_BASE_URL || '';
      const response = await fetch(`${baseUrl}/__vtjump`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ getConfig: true })
      });
      
      if (response.ok) {
        config = await response.json();
      }
    } catch (error) {
      console.error('Failed to fetch config:', error);
    }
  }

  async function showOverlay(target: HTMLElement | null): Promise<void> {
    if (!target) {
      if (overlay) {
        overlay.style.display = 'none';
      }
      if (info) {
        info.style.display = 'none';
      }
      return;
    }

    const vtjumpId = target.getAttribute('data-vtjump');
    const vtjumpLine = target.getAttribute('data-vtjump-line');
    const vtjumpFile = target.getAttribute('data-vtjump-file');

    if (!vtjumpId || !vtjumpLine || !vtjumpFile || !config) {
      return;
    }

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

    overlay.style.cssText = `
      display: block;
      position: fixed;
      left: ${rect.left}px;
      top: ${rect.top}px;
      width: ${rect.width}px;
      height: ${rect.height}px;
    `;

    // 从完整路径中移除项目根目录前缀
    let displayPath = vtjumpFile;
    if (config.workingDir && vtjumpFile.startsWith(config.workingDir)) {
      displayPath = vtjumpFile.slice(config.workingDir.length).replace(/^\/+/, '');
    }

    info.innerHTML = `
      <div class="vtjump-info-content">
        <div class="vtjump-info-icon">
          <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 2.5A2.5 2.5 0 014.5 0h7A2.5 2.5 0 0114 2.5v11a2.5 2.5 0 01-2.5 2.5h-7A2.5 2.5 0 012 13.5v-11z" fill="#4299e1"/>
            <path d="M6 5h4M6 8h4M6 11h4" stroke="#fff" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
        </div>
        <div class="vtjump-info-text">
          <span class="vtjump-info-file">${displayPath}</span>
          <span class="vtjump-info-separator">:</span>
          <span class="vtjump-info-line">${vtjumpLine}</span>
        </div>
      </div>
    `;

    const infoRect = info.getBoundingClientRect();
    let left = rect.left;
    let top = rect.top - infoRect.height - 8;

    if (top < 8) {
      top = rect.bottom + 8;
      info.classList.add('vtjump-info-bottom');
    } else {
      info.classList.remove('vtjump-info-bottom');
    }

    info.style.cssText = `
      display: block;
      position: fixed;
      left: ${left}px;
      top: ${top}px;
    `;
  }

  async function executeJump(target: HTMLElement, clientX: number | null = null, clientY: number | null = null): Promise<void> {
    const vtjumpId = target.getAttribute('data-vtjump');
    const vtjumpLine = target.getAttribute('data-vtjump-line');
    const vtjumpFile = target.getAttribute('data-vtjump-file');
    
    if (!vtjumpId || !vtjumpLine || !vtjumpFile || !config) {
      return;
    }

    if (clientX !== null && clientY !== null) {
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

    const toast = document.createElement('div');
    toast.className = 'vtjump-toast';
    toast.innerHTML = `
      <div class="vtjump-toast-content">
        <span class="vtjump-toast-label">Jumping to file...</span>
      </div>
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 1800);

    try {
      const baseUrl = (window as any).__VTJUMP_BASE_URL || '';
      const protocol = config.ide || 'vscode';
      // 跳转时使用完整路径
      const url = `${baseUrl}${protocol}://file/${vtjumpFile}:${vtjumpLine}`;
      window.open(url);
    } catch (error) {
      console.error('Failed to execute jump:', error);
    }
  }

  // 在页面加载时获取配置
  fetchConfig();

  document.addEventListener('keydown', (e: KeyboardEvent) => {
    // Support Control key and Command key (macOS)
    if (e.key === 'Control' || (e.key === 'Meta' && /Mac|iPod|iPhone|iPad/.test(navigator.platform))) {
      isCtrlPressed = true;
      document.body.style.cursor = 'crosshair';
      if (lastHoverTarget) {
        const vtjumpId = lastHoverTarget.getAttribute('data-vtjump');
        if (vtjumpId) {
          currentTarget = lastHoverTarget;
          lastValidTarget = lastHoverTarget;
          showOverlay(lastHoverTarget);
        }
      }
    } else if (e.key.toLowerCase() === 'x' && lastValidTarget) {
      executeJump(lastValidTarget);
    }
  });

  document.addEventListener('keyup', (e: KeyboardEvent) => {
    // Support Control key and Command key (macOS)
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

  document.addEventListener('mouseover', (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    lastHoverTarget = target;

    if (!isCtrlPressed) return;

    const vtjumpId = target.getAttribute('data-vtjump');
    if (vtjumpId) {
      currentTarget = target;
      lastValidTarget = target;
      showOverlay(target);
    }
  });

  document.addEventListener('mouseout', (e: MouseEvent) => {
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

  document.addEventListener('click', (e: MouseEvent) => {
    if (isCtrlPressed && currentTarget) {
      e.preventDefault();
      e.stopPropagation();
      executeJump(currentTarget, e.clientX, e.clientY);
      
      // Reset state after jump
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
      lastHoverTarget = null;
      lastValidTarget = null;
    }
  });

})();
