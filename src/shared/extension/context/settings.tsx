import { ReactNode, createContext } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import { onWindowMessage, useCommandMutation } from 'shared/messaging';
import { createContextHook } from 'shared/ui';

import {
  DEFAULT_EXTENSION_SETTINGS,
  GET_EXTENSION_SETTINGS_REQUEST,
  GET_EXTENSION_SETTINGS_RESPONSE,
} from '../constants';
import { ChangeExtensionSettingsCommand } from '../commands';
import { ExtensionSettings } from '../types';

interface Properties {
  children: ReactNode;
}

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
  const queryClient = useQueryClient();

  const changeExtensionSettingsMutation = useCommandMutation(
    ChangeExtensionSettingsCommand,
    {
      onMutate: (payload) => {
        queryClient.setQueryData<ExtensionSettings>(
          ['EXTENSION_SETTINGS'],
          (cachedData) => {
            if (!cachedData) {
              return { ...DEFAULT_EXTENSION_SETTINGS, ...payload.settings };
            }

            return {
              ...DEFAULT_EXTENSION_SETTINGS,
              ...cachedData,
              ...payload.settings,
            };
          },
        );
      },
    },
  );

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
        changeExtensionSetting: async (settings) => {
          await changeExtensionSettingsMutation.mutateAsync({ settings });
        },
      }}
    >
      {children}
    </ExtensionSettingsContext.Provider>
  );
};

export const useExtensionSettings = createContextHook(ExtensionSettingsContext);
