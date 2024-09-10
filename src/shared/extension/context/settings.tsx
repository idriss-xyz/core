import {
  ReactNode,
  createContext,
  useCallback,
  useEffect,
  useState,
} from 'react';
import debounce from 'lodash.debounce';

import {
  onWindowMessage,
  TOGGLE_EXTENSION_CONTEXT_MENU_VISIBILITY,
} from 'shared/messaging';
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
  isPopupMenuVisible: boolean;
  hidePopupMenu: () => void;
  extensionSettings: Record<ExtensionSettingsStorageKey, boolean>;
  changeExtensionSetting: (
    settingKey: ExtensionSettingsStorageKey,
    enabled: boolean,
  ) => Promise<void>;
}

export const ExtensionSettingsContext = createContext<
  ExtensionSettingsContextValues | undefined
>(undefined);

export const ExtensionSettingsProvider = ({ children }: Properties) => {
  const [extensionSettings, setExtensionSettings] = useState<
    Record<ExtensionSettingsStorageKey, boolean>
  >(initialExtensionSettings);
  const [isPopupMenuVisible, setIsPopupMenuVisible] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const togglePopupMenuVisibility = useCallback(
    debounce(() => {
      setIsPopupMenuVisible((previous) => {
        return !previous;
      });
    }, 50),
    [],
  );

  const hidePopupMenu = useCallback(() => {
    setIsPopupMenuVisible(false);
  }, []);

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
    onWindowMessage<void>(TOGGLE_EXTENSION_CONTEXT_MENU_VISIBILITY, () => {
      togglePopupMenuVisibility();
    });

    onWindowMessage<Record<ExtensionSettingsStorageKey, boolean>>(
      GET_EXTENSION_SETTINGS_RESPONSE,
      (settings) => {
        setExtensionSettings(settings);
      },
    );
  }, [togglePopupMenuVisibility]);

  useEffect(() => {
    window.postMessage({
      type: GET_EXTENSION_SETTINGS_REQUEST,
    });
  }, []);

  // Clean up the debounced function on component unmount
  useEffect(() => {
    return () => {
      togglePopupMenuVisibility.cancel();
    };
  }, [togglePopupMenuVisibility]);

  return (
    <ExtensionSettingsContext.Provider
      value={{
        extensionSettings,
        isPopupMenuVisible: isPopupMenuVisible,
        changeExtensionSetting,
        hidePopupMenu: hidePopupMenu,
      }}
    >
      {children}
    </ExtensionSettingsContext.Provider>
  );
};

export const useExtensionSettings = createContextHook(ExtensionSettingsContext);
