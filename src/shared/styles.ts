// Common styles for both plugin and inject
export const styles = `
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

@keyframes vtjump-ripple {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(3);
    opacity: 0;
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

.vtjump-info-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.vtjump-info-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.vtjump-info-file {
  font-weight: 500;
  opacity: 0.9;
}

.vtjump-info-line {
  font-size: 11px;
  opacity: 0.7;
}

.vtjump-toast {
  position: fixed;
  left: 50%;
  bottom: 32px;
  transform: translateX(-50%);
  background: linear-gradient(135deg, rgba(45, 55, 72, 0.85), rgba(26, 32, 44, 0.95));
  color: #fff;
  padding: 12px 20px;
  border-radius: 99px;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 13px;
  white-space: nowrap;
  z-index: 9999;
  pointer-events: none;
  box-shadow: 
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  backdrop-filter: blur(4px);
  animation: vtjump-toast-appear 1.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.vtjump-toast-content {
  display: flex;
  align-items: center;
  gap: 6px;
}

.vtjump-toast-label {
  opacity: 0.7;
}

.vtjump-toast-file {
  font-weight: 500;
}

.vtjump-toast-line {
  opacity: 0.5;
}

.vtjump-toast-error {
  background: linear-gradient(135deg, rgba(220, 38, 38, 0.85), rgba(153, 27, 27, 0.95));
  border: 1px solid rgba(248, 113, 113, 0.2);
  padding: 12px 20px;
  max-width: 400px;
  white-space: normal;
}

.vtjump-toast-error .vtjump-toast-label {
  color: rgba(248, 113, 113, 0.9);
  font-weight: 500;
}

.vtjump-toast-error .vtjump-toast-message {
  color: rgba(255, 255, 255, 0.9);
  margin-left: 4px;
}

.vtjump-container {
  position: fixed;
  z-index: 9999;
  pointer-events: none;
}
`;
