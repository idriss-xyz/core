import { useMemo, createElement, StrictMode } from 'react';
import NiceModal from '@ebay/nice-modal-react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';

import { Final, useLocationInfo } from 'final';
import { ExtensionSettingsProvider } from 'shared/extension';
import { PortalProvider, QueryProvider, TailwindProvider } from 'shared/ui';
import { WalletContextProvider } from 'shared/web3';
import { ErrorBoundary, WithObservabilityScope } from 'shared/observability';
import { TwitterScrapingContextProvider } from 'host/twitter';
import { WarpcastScrapingContextProvider } from 'host/warpcast';
import { SupercastScrapingContextProvider } from 'host/supercast';
import { ExtensionPopupMenu } from 'application/extension-popup-menu';
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
      <WithObservabilityScope>
        <ErrorBoundary>
          <QueryProvider>
            <WalletContextProvider disabledWalletsRdns={disabledWalletRdns}>
              <TailwindProvider>
                <ExtensionSettingsProvider>
                  <>
                    <LookUpWalletAddress />
                    <HashRouter>
                      <ExtensionPopupMenu />
                    </HashRouter>
                  </>
                </ExtensionSettingsProvider>
              </TailwindProvider>
            </WalletContextProvider>
          </QueryProvider>
        </ErrorBoundary>
      </WithObservabilityScope>
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
                    <ExtensionSettingsProvider>
                      <TwitterScrapingContextProvider>
                        <WarpcastScrapingContextProvider>
                          <SupercastScrapingContextProvider>
                            <ExtensionSettingsProvider>
                              <>
                                <HashRouter>
                                  <ExtensionPopupMenu />
                                </HashRouter>
                                <Final />
                              </>
                            </ExtensionSettingsProvider>
                          </SupercastScrapingContextProvider>
                        </WarpcastScrapingContextProvider>
                      </TwitterScrapingContextProvider>
                    </ExtensionSettingsProvider>
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
