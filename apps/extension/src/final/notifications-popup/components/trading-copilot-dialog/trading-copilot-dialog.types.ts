import { SwapData } from 'application/trading-copilot';
import { Wallet } from 'shared/web3';

export interface Properties {
  dialog: SwapData;
  closeDialog: () => void;
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
