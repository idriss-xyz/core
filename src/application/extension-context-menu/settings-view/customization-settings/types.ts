import { ExtensionSettingsStorageKey } from 'shared/extension';

export interface SettingListItem<T extends ExtensionSettingsStorageKey> {
  label: string;
  storageKey: T;
}

export interface SettingListItemsGroup<T extends ExtensionSettingsStorageKey> {
  label: string;
  settingListItems: SettingListItem<T>[];
}
