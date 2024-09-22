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
import { ExtensionSettings } from '../types';

interface Properties {
  children: ReactNode;
}

const initialExtensionSettings: Record<ExtensionSettingsStorageKey, boolean> =
  createInitialExtensionSettingsStorageKeys();

interface ExtensionSettingsContextValues {
  extensionSettings: Record<ExtensionSettingsStorageKey, boolean>;
  changeExtensionSetting: (
    settings: Partial<ExtensionSettings>,
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
    settings: Partial<ExtensionSettings>,
  ) => {
    const extensionSettingsCommand = new ManageExtensionSettingsCommand({
      settings,
    });
    const extensionSettings = await extensionSettingsCommand.send();
    setExtensionSettings(extensionSettings);
  };

  useEffect(() => {
    onWindowMessage<Record<ExtensionSettingsStorageKey, boolean>>(
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
