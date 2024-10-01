import React from 'react';
import NiceModal from '@ebay/nice-modal-react';
import type { Preview } from '@storybook/react';

import { PortalProvider, QueryProvider } from '../src/shared/ui';
import { WithObservabilityScope } from '../src/shared/observability';
import { WalletContextProvider } from '../src/shared/web3';
import { ExtensionSettingsProvider } from '../src/shared/extension';

import './tailwind.css';

const preview: Preview = {
  decorators: [
    (Story) => {
      return (
        <WithObservabilityScope>
          <PortalProvider>
            <QueryProvider>
              <NiceModal.Provider>
                <WalletContextProvider disabledWalletsRdns={[]}>
                  <ExtensionSettingsProvider>
                    <Story />
                  </ExtensionSettingsProvider>
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
