import { ReactNode } from 'react';

import { ExtensionSettingsStorageKey } from 'shared/extension';

export interface SettingListItem<T extends ExtensionSettingsStorageKey> {
  label: string;
  storageKey: T;
}

export interface SettingListItemsGroup<T extends ExtensionSettingsStorageKey> {
  label: string;
  labelSuffixElement?: ReactNode;
  settingListItems: SettingListItem<T>[];
}
