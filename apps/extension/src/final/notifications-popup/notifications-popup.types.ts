import { SwapData } from 'application/trading-copilot';

export interface ContentProperties {
  closeDialog: () => void;
  activeDialog: SwapData | null;
  openDialog: (dialog: SwapData) => void;
}
