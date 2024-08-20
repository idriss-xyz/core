import {
  ReactNode,
  createContext,
  useCallback,
  useEffect,
  useState,
} from 'react';

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

interface Properties {
  children: ReactNode;
}

const initialExtensionSettings: Record<ExtensionSettingsStorageKey, boolean> = {
  'entire-extension-enabled': false,
  'agora-enabled': false,
  'gitcoin-enabled': false,
  'polymarket-enabled': false,
  'snapshot-enabled': false,
  'tally-enabled': false,
  'tipping-enabled': false,
};

interface ExtensionSettingsContextValues {
  isContextMenuVisible: boolean;
  hideContextMenu: () => void;
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
  const [isContextMenuVisible, setIsContextMenuVisible] = useState(false);

  const hideContextMenu = useCallback(() => {
    setIsContextMenuVisible(false);
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
    console.log('setting');
    let removeListener: (() => void) | undefined;
    onWindowMessage<void>(
      TOGGLE_EXTENSION_CONTEXT_MENU_VISIBILITY,
      (_data, removeEventListener) => {
        console.log('toggling');
        removeListener = removeEventListener;
        setIsContextMenuVisible((previous) => {
          return !previous;
        });
      },
    );

    onWindowMessage<Record<ExtensionSettingsStorageKey, boolean>>(
      GET_EXTENSION_SETTINGS_RESPONSE,
      (settings, removeEventListener) => {
        setExtensionSettings(settings);
        removeEventListener();
      },
    );

    return () => {
      console.log('removing', removeListener);
      removeListener?.();
    };
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
        isContextMenuVisible,
        changeExtensionSetting,
        hideContextMenu,
      }}
    >
      {children}
    </ExtensionSettingsContext.Provider>
  );
};

export const useExtensionSettings = createContextHook(ExtensionSettingsContext);
