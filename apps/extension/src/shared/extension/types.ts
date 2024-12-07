import { Hex } from 'shared/web3';

export type ExtensionSettings = Record<ExtensionSettingName, boolean>;

export type ExtensionSettingName =
  | 'entire-extension-enabled'
  | 'idriss-send-enabled'
  | 'wallet-lookup-enabled'
  | 'snapshot-enabled'
  | 'tally-enabled'
  | 'agora-enabled'
  | 'polymarket-enabled'
  | 'gitcoin-enabled'
  | 'trading-copilot-latest-transactions-enabled'
  | 'trading-copilot-notifications-enabled';

export interface StoredWallet {
  account: Hex;
  providerRdns: string;
}
