import { Wallet, SolanaWallet } from '@idriss-xyz/wallet-connect';

import { SwapData, SwapDataToken } from 'application/trading-copilot';
import { CHAIN } from 'shared/web3';

export interface Properties {
  dialog: SwapData;
  closeDialog: () => void;
  tokenData: SwapDataToken | null;
  tokenImage: string;
  userName: string;
  userAvatar: string | null;
}

export interface WalletBalanceProperties {
  network: keyof typeof CHAIN | 'SOLANA';
  balance: string | null | undefined;
}

export interface TradeValueProperties {
  wallet: Wallet | SolanaWallet;
  dialog: SwapData;
}
