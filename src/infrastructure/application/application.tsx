import { useMemo, createElement, StrictMode } from 'react';
import NiceModal from '@ebay/nice-modal-react';
import { createRoot } from 'react-dom/client';

import { Final, useLocationInfo } from 'final';
import {
  ExtensionPopupProvider,
  ExtensionSettingsProvider,
} from 'shared/extension';
import { PortalProvider, QueryProvider, TailwindProvider } from 'shared/ui';
import { WalletContextProvider } from 'shared/web3';
import { ErrorBoundary, WithObservabilityScope } from 'shared/observability';
import { TwitterScrapingContextProvider } from 'host/twitter';
import { WarpcastScrapingContextProvider } from 'host/warpcast';
import { SupercastScrapingContextProvider } from 'host/supercast';
import { ExtensionPopup } from 'application/extension-popup';
import { LookUpWalletAddress } from 'application/look-up-wallet-address';
export class Application {
  private constructor() {}

  static run() {
    bootstrap();
  }
}

const bootstrap = () => {
  const root = document.createElement('div');
  const shadowRoot = root.attachShadow({ mode: 'open' });
  const reactRoot = createRoot(shadowRoot);
  reactRoot.render(createElement(ApplicationWithProviders));
  document.body.append(root);
};

const ApplicationWithProviders = () => {
  const { isTwitter, isWarpcast, isSupercast } = useLocationInfo();

  const disabledWalletRdns = useMemo(() => {
    if (isTwitter) {
      return ['coinbase'];
    }
    return [];
  }, [isTwitter]);

  const isExpectedPage = isTwitter || isWarpcast || isSupercast;

  if (!isExpectedPage) {
    return (
      <StrictMode>
        <WithObservabilityScope>
          <ErrorBoundary>
            <PortalProvider>
              <TailwindProvider>
                <QueryProvider>
                  <NiceModal.Provider>
                    <WalletContextProvider
                      disabledWalletsRdns={disabledWalletRdns}
                    >
                      <ExtensionPopupProvider>
                        <ExtensionSettingsProvider>
                          <>
                            <LookUpWalletAddress />
                            <ExtensionPopup />
                          </>
                        </ExtensionSettingsProvider>
                      </ExtensionPopupProvider>
                    </WalletContextProvider>
                  </NiceModal.Provider>
                </QueryProvider>
              </TailwindProvider>
            </PortalProvider>
          </ErrorBoundary>
        </WithObservabilityScope>
      </StrictMode>
    );
  }

  return (
    <StrictMode>
      <WithObservabilityScope>
        <ErrorBoundary>
          <PortalProvider>
            <TailwindProvider>
              <QueryProvider>
                <NiceModal.Provider>
                  <WalletContextProvider
                    disabledWalletsRdns={disabledWalletRdns}
                  >
                    <ExtensionPopupProvider>
                      <ExtensionSettingsProvider>
                        <TwitterScrapingContextProvider>
                          <WarpcastScrapingContextProvider>
                            <SupercastScrapingContextProvider>
                              <>
                                <ExtensionPopup />
                                <Final />
                              </>
                            </SupercastScrapingContextProvider>
                          </WarpcastScrapingContextProvider>
                        </TwitterScrapingContextProvider>
                      </ExtensionSettingsProvider>
                    </ExtensionPopupProvider>
                  </WalletContextProvider>
                </NiceModal.Provider>
              </QueryProvider>
            </TailwindProvider>
          </PortalProvider>
        </ErrorBoundary>
      </WithObservabilityScope>
    </StrictMode>
  );
};
