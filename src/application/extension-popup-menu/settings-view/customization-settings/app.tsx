import {
  ExtensionSettingsStorageKey,
  useExtensionSettings,
} from 'shared/extension';
import { Checkbox } from 'shared/ui';

import {
  getSettingsGroupState,
  mapGroupSettingsStateToExtendedCheckbox,
} from './utils';
import { SettingListItem, SettingListItemsGroup } from './types';
import {
  governanceSettings,
  integrationsSettings,
  addressBookSettings,
} from './constants';

export const App = () => {
  const { changeExtensionSetting, extensionSettings } = useExtensionSettings();

  const settingListItemGroups: SettingListItemsGroup<ExtensionSettingsStorageKey>[] =
    [
      { label: 'Address Book', settingListItems: addressBookSettings },
      { label: 'Governance', settingListItems: governanceSettings },
      { label: 'Integrations', settingListItems: integrationsSettings },
    ];

  const handleSettingGroupChange = (
    settingListItems: SettingListItem<ExtensionSettingsStorageKey>[],
    enabled: boolean,
  ) => {
    for (const setting of settingListItems) {
      void changeExtensionSetting(setting.storageKey, enabled);
    }
  };

  return (
    <div className="max-h-[220px] shrink-0 grow overflow-y-auto pl-3 text-base text-black [scrollbar-color:gray_#efefef] [scrollbar-width:thin]">
      {settingListItemGroups.map((group) => {
        const groupState = getSettingsGroupState(
          group.settingListItems.map((setting) => {
            return extensionSettings[setting.storageKey];
          }),
        );
        return (
          <div key={group.label}>
            <div className="flex flex-row items-center space-x-2 pb-3 pt-2 font-bold">
              <Checkbox
                type="extended"
                value={mapGroupSettingsStateToExtendedCheckbox(groupState)}
                onChange={(enabled) => {
                  return handleSettingGroupChange(
                    group.settingListItems,
                    enabled,
                  );
                }}
              />
              <span>{group.label}</span>
            </div>
            <div className="flex flex-col pb-3">
              {group.settingListItems.map((setting) => {
                return (
                  <div
                    key={setting.storageKey}
                    className="flex flex-row space-x-2 pb-3 pl-7"
                  >
                    <Checkbox
                      value={extensionSettings[setting.storageKey]}
                      onChange={(enabled) => {
                        return changeExtensionSetting(
                          setting.storageKey,
                          enabled,
                        );
                      }}
                    />
                    <span>{setting.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};
