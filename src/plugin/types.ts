import type { PluginOption } from 'vite';

export interface VTJumpOptions {
  // 可以在这里添加插件的配置选项
  modalTitle?: string;
  modalContent?: string;
  protocol?: 'vscode' | 'windsurf' | string; // 添加协议选项，默认为 'vscode'
}

// 移除默认导出声明，因为实现在 index.ts 中
export type VTJumpPlugin = (options?: VTJumpOptions) => PluginOption;
