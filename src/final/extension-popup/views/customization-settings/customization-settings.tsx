import { FormProvider, useForm } from 'react-hook-form';
import { useUpdateEffect } from 'react-use';
import isEqual from 'lodash/isEqual';
import { useMemo, useRef } from 'react';

import { EXTENSION_POPUP_ROUTE, ExtensionSettings, useExtensionPopup, useExtensionSettings } from 'shared/extension';
import { IconButton } from 'shared/ui';

import { SettingsLayout } from '../../components';

import { settingListItemGroups } from './constants';
import { CustomizationSettingsGroup } from './customization-settings-group';

type ExtensionSettingsFormValues = Omit<
  ExtensionSettings,
  'entire-extension-enabled'
>;

export const CustomizationSettingsView = () => {
  const extensionPopup = useExtensionPopup();
  const { changeExtensionSetting, extensionSettings } = useExtensionSettings();

  const isExtensionEnabled = useMemo(() => {
    return extensionSettings['entire-extension-enabled'];
  }, [extensionSettings]);

  const customizationSettings = useMemo(() => {
    const { 'entire-extension-enabled': _, ...customizationSettings } =
      extensionSettings;

    return customizationSettings;
  }, [extensionSettings]);

  /**we are using the previousFormValues ref to detect:
    - if the formValues changed and the extension settings should be updated
    - if the extension settings changed (e.g. in another tab) and the form values should be updated
  */
  const previousFormValues = useRef<ExtensionSettingsFormValues>(
    customizationSettings,
  );

  const form = useForm<ExtensionSettingsFormValues>({
    defaultValues: customizationSettings,
  });

  const formValues = form.watch();

  useUpdateEffect(() => {
    //if the formValues has changed
    if (!isEqual(formValues, previousFormValues.current)) {
      previousFormValues.current = formValues;
      void changeExtensionSetting(formValues);
      return;
    }
  }, [changeExtensionSetting, formValues]);

  useUpdateEffect(() => {
    //if the customizationSettings has changed (e.g. in other tab)
    if (!isEqual(previousFormValues.current, customizationSettings)) {
      previousFormValues.current = customizationSettings;
      form.reset(customizationSettings); // Sync form with updated customizationSettings
      return;
    }
  }, [customizationSettings, form]);

  return (
    <SettingsLayout>
      <SettingsLayout.Header
        title="Customization"
        prefix={
          <IconButton
            className="text-black hover:text-green-500"
            iconProps={{ name: 'ArrowLeftIcon', size: 25 }}
            onClick={() => {
              extensionPopup.navigate(EXTENSION_POPUP_ROUTE.SETTINGS_HOME);
            }}
          />
        }
      />
      <SettingsLayout.Body>
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
      </SettingsLayout.Body>
    </SettingsLayout>
  );
};
