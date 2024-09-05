import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import {
  ExtensionSettingsContext,
  ExtensionSettingsStorageKey,
} from 'shared/extension';

import { App } from './app';

const initialExtensionSettings: Record<ExtensionSettingsStorageKey, boolean> = {
  'entire-extension-enabled': false,
  'agora-enabled': false,
  'gitcoin-enabled': false,
  'polymarket-enabled': false,
  'snapshot-enabled': false,
  'tally-enabled': false,
  'idriss-send-enabled': false,
};

const WrappedComponent = () => {
  const [extensionSettings, setExtensionSettings] = useState<
    Record<ExtensionSettingsStorageKey, boolean>
  >(initialExtensionSettings);

  const changeExtensionSetting = async (
    settingKey: ExtensionSettingsStorageKey,
    enabled: boolean,
    // eslint-disable-next-line @typescript-eslint/require-await
  ) => {
    setExtensionSettings((previous) => {
      return {
        ...previous,
        [settingKey]: enabled,
      };
    });
  };

  return (
    <ExtensionSettingsContext.Provider
      value={{
        isContextMenuVisible: true,
        hideContextMenu: () => {},
        extensionSettings: extensionSettings,
        changeExtensionSetting: changeExtensionSetting,
      }}
    >
      <App />
    </ExtensionSettingsContext.Provider>
  );
};

const meta: Meta<typeof WrappedComponent> = {
  title: 'application/extension-context-menu',
  component: WrappedComponent,
};

export default meta;

type Story = StoryObj<typeof WrappedComponent>;

export const Primary: Story = {};
