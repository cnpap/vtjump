import type { PluginOption } from 'vite';

export interface VTJumpOptions {
  /**
   * IDE protocol to use (e.g., 'vscode', 'idea')
   */
  protocol?: string;

  /**
   * Whether to open the file in the browser (true) or let the server handle it (false)
   * @default false
   */
  clientSideOpen?: boolean;
}

// 移除默认导出声明，因为实现在 index.ts 中
export type VTJumpPlugin = (options?: VTJumpOptions) => PluginOption;
