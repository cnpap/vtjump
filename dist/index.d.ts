import { Plugin } from 'vite';
import { VTJumpOptions } from './types';

declare const vtjump: (options?: VTJumpOptions) => Plugin;
export default vtjump;
