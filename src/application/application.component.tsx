import NiceModal from '@ebay/nice-modal-react';

import {
  PortalContextProvider,
  WithQueryClient,
  WithTailwind,
} from 'shared/ui/providers';
import { WalletContextProvider } from 'shared/web3';
import { ExtensionSettingsProvider } from 'shared/extension';
import { TwitterPageProvider } from 'shared/twitter';
import { ErrorBoundary } from 'shared/monitoring';

import { PolymarketApp } from './polymarket';
import { SnapshotApp } from './snapshot';

export const Application = () => {
  return (
    <ErrorBoundary exceptionEventName="application-runtime-error">
      <PortalContextProvider>
        <WithTailwind>
          <WithQueryClient>
            <NiceModal.Provider>
              <WalletContextProvider>
                <ExtensionSettingsProvider>
                  <TwitterPageProvider>
                    <PolymarketApp />
                    <SnapshotApp />
                  </TwitterPageProvider>
                </ExtensionSettingsProvider>
              </WalletContextProvider>
            </NiceModal.Provider>
          </WithQueryClient>
        </WithTailwind>
      </PortalContextProvider>
    </ErrorBoundary>
  );
};
