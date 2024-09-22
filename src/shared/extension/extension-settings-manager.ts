/* eslint-disable boundaries/no-unknown-files */

import { Hex } from 'shared/web3';

import { ExtensionSettings } from './types';

const extensionAddressBookSettingsStorageKeys = [
  'idriss-send-enabled',
  'wallet-lookup-enabled',
] as const;

export type ExtensionAddressBookSettingsStorageKeys =
  (typeof extensionAddressBookSettingsStorageKeys)[number];

const extensionGovernanceSettingsStorageKeys = [
  'snapshot-enabled',
  'tally-enabled',
  'agora-enabled',
] as const;

export type ExtensionGovernanceSettingsStorageKeys =
  (typeof extensionGovernanceSettingsStorageKeys)[number];

const extensionIntegrationSettingsStorageKeys = [
  'polymarket-enabled',
  'gitcoin-enabled',
] as const;

export type ExtensionIntegrationSettingsStorageKeys =
  (typeof extensionIntegrationSettingsStorageKeys)[number];

export const extensionSettingsStorageKeys = [
  'entire-extension-enabled',
  ...extensionAddressBookSettingsStorageKeys,
  ...extensionGovernanceSettingsStorageKeys,
  ...extensionIntegrationSettingsStorageKeys,
] as const;

export type ExtensionSettingsStorageKey =
  (typeof extensionSettingsStorageKeys)[number];

interface StoredWallet {
  account: Hex;
  providerRdns: string;
}

export const ExtensionSettingsManager = {
  setSettings(settings: Partial<ExtensionSettings>) {
    chrome.storage.local.set(settings).catch(console.error);
  },

  saveWallet(wallet: StoredWallet) {
    return chrome.storage.local.set({
      'idriss-wallet': JSON.stringify(wallet),
    });
  },

  clearWallet() {
    return chrome.storage.local.remove('idriss-wallet');
  },

  getWallet(): Promise<StoredWallet | undefined> {
    return new Promise((resolve) => {
      void chrome.storage.local.get('idriss-wallet').then((storedWalletRaw) => {
        const storedWallet = storedWalletRaw['idriss-wallet']
          ? (JSON.parse(storedWalletRaw['idriss-wallet']) as StoredWallet)
          : undefined;
        return resolve(storedWallet);
      });
    });
  },

  getAllSettings(): Promise<Record<ExtensionSettingsStorageKey, boolean>> {
    return new Promise((resolve) => {
      void chrome.storage.local.get().then((result) => {
        return resolve(result as Record<ExtensionSettingsStorageKey, boolean>);
      });
    });
  },

  isEnabled(storageKey: ExtensionSettingsStorageKey): Promise<boolean> {
    return new Promise((resolve) => {
      chrome.storage.local.get([storageKey], (result) => {
        const isEnabled = Boolean(result[storageKey] ?? true);
        resolve(isEnabled);
      });
    });
  },
};
