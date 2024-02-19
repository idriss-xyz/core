import {
  POPUP_TO_WEBPAGE_MESSAGE,
  EXTENSION_SETTINGS_CHANGE,
} from '../constants';
import { ExtensionSettings } from '../types';

export class ExperimentalFeaturesSettingsManager {
  private static STORAGE_KEY = 'experimental-features';

  static enable() {
    chrome.storage.local.set({
      [ExperimentalFeaturesSettingsManager.STORAGE_KEY]: true,
    });

    ExperimentalFeaturesSettingsManager.publishMessage(true);
  }

  static disable() {
    chrome.storage.local.set({
      [ExperimentalFeaturesSettingsManager.STORAGE_KEY]: false,
    });

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

      chrome.tabs.sendMessage(activeTab?.id ?? 0, {
        type: POPUP_TO_WEBPAGE_MESSAGE,
        detail: detail,
      });
    });
  }
}
