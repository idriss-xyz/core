import { EXTENSION_SETTINGS_CHANGE, ExtensionSettings } from 'shared/extension';
import { POPUP_TO_WEBPAGE_MESSAGE } from 'shared/messaging';

export class ExperimentalFeaturesSettingsManager {
  private static STORAGE_KEY = 'experimental-features';

  static enable() {
    chrome.storage.local
      .set({
        [ExperimentalFeaturesSettingsManager.STORAGE_KEY]: true,
      })
      .catch(console.error);

    ExperimentalFeaturesSettingsManager.publishMessage(true);
  }

  static disable() {
    chrome.storage.local
      .set({
        [ExperimentalFeaturesSettingsManager.STORAGE_KEY]: false,
      })
      .catch(console.error);

    ExperimentalFeaturesSettingsManager.publishMessage(false);
  }

  static isEnabled(): Promise<boolean> {
    return new Promise((resolve) => {
      chrome.storage.local.get(
        [ExperimentalFeaturesSettingsManager.STORAGE_KEY],
        (result) => {
          const isEnabled = Boolean(
            result[ExperimentalFeaturesSettingsManager.STORAGE_KEY],
          );
          resolve(isEnabled);
        },
      );
    });
  }

  private static publishMessage(isEnabled: boolean) {
    const data: ExtensionSettings = {
      experimentalFeatures: isEnabled,
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
