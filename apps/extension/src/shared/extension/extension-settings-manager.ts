import { DEFAULT_EXTENSION_SETTINGS, SETTINGS_STORAGE_KEY } from './constants';
import { ExtensionSettings, StoredWallet, StoredSolanaWallet } from './types';

export const ExtensionSettingsManager = {
  getAllSettings(): Promise<ExtensionSettings> {
    return new Promise((resolve) => {
      void chrome.storage.local.get([SETTINGS_STORAGE_KEY]).then((result) => {
        return resolve(
          result[SETTINGS_STORAGE_KEY] ?? DEFAULT_EXTENSION_SETTINGS,
        );
      });
    });
  },

  setSettings(settings: ExtensionSettings) {
    return chrome.storage.local.set({ [SETTINGS_STORAGE_KEY]: settings });
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

  onWalletChange(callback: (newWallet: StoredWallet | undefined) => void) {
    chrome.storage.onChanged.addListener((changes, namespace) => {
      if (namespace === 'local' && changes['idriss-wallet']) {
        const newWallet = changes['idriss-wallet'].newValue
          ? (JSON.parse(changes['idriss-wallet'].newValue) as StoredWallet)
          : undefined;
        callback(newWallet);
      }
    });
  },

  saveSolanaWallet(wallet: StoredSolanaWallet) {
    return chrome.storage.local.set({
      'idriss-solana-wallet': JSON.stringify(wallet),
    });
  },

  clearSolanaWallet() {
    return chrome.storage.local.remove('idriss-solana-wallet');
  },

  getSolanaWallet(): Promise<StoredSolanaWallet | undefined> {
    return new Promise((resolve) => {
      void chrome.storage.local
        .get('idriss-solana-wallet')
        .then((storedWalletRaw) => {
          const storedWallet = storedWalletRaw['idriss-solana-wallet']
            ? (JSON.parse(
                storedWalletRaw['idriss-solana-wallet'],
              ) as StoredSolanaWallet)
            : undefined;
          return resolve(storedWallet);
        });
    });
  },

  onSolanaWalletChange(
    callback: (newWallet: StoredSolanaWallet | undefined) => void,
  ) {
    chrome.storage.onChanged.addListener((changes, namespace) => {
      if (namespace === 'local' && changes['idriss-solana-wallet']) {
        const newWallet = changes['idriss-solana-wallet'].newValue
          ? (JSON.parse(
              changes['idriss-solana-wallet'].newValue,
            ) as StoredSolanaWallet)
          : undefined;
        callback(newWallet);
      }
    });
  },
  // TODO: move the device-id to a separate manager
  setDeviceId(id: string) {
    return chrome.storage.local.set({
      'device-id': id,
    });
  },

  getDeviceId() {
    return new Promise((resolve) => {
      void chrome.storage.local.get('device-id').then((storageObject) => {
        const maybeDeviceId = storageObject['device-id'];
        const deviceId =
          typeof maybeDeviceId === 'string' ? maybeDeviceId : undefined;
        return resolve(deviceId);
      });
    });
  },
};
