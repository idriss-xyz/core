/* eslint-disable boundaries/no-unknown-files */
import { EXTENSION_SETTINGS_CHANGE, ExtensionSettings } from 'shared/extension';
import { POPUP_TO_WEBPAGE_MESSAGE } from 'shared/messaging';

export class ExtensionStatusManager {
  private static STORAGE_KEY = 'extension-status';

  static enable() {
    chrome.storage.local
      .set({
        [this.STORAGE_KEY]: true,
      })
      .catch(console.error);

    this.publishMessage(true);
  }

  static disable() {
    chrome.storage.local
      .set({
        [this.STORAGE_KEY]: false,
      })
      .catch(console.error);

    this.publishMessage(false);
  }

  static isEnabled(): Promise<boolean> {
    return new Promise((resolve) => {
      chrome.storage.local.get([this.STORAGE_KEY], (result) => {
        const isEnabled = Boolean(result[this.STORAGE_KEY] ?? true);
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
