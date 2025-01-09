import { SwapData } from 'application/trading-copilot';

export interface Properties {
  toast: SwapData;
  ensName: string | null;
  ensAvatar: string | null;
  openDialog: (dialog: SwapData) => void;
}
