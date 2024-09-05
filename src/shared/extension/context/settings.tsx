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
  'idriss-send-enabled': false,
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

export const ExtensionSettingsContext = createContext<
  ExtensionSettingsContextValues | undefined
>(undefined);

export const ExtensionSettingsProvider = ({ children }: Properties) => {
  const [extensionSettings, setExtensionSettings] = useState<
    Record<ExtensionSettingsStorageKey, boolean>
  >(initialExtensionSettings);
  const [isContextMenuVisible, setIsContextMenuVisible] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const toggleContextMenuVisibility = useCallback(
    debounce(() => {
      setIsContextMenuVisible((previous) => {
        return !previous;
      });
    }, 50),
    [],
  );

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
    onWindowMessage<void>(TOGGLE_EXTENSION_CONTEXT_MENU_VISIBILITY, () => {
      toggleContextMenuVisibility();
    });

    onWindowMessage<Record<ExtensionSettingsStorageKey, boolean>>(
      GET_EXTENSION_SETTINGS_RESPONSE,
      (settings) => {
        setExtensionSettings(settings);
      },
    );
  }, [toggleContextMenuVisibility]);

  useEffect(() => {
    window.postMessage({
      type: GET_EXTENSION_SETTINGS_REQUEST,
    });
  }, []);

  // Clean up the debounced function on component unmount
  useEffect(() => {
    return () => {
      toggleContextMenuVisibility.cancel();
    };
  }, [toggleContextMenuVisibility]);

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
