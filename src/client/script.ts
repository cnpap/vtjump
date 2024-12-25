import './styles.css';

(() => {
  let overlay: HTMLDivElement | null = null;
  let info: HTMLDivElement | null = null;
  let isCtrlPressed = false;
  let currentTarget: HTMLElement | null = null;
  let lastHoverTarget: HTMLElement | null = null;
  let lastValidTarget: HTMLElement | null = null;

  async function executeJump(target: HTMLElement, clientX: number | null = null, clientY: number | null = null): Promise<void> {
    const startLine = target.getAttribute('data-start-line');
    const file = target.getAttribute('data-file');
    if (startLine && file) {
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

      try {
        const response = await fetch('/__vtjump', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            file,
            line: startLine
          })
        });
        
        if (response.ok) {
          const { url } = await response.json();
          if (url) {
            window.location.href = url;
          }
        }
      } catch (error) {
        console.error('Failed to execute jump:', error);
      }
    }
  }

  function showOverlay(target: HTMLElement | null): void {
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

  document.addEventListener('keydown', (e: KeyboardEvent) => {
    // Support Control key and Command key (macOS)
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

    const startLine = target.getAttribute('data-start-line');
    const endLine = target.getAttribute('data-end-line');
    const file = target.getAttribute('data-file');

    if (startLine && endLine && file) {
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
