import {
  EXTENSION_POPUP_ROUTE,
  ExtensionSettingsStorageKey,
  useExtensionPopup,
  useExtensionSettings,
} from 'shared/extension';
import { Checkbox, IconButton } from 'shared/ui';

import { mapGroupSettingsStateToBoolean } from './utils';
import { SettingListItem } from './types';
import { settingListItemGroups } from './constants';

export const App = () => {
  const { changeExtensionSetting, extensionSettings } = useExtensionSettings();
  const extensionPopup = useExtensionPopup();
  const isExtensionEnabled = extensionSettings['entire-extension-enabled'];

  const handleSettingGroupChange = (
    settingListItems: SettingListItem<ExtensionSettingsStorageKey>[],
    enabled: boolean,
  ) => {
    for (const setting of settingListItems) {
      void changeExtensionSetting(setting.storageKey, enabled);
    }
  };

  return (
    <div className="shrink-0 grow px-6 pb-2 text-black">
      <div className="sticky top-0 flex justify-center whitespace-nowrap bg-gray-100 px-5 py-4 text-lg font-bold">
        <IconButton
          className="absolute left-0 text-black hover:text-green-500"
          iconProps={{ name: 'ArrowLeftIcon', size: 25 }}
          onClick={() => {
            extensionPopup.navigate(EXTENSION_POPUP_ROUTE.SETTINGS_HOME);
          }}
        />

        <span className="capitalize">Customization</span>
      </div>

      <div className="grow pl-3 text-base text-black">
        {settingListItemGroups.map((group) => {
          const groupState = mapGroupSettingsStateToBoolean(
            group.settingListItems.map((setting) => {
              return extensionSettings[setting.storageKey];
            }),
          );
          return (
            <div key={group.label}>
              <div className="flex flex-row items-center space-x-2 pb-3 pt-2 font-bold">
                <Checkbox
                  disabledTooltipText="Enable the extension to modify these settings"
                  disabled={!isExtensionEnabled}
                  checked={isExtensionEnabled ? groupState : false}
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
                        disabledTooltipText="Enable the extension to modify these settings"
                        disabled={!isExtensionEnabled}
                        checked={
                          isExtensionEnabled
                            ? extensionSettings[setting.storageKey]
                            : false
                        }
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
    </div>
  );
};
