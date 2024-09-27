import { ReactNode, createContext, useEffect, useState } from 'react';

import { onWindowMessage } from 'shared/messaging';
import { createContextHook } from 'shared/ui';

import {
  GET_EXTENSION_SETTINGS_REQUEST,
  GET_EXTENSION_SETTINGS_RESPONSE,
} from '../constants';
import { ManageExtensionSettingsCommand } from '../commands';
import { ExtensionSettings } from '../types';
import { createInitialExtensionSettingsStorageKeys } from '../utils';

interface Properties {
  children: ReactNode;
}

const initialExtensionSettings: ExtensionSettings =
  createInitialExtensionSettingsStorageKeys();

interface ExtensionSettingsContextValues {
  extensionSettings: ExtensionSettings;
  changeExtensionSetting: (
    settings: Partial<ExtensionSettings>,
  ) => Promise<void>;
}

const ExtensionSettingsContext = createContext<
  ExtensionSettingsContextValues | undefined
>(undefined);

export const ExtensionSettingsProvider = ({ children }: Properties) => {
  const [extensionSettings, setExtensionSettings] = useState<ExtensionSettings>(
    initialExtensionSettings,
  );

  const changeExtensionSetting = async (
    settings: Partial<ExtensionSettings>,
  ) => {
    const extensionSettingsCommand = new ManageExtensionSettingsCommand({
      settings,
    });
    const extensionSettings = await extensionSettingsCommand.send();
    setExtensionSettings(extensionSettings);
  };

  // TODO: check if this could be achievable with usage of react-query
  useEffect(() => {
    onWindowMessage<ExtensionSettings>(
      GET_EXTENSION_SETTINGS_RESPONSE,
      async (settings) => {
        if (Object.keys(settings).length === 0) {
          //It means the extension was just installed, so we want to set initialSettings to the local storage
          await changeExtensionSetting(initialExtensionSettings);
        } else {
          setExtensionSettings(settings);
        }
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
