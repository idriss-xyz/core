/* eslint-disable boundaries/no-unknown-files */
import { EXTENSION_SETTINGS_CHANGE, ExtensionSettings } from 'shared/extension';
import { POPUP_TO_WEBPAGE_MESSAGE } from 'shared/messaging';

const STORAGE_KEY = 'extension-status';
export class ExtensionStatusManager {
  static enable() {
    chrome.storage.local
      .set({
        [STORAGE_KEY]: true,
      })
      .catch(console.error);

    ExtensionStatusManager.publishMessage(true);
  }

  static disable() {
    chrome.storage.local
      .set({
        [STORAGE_KEY]: false,
      })
      .catch(console.error);

    ExtensionStatusManager.publishMessage(false);
  }

  static isEnabled(): Promise<boolean> {
    return new Promise((resolve) => {
      chrome.storage.local.get([STORAGE_KEY], (result) => {
        const isEnabled = Boolean(result[STORAGE_KEY] ?? true);
        resolve(isEnabled);
      });
    });
  }

  private static publishMessage(isEnabled: boolean) {
    const data: Partial<ExtensionSettings> = {
      enabled: isEnabled,
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
