/* eslint-disable boundaries/no-unknown-files */

import { SETTINGS_STORAGE_KEY } from './constants';
import {
  ExtensionSettings,
  ExtensionSettingsStorageKey,
  StoredWallet,
} from './types';

export const ExtensionSettingsManager = {
  setSettings(settings: Partial<ExtensionSettings>) {
    return new Promise<void>((resolve) => {
      void chrome.storage.local
        .set({ [SETTINGS_STORAGE_KEY]: settings })
        .catch(console.error)
        .finally(() => {
          return resolve();
        });
    });
  },

  // TODO: move the wallet to a separate manager
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

  getAllSettings(): Promise<ExtensionSettings> {
    return new Promise((resolve) => {
      void chrome.storage.local.get([SETTINGS_STORAGE_KEY]).then((result) => {
        return resolve(
          (result[SETTINGS_STORAGE_KEY] ?? {}) as Record<
            ExtensionSettingsStorageKey,
            boolean
          >,
        );
      });
    });
  },
};
