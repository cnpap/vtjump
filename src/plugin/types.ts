import type { PluginOption } from 'vite';

export interface VTJumpOptions {
  // 可以在这里添加插件的配置选项
  modalTitle?: string;
  modalContent?: string;
}

// 移除默认导出声明，因为实现在 index.ts 中
export type VTJumpPlugin = (options?: VTJumpOptions) => PluginOption;
