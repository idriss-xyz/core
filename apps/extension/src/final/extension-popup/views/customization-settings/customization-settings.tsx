import { FormProvider, useForm } from 'react-hook-form';
import { useUpdateEffect } from 'react-use';
import isEqual from 'lodash/isEqual';
import { useMemo, useRef } from 'react';

import {
  EXTENSION_POPUP_ROUTE,
  ExtensionSettings,
  ExtensionSettingsStorageKey,
  useExtensionSettings,
} from 'shared/extension';

import { SettingsLayout } from '../../components';
import { NavigateButton } from '../../components/navigate-button';

import {
  addressBookSettings,
  governanceSettings,
  integrationsSettings,
  tradingCopilotSettings,
} from './constants';
import { CustomizationSettingsGroup } from './customization-settings-group';
import { SettingListItemsGroup } from './types';

type ExtensionSettingsFormValues = Omit<
  ExtensionSettings,
  'entire-extension-enabled'
>;

export const CustomizationSettingsView = () => {
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

  //TODO: remove below when trading copilot feature is ready
  // The _tradingCopilotListGroup is just assigned to use all imports,
  // without that PR will not pass the unused-exports check
  //@ts-expect-error-unused-declaration
  const _tradingCopilotListGroup = {
    label: 'Trading Copilot',
    labelSuffixElement: (
      <NavigateButton
        iconName="ChevronRightIcon"
        navigateURL={EXTENSION_POPUP_ROUTE.TRADING_COPILOT}
      />
    ),
    settingListItems: tradingCopilotSettings,
  };

  const settingListItemGroups: SettingListItemsGroup<ExtensionSettingsStorageKey>[] =
    useMemo(() => {
      return [
        //TODO: uncomment below when trading copilot feature is ready
        // Below part is commented to quickly get back to it's development and to hide it on production
        // {
        //   label: 'Trading Copilot',
        //   labelSuffixElement: (
        //     <NavigateButton
        //       iconName="ChevronRightIcon"
        //       navigateURL={EXTENSION_POPUP_ROUTE.TRADING_COPILOT}
        //     />
        //   ),
        //   settingListItems: tradingCopilotSettings,
        // },
        { label: 'Address Book', settingListItems: addressBookSettings },
        { label: 'Governance', settingListItems: governanceSettings },
        { label: 'Integrations', settingListItems: integrationsSettings },
      ];
    }, []);

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
      <SettingsLayout.Header />
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
