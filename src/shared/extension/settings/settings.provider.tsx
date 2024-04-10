import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ReactNode, useCallback, useEffect } from 'react';

import { onWindowMessage } from 'shared/messaging';

import { ExtensionSettings } from '../extension.types';
import {
  EXTENSION_SETTINGS_CHANGE,
  GET_EXTENSION_SETTINGS_REQUEST,
  GET_EXTENSION_SETTINGS_RESPONSE,
} from '../extension.constants';

import { ExtensionSettingsContext } from './settings.context';

interface Properties {
  children: ReactNode;
}

export const ExtensionSettingsProvider = ({ children }: Properties) => {
  const queryClient = useQueryClient();

  const getInitialSettings = useCallback((): Promise<ExtensionSettings> => {
    return new Promise((resolve) => {
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
  }, []);

  const settingsQuery = useQuery({
    queryKey: ['settings'],
    queryFn: getInitialSettings,
  });

  useEffect(() => {
    onWindowMessage<ExtensionSettings>(
      EXTENSION_SETTINGS_CHANGE,
      (settings) => {
        queryClient.setQueryData<ExtensionSettings>(['settings'], () => {
          return settings;
        });
      },
    );
  }, [queryClient]);

  if (!settingsQuery.data) {
    return null;
  }

  return (
    <ExtensionSettingsContext.Provider value={settingsQuery.data}>
      {children}
    </ExtensionSettingsContext.Provider>
  );
};
