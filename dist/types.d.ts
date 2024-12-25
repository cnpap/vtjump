import { PluginOption } from 'vite';

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
export type VTJumpPlugin = (options?: VTJumpOptions) => PluginOption;
