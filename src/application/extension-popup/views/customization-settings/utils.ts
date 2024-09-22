import {
  ExtensionSettings,
  ExtensionSettingsStorageKey,
} from 'shared/extension';

import { SettingListItemsGroup } from './types';

export const isAnySettingInGroupEnabled = (
  group: SettingListItemsGroup<ExtensionSettingsStorageKey>,
  extensionSettings: Record<ExtensionSettingsStorageKey, boolean>,
) => {
  return group.settingListItems
    .map((setting) => {
      return extensionSettings[setting.storageKey];
    })
    .some(Boolean);
};

export const isWholeGroupEnabled = (
  group: SettingListItemsGroup<ExtensionSettingsStorageKey>,
  extensionSettings: Record<ExtensionSettingsStorageKey, boolean>,
) => {
  return group.settingListItems
    .map((setting) => {
      return extensionSettings[setting.storageKey];
    })
    .every(Boolean);
};

export const isGroupOnlyPartiallyEnabled = (
  group: SettingListItemsGroup<ExtensionSettingsStorageKey>,
  extensionSettings: Record<ExtensionSettingsStorageKey, boolean>,
) => {
  return (
    isAnySettingInGroupEnabled(group, extensionSettings) &&
    !isWholeGroupEnabled(group, extensionSettings)
  );
};

const getGroupWithValues = (
  group: SettingListItemsGroup<ExtensionSettingsStorageKey>,
  value: boolean,
) => {
  return Object.fromEntries(
    group.settingListItems.map((settingName) => {
      return [settingName.storageKey, value];
    }),
  ) as ExtensionSettings;
};

export const getEmptyGroup = (
  group: SettingListItemsGroup<ExtensionSettingsStorageKey>,
) => {
  return getGroupWithValues(group, false);
};

export const getFullyEnabledGroup = (
  group: SettingListItemsGroup<ExtensionSettingsStorageKey>,
) => {
  return getGroupWithValues(group, true);
};
