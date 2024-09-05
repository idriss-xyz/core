import {
  ExtensionSettingsStorageKey,
  extensionSettingsStorageKeys,
} from './extension-settings-manager';

// eslint-disable-next-line unicorn/prefer-set-has
const initiallyDisabledExtensionSettingsStorageKeys: ExtensionSettingsStorageKey[] =
  ['block-explorers'];

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
