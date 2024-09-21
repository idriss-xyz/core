import { FormProvider, useForm } from 'react-hook-form';
import { useUpdateEffect } from 'react-use';
import isEqual from 'lodash/isEqual';

import {
  EXTENSION_POPUP_ROUTE,
  ExtensionSettings,
  useExtensionPopup,
  useExtensionSettings,
} from 'shared/extension';
import { IconButton } from 'shared/ui';

import { settingListItemGroups } from './constants';
import { CustomizationSettingsGroup } from './customization-settings-group';

export const App = () => {
  const extensionPopup = useExtensionPopup();
  const { changeExtensionSetting, extensionSettings } = useExtensionSettings();
  const {
    'entire-extension-enabled': isExtensionEnabled,
    ...customizationSettings
  } = extensionSettings;

  const form = useForm<Omit<ExtensionSettings, 'entire-extension-enabled'>>({
    defaultValues: customizationSettings,
  });

  const settings = form.watch();

  useUpdateEffect(() => {
    console.log('🔥🔥🔥🔥', settings, customizationSettings);
    console.log('are equal', isEqual(settings, customizationSettings));
    if (!isEqual(settings, customizationSettings)) {
      console.log('setting from form');
      void changeExtensionSetting(settings);
    }
  }, [settings]);

  // useUpdateEffect(() => {
  //   if (!isEqual(settings, customizationSettings)) {
  //     form.reset(customizationSettings); // Sync form with updated customizationSettings
  //   }
  // }, [customizationSettings]);

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

      <div>
        <FormProvider {...form}>
          {settingListItemGroups.map((group) => {
            return (
              <CustomizationSettingsGroup
                key={group.label}
                group={group}
                disabled={!isExtensionEnabled}
              />
            );
          })}
        </FormProvider>
      </div>
    </div>
  );
};
