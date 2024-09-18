import type { Meta, StoryObj } from '@storybook/react';
import { useEffect } from 'react';
import { MemoryRouter } from 'react-router-dom';

import { ExtensionSettingsProvider } from 'shared/extension';
import { TOGGLE_EXTENSION_CONTEXT_MENU_VISIBILITY } from 'shared/messaging';

import { App } from './app';

interface WrappedComponentProperties {
  menuVisible: boolean;
}

const WrappedComponent = ({ menuVisible }: WrappedComponentProperties) => {
  useEffect(() => {
    const message = {
      type: TOGGLE_EXTENSION_CONTEXT_MENU_VISIBILITY,
    };
    window.postMessage(message);
  }, [menuVisible]);

  return (
    <ExtensionSettingsProvider>
      <MemoryRouter>
        <App />
      </MemoryRouter>
    </ExtensionSettingsProvider>
  );
};

const meta: Meta<typeof WrappedComponent> = {
  title: 'application/extension-popup-menu',
  component: WrappedComponent,
  argTypes: {
    menuVisible: {
      control: 'boolean',
      description: 'Trigger the extension menu visibility',
      defaultValue: false,
    },
  },
};

export default meta;

type Story = StoryObj<typeof WrappedComponent>;

export const Primary: Story = {};
