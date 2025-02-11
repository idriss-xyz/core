import { SwapData, SwapDataToken } from 'application/trading-copilot';
import { SolanaWallet, Wallet } from 'shared/web3';

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
  wallet: Wallet | SolanaWallet; // TODO: Extract SolanaWallet to separate properties
  isSolanaTrade: boolean;
}

export interface TradeValueProperties {
  wallet: Wallet;
  dialog: SwapData;
}
