import { SolanaWallet, Wallet } from '@idriss-xyz/wallet-connect';

export interface ContentProperties {
  wallet: Wallet | SolanaWallet;
}
