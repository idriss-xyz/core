import { ReactNode, createContext, useEffect, useState } from 'react';

import { onWindowMessage } from 'shared/messaging';
import { createContextHook } from 'shared/ui';

import {
  GET_EXTENSION_SETTINGS_REQUEST,
  GET_EXTENSION_SETTINGS_RESPONSE,
} from '../constants';
import { ManageExtensionSettingsCommand } from '../commands';
import { ExtensionSettingsStorageKey } from '../extension-settings-manager';
import { createInitialExtensionSettingsStorageKeys } from '../utils';

interface Properties {
  children: ReactNode;
}

const initialExtensionSettings: Record<ExtensionSettingsStorageKey, boolean> =
  createInitialExtensionSettingsStorageKeys();

interface ExtensionSettingsContextValues {
  extensionSettings: Record<ExtensionSettingsStorageKey, boolean>;
  changeExtensionSetting: (
    settingKey: ExtensionSettingsStorageKey,
    enabled: boolean,
  ) => Promise<void>;
}

const ExtensionSettingsContext = createContext<
  ExtensionSettingsContextValues | undefined
>(undefined);

export const ExtensionSettingsProvider = ({ children }: Properties) => {
  const [extensionSettings, setExtensionSettings] = useState<
    Record<ExtensionSettingsStorageKey, boolean>
  >(initialExtensionSettings);

  const changeExtensionSetting = async (
    settingKey: ExtensionSettingsStorageKey,
    enabled: boolean,
  ) => {
    const command = new ManageExtensionSettingsCommand({
      settingKey: settingKey,
      enabled: enabled,
    });
    const extensionState = await command.send();
    setExtensionSettings((previous) => {
      return {
        ...previous,
        [settingKey]: extensionState,
      };
    });
  };

  useEffect(() => {
    onWindowMessage<Record<ExtensionSettingsStorageKey, boolean>>(
      GET_EXTENSION_SETTINGS_RESPONSE,
      (settings) => {
        setExtensionSettings(settings);
      },
    );
  }, []);

  useEffect(() => {
    window.postMessage({
      type: GET_EXTENSION_SETTINGS_REQUEST,
    });
  }, []);

  return (
    <ExtensionSettingsContext.Provider
      value={{
        extensionSettings,
        changeExtensionSetting,
      }}
    >
      {children}
    </ExtensionSettingsContext.Provider>
  );
};

export const useExtensionSettings = createContextHook(ExtensionSettingsContext);
