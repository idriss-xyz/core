import {
  ExtensionSettingsStorageKey,
  extensionSettingsStorageKeys,
} from './extension-settings-manager';

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
  ) as Record<ExtensionSettingsStorageKey, boolean>;
};
