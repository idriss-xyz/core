import { ReactNode, createContext } from 'react';
import { useQuery } from '@tanstack/react-query';

import { onWindowMessage } from 'shared/messaging';
import { createContextHook } from 'shared/ui';

import {
  GET_EXTENSION_SETTINGS_REQUEST,
  GET_EXTENSION_SETTINGS_RESPONSE,
} from '../constants';
import { ExtensionSettings } from '../types';

interface Properties {
  children: ReactNode;
}

interface ExtensionSettingsContextValues {
  extensionSettings: ExtensionSettings;
  changeExtensionSetting: (properties: { value: boolean }) => Promise<void>;
}

const ExtensionSettingsContext = createContext<
  ExtensionSettingsContextValues | undefined
>(undefined);

export const ExtensionSettingsProvider = ({ children }: Properties) => {
  const settingsQuery = useQuery({
    queryKey: ['EXTENSION_SETTINGS'],
    queryFn: () => {
      return new Promise<ExtensionSettings>((resolve) => {
        window.postMessage({
          type: GET_EXTENSION_SETTINGS_REQUEST,
        });

        onWindowMessage<ExtensionSettings>(
          GET_EXTENSION_SETTINGS_RESPONSE,
          (settings, removeEventListener) => {
            resolve(settings);
            removeEventListener();
          },
        );
      });
    },
    staleTime: 0,
  });

  if (!settingsQuery.isSuccess) {
    return null;
  }

  return (
    <ExtensionSettingsContext.Provider
      value={{
        extensionSettings: settingsQuery.data,
        changeExtensionSetting: async () => {},
      }}
    >
      {children}
    </ExtensionSettingsContext.Provider>
  );
};

export const useExtensionSettings = createContextHook(ExtensionSettingsContext);
