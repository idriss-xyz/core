import { Hex } from 'shared/web3';

export type ExtensionSettings = Record<ExtensionSettingsStorageKey, boolean>;

export type ExtensionAddressBookSettingName =
  | 'idriss-send-enabled'
  | 'wallet-lookup-enabled';

export type ExtensionGovernanceSettingName =
  | 'snapshot-enabled'
  | 'tally-enabled'
  | 'agora-enabled';

export type ExtensionIntegrationSettingName =
  | 'polymarket-enabled'
  | 'gitcoin-enabled';

export type ExtensionSettingsStorageKey =
  | 'entire-extension-enabled'
  | ExtensionAddressBookSettingName
  | ExtensionGovernanceSettingName
  | ExtensionIntegrationSettingName;

export interface StoredWallet {
  account: Hex;
  providerRdns: string;
}
