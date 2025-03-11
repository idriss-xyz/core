import { SwapData,SwapDataToken } from 'application/trading-copilot';

export interface Properties {
  toast: SwapData;
  ensName: string | null;
  avatarImage: string | null;
  openDialog: (dialog: SwapData) => void;
  tokenData: SwapDataToken;
  tokenImage: string;
}
