import './styles.css';

(() => {
  let overlay: HTMLDivElement | null = null;
  let info: HTMLDivElement | null = null;
  let isCtrlPressed = false;
  let currentTarget: HTMLElement | null = null;
  let lastHoverTarget: HTMLElement | null = null;
  let lastValidTarget: HTMLElement | null = null;
  let locationCache = new Map<string, { file: string; startLine: number }>();

  async function fetchLocation(id: string): Promise<{ file: string; startLine: number } | null> {
    if (locationCache.has(id)) {
      return locationCache.get(id)!;
    }

    try {
      const response = await fetch('/__vtjump', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, getInfo: true })
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.location) {
          locationCache.set(id, data.location);
          return data.location;
        }
      }
    } catch (error) {
      console.error('Failed to fetch location:', error);
    }
    return null;
  }

  async function executeJump(target: HTMLElement, clientX: number | null = null, clientY: number | null = null): Promise<void> {
    const vtjumpId = target.getAttribute('data-vtjump');
    if (vtjumpId) {
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
        const response = await fetch('/__vtjump', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: vtjumpId
          })
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.url) {
            // 只有在服务器返回 URL 时才在客户端打开
            window.location.href = data.url;
          } else if (data.success) {
            // 服务器端已经处理了跳转
            console.log('File opened by server');
          } else if (data.error) {
            console.error('Failed to open file:', data.error);
          }
        }
      } catch (error) {
        console.error('Failed to execute jump:', error);
      }
    }
  }

  async function showOverlay(target: HTMLElement | null): Promise<void> {
    if (!target) return;

    const vtjumpId = target.getAttribute('data-vtjump');
    if (!vtjumpId) return;

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

    const location = await fetchLocation(vtjumpId);
    if (!location) return;

    const fileName = location.file.split('/').pop() || location.file;

    const iconSvg = `
      <div class="vtjump-info-icon">
        <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M2 2.5A2.5 2.5 0 014.5 0h7A2.5 2.5 0 0114 2.5v11a2.5 2.5 0 01-2.5 2.5h-7A2.5 2.5 0 012 13.5v-11z" fill="#4299e1"/>
          <path d="M6 5h4M6 8h4M6 11h4" stroke="#fff" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
      </div>
    `;

    info.innerHTML = `
      ${iconSvg}
      <div class="vtjump-info-text">
        <span class="vtjump-info-file">${fileName}</span>
        <span class="vtjump-info-line">Line ${location.startLine}</span>
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
