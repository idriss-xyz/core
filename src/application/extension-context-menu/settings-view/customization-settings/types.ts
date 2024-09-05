import { ExtensionSettingsStorageKey } from 'shared/extension';

export interface SettingListItem {
  label: string;
  storageKey: ExtensionSettingsStorageKey;
}

export interface SettingListItemsGroup {
  label: string;
  settingListItems: SettingListItem[];
}
