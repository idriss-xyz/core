import NiceModal from '@ebay/nice-modal-react';
import { createRoot } from 'react-dom/client';
import { createElement } from 'react';

import {
  PortalContextProvider,
  WithQueryClient,
  WithTailwind,
} from 'shared/ui/providers';
import { WalletContextProvider } from 'shared/web3';
import { ExtensionSettingsProvider } from 'shared/extension';
import { TwitterPageProvider } from 'shared/twitter';
import { ErrorBoundary } from 'shared/monitoring';

import { Applications } from './applications.component';

const Bootstrap = () => {
  return (
    <ErrorBoundary exceptionEventName="application-runtime-error">
      <PortalContextProvider>
        <WithTailwind>
          <WithQueryClient>
            <NiceModal.Provider>
              <WalletContextProvider>
                <ExtensionSettingsProvider>
                  <TwitterPageProvider>
                    <Applications />
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

export const bootstrapApplication = () => {
  const root = document.createElement('div');
  const shadowRoot = root.attachShadow({ mode: 'open' });
  const reactRoot = createRoot(shadowRoot);
  reactRoot.render(createElement(Bootstrap));
  document.body.append(root);
};
