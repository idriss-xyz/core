import { SwapData } from 'application/trading-copilot';

export interface Properties {
  toast: SwapData;
  openDialog: (dialog: SwapData) => void;
}

export interface ContentProperties extends Properties {
  userName: string;
}
