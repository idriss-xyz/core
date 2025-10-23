import { DEFAULT_EXTENSION_SETTINGS, SETTINGS_STORAGE_KEY } from './constants';
import { ExtensionSettings } from './types';

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
