import NiceModal from '@ebay/nice-modal-react';
import { ReactNode, StrictMode } from 'react';

import { SupercastScrapingContextProvider } from 'host/supercast';
import { WarpcastScrapingContextProvider } from 'host/warpcast';
import {
  ErrorBoundary,
  WithEventsLogger,
  WithObservabilityScope,
} from 'shared/observability';
import {
  FontProvider,
  PortalProvider,
  QueryProvider,
  TailwindProvider,
  WithExtensionInfo,
} from 'shared/ui';
import { TwitterScrapingContextProvider } from 'host/twitter';
import {
  ExtensionPopupProvider,
  ExtensionSettingsProvider,
} from 'shared/extension';
import { WalletContextProvider } from 'shared/web3';

type Properties = {
  children: ReactNode;
  disabledWalletRdns?: string[];
};

export const Providers = ({
  children,
  disabledWalletRdns = [],
}: Properties) => {
  return (
    <StrictMode>
      <WithObservabilityScope>
        <ErrorBoundary>
          <WithEventsLogger>
            <PortalProvider>
              <WithExtensionInfo>
                <FontProvider>
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
                                    {children}
                                  </SupercastScrapingContextProvider>
                                </WarpcastScrapingContextProvider>
                              </TwitterScrapingContextProvider>
                            </ExtensionSettingsProvider>
                          </ExtensionPopupProvider>
                        </WalletContextProvider>
                      </NiceModal.Provider>
                    </QueryProvider>
                  </TailwindProvider>
                </FontProvider>
              </WithExtensionInfo>
            </PortalProvider>
          </WithEventsLogger>
        </ErrorBoundary>
      </WithObservabilityScope>
    </StrictMode>
  );
};
