import { ExtensionSettings, ExtensionSettingsStorageKey } from './types';
import { extensionSettingsStorageKeys } from './constants';

const initiallyDisabledExtensionSettingsStorageKeys: ExtensionSettingsStorageKey[] =
  [] as const;

export const createInitialExtensionSettingsStorageKeys = () => {
  return Object.fromEntries(
    extensionSettingsStorageKeys.map((key) => {
      return [
        key,
        !initiallyDisabledExtensionSettingsStorageKeys.includes(key),
      ];
    }),
  ) as ExtensionSettings;
};
