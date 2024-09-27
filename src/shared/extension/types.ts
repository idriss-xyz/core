import { Hex } from 'shared/web3';

import {
  extensionAddressBookSettingsStorageKeys,
  extensionGovernanceSettingsStorageKeys,
  extensionIntegrationSettingsStorageKeys,
  extensionSettingsStorageKeys,
} from './constants';

export type ExtensionSettings = Record<ExtensionSettingsStorageKey, boolean>;

export type ExtensionAddressBookSettingsStorageKeys =
  (typeof extensionAddressBookSettingsStorageKeys)[number];

export type ExtensionGovernanceSettingsStorageKeys =
  (typeof extensionGovernanceSettingsStorageKeys)[number];

export type ExtensionIntegrationSettingsStorageKeys =
  (typeof extensionIntegrationSettingsStorageKeys)[number];

export type ExtensionSettingsStorageKey =
  (typeof extensionSettingsStorageKeys)[number];

export interface StoredWallet {
  account: Hex;
  providerRdns: string;
}
