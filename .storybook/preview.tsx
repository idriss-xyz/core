import NiceModal from '@ebay/nice-modal-react';
import { PortalProvider, QueryProvider } from '../src/shared/ui';
import { WithObservabilityScope } from '../src/shared/observability';
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
        <WithObservabilityScope>
          <PortalProvider>
            <QueryProvider>
              <NiceModal.Provider>
                <WalletContextProvider disabledWalletsRdns={[]}>
                  <Story />
                </WalletContextProvider>
              </NiceModal.Provider>
            </QueryProvider>
          </PortalProvider>
        </WithObservabilityScope>
      );
    },
  ],
};

export default preview;
