import { SwapData, SwapDataToken } from 'application/trading-copilot';
import { CHAIN, Wallet } from 'shared/web3';

export interface Properties {
  dialog: SwapData;
  closeDialog: () => void;
  tokenData: SwapDataToken | null;
  tokenImage: string;
}

export interface ContentProperties extends Properties {
  userName: string;
}

export interface WalletBalanceProperties {
  network: keyof typeof CHAIN | 'SOLANA';
  balance: string | null | undefined;
}

export interface TradeValueProperties {
  wallet: Wallet;
  dialog: SwapData;
}
