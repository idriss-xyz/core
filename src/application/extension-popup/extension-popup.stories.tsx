import type { Meta, StoryObj } from '@storybook/react';
import { useEffect } from 'react';
import { MemoryRouter } from 'react-router-dom';

import { ExtensionSettingsProvider } from 'shared/extension';
import { TOGGLE_EXTENSION_POPUP_VISIBILITY } from 'shared/messaging';

import { App } from './app';

interface WrappedComponentProperties {
  popupVisible: boolean;
}

const WrappedComponent = ({ popupVisible }: WrappedComponentProperties) => {
  useEffect(() => {
    const message = {
      type: TOGGLE_EXTENSION_POPUP_VISIBILITY,
    };
    window.postMessage(message);
  }, [popupVisible]);

  return (
    <ExtensionSettingsProvider>
      <MemoryRouter>
        <App />
      </MemoryRouter>
    </ExtensionSettingsProvider>
  );
};

const meta: Meta<typeof WrappedComponent> = {
  title: 'application/extension-popup',
  component: WrappedComponent,
  argTypes: {
    popupVisible: {
      control: 'boolean',
      description: 'Trigger the extension popup visibility',
      defaultValue: false,
    },
  },
};

export default meta;

type Story = StoryObj<typeof WrappedComponent>;

export const Primary: Story = {};
