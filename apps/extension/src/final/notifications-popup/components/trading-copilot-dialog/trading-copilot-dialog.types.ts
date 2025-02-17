import { Wallet } from '@idriss-xyz/wallet-connect';

import { SwapData } from 'application/trading-copilot';

export interface Properties {
  dialog: SwapData;
  closeDialog: () => void;
  tokenData: Record<string, string>;
  tokenImage: string;
}

export interface ContentProperties extends Properties {
  userName: string;
}

export interface WalletBalanceProperties {
  wallet: Wallet;
}

export interface TradeValueProperties {
  wallet: Wallet;
  dialog: SwapData;
}
