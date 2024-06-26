import NiceModal from '@ebay/nice-modal-react';
import { PortalProvider, QueryProvider } from '../src/shared/ui';
import { WalletContextProvider } from '../src/shared/web3';
import React from 'react';
import type { Preview } from '@storybook/react';
import './tailwind.css';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    (Story) => {
      return (
        <PortalProvider>
          <QueryProvider>
            <NiceModal.Provider>
              <WalletContextProvider disabledWalletsRdns={[]}>
                <Story />
              </WalletContextProvider>
            </NiceModal.Provider>
          </QueryProvider>
        </PortalProvider>
      );
    },
  ],
};

export default preview;
