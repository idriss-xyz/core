import { SwapData } from 'application/trading-copilot';

export interface Properties {
  toast: SwapData;
  ensName: string | null;
  avatarImage: string | null;
  openDialog: (dialog: SwapData) => void;
  tokenData: Record<string, string>;
  tokenImage: string;
}
