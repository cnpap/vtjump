import type { VTJumpOptions, VTJumpPlugin } from './types';

const createFloatingButton = () => `
<div id="vtjump-floating-btn" style="
  position: fixed;
  right: 20px;
  bottom: 20px;
  width: 50px;
  height: 50px;
  background: #4a90e2;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 10px rgba(0,0,0,0.2);
  z-index: 9999;
  transition: transform 0.2s;
">
  <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
  </svg>
</div>
`;

const createModal = (options: VTJumpOptions = {}) => `
<div id="vtjump-modal" style="
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.5);
  z-index: 10000;
">
  <div style="
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: white;
    padding: 20px;
    border-radius: 8px;
    min-width: 300px;
    max-width: 600px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  ">
    <div style="
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
    ">
      <h2 style="margin: 0;">${options.modalTitle || 'VTJump Modal'}</h2>
      <button id="vtjump-modal-close" style="
        background: none;
        border: none;
        font-size: 24px;
        cursor: pointer;
        padding: 0;
        color: #666;
        transition: color 0.2s;
      ">×</button>
    </div>
    <div style="color: #333;">
      <p>${options.modalContent || 'This is the modal content.'}</p>
    </div>
  </div>
</div>
`;

const injectScript = `
<script>
  document.addEventListener('DOMContentLoaded', () => {
    const floatingBtn = document.getElementById('vtjump-floating-btn');
    const modal = document.getElementById('vtjump-modal');
    const closeBtn = document.getElementById('vtjump-modal-close');

    floatingBtn.addEventListener('click', () => {
      modal.style.display = 'block';
    });

    closeBtn.addEventListener('click', () => {
      modal.style.display = 'none';
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.style.display = 'none';
      }
    });
  });
</script>
`;

const vtjumpPlugin: VTJumpPlugin = (options = {}) => {
  return {
    name: 'vite-plugin-vtjump',
    transformIndexHtml(html: string) {
      return html.replace(
        '</body>',
        `${createFloatingButton()}${createModal(options)}${injectScript}</body>`
      );
    },
  };
};

export default vtjumpPlugin;
