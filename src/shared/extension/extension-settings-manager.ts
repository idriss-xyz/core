/* eslint-disable boundaries/no-unknown-files */

import { POPUP_TO_WEBPAGE_MESSAGE } from '../messaging';

import { EXTENSION_SETTINGS_CHANGE } from './constants';
import { ExtensionSettings } from './types';

const extensionAddressBookSettingsStorageKeys = [
  'idriss-send-enabled',
  'block-explorers-enabled',
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

export class ExtensionSettingsManager {
  static enable(storageKey: ExtensionSettingsStorageKey) {
    chrome.storage.local
      .set({
        [storageKey]: true,
      })
      .catch(console.error);

    this.publishMessage(true);
  }

  static disable(storageKey: ExtensionSettingsStorageKey) {
    chrome.storage.local
      .set({
        [storageKey]: false,
      })
      .catch(console.error);

    this.publishMessage(false);
  }

  static getAllSettings(): Promise<
    Record<ExtensionSettingsStorageKey, boolean>
  > {
    return new Promise((resolve) => {
      void chrome.storage.local.get().then((result) => {
        return resolve(result as Record<ExtensionSettingsStorageKey, boolean>);
      });
    });
  }

  static isEnabled(storageKey: ExtensionSettingsStorageKey): Promise<boolean> {
    return new Promise((resolve) => {
      chrome.storage.local.get([storageKey], (result) => {
        const isEnabled = Boolean(result[storageKey] ?? true);
        resolve(isEnabled);
      });
    });
  }

  private static publishMessage(isEnabled: boolean) {
    const data: Partial<ExtensionSettings> = {
      isExtensionEnabled: isEnabled,
    };

    const detail = {
      postMessageType: EXTENSION_SETTINGS_CHANGE,
      data,
    };

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];

      chrome.tabs
        .sendMessage(activeTab?.id ?? 0, {
          type: POPUP_TO_WEBPAGE_MESSAGE,
          detail: detail,
        })
        .catch(console.error);
    });
  }
}
