import NiceModal from '@ebay/nice-modal-react';
import { ReactNode, StrictMode } from 'react';
import { WithPortal } from '@idriss-xyz/ui/providers/with-portal';

import { SupercastScrapingContextProvider } from 'host/supercast';
import { WarpcastScrapingContextProvider } from 'host/warpcast';
import {
  ErrorBoundary,
  WithEventsLogger,
  WithObservabilityScope,
} from 'shared/observability';
import {
  NotificationsProvider,
  FontProvider,
  PortalProvider,
  QueryProvider,
  TailwindProvider,
  WithExtensionInfo,
} from 'shared/ui';
import { TwitterScrapingContextProvider } from 'host/twitter';
import {
  AuthTokenContextProvider,
  ExtensionPopupProvider,
  ExtensionSettingsProvider,
  WalletContextProvider,
} from 'shared/extension';
import { AuthTokenStorage, WalletStorage } from 'shared/web3';

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
            <WithPortal>
              <PortalProvider>
                <WithExtensionInfo>
                  <FontProvider>
                    <TailwindProvider>
                      <QueryProvider>
                        <NiceModal.Provider>
                          <AuthTokenContextProvider
                            onGetAuthToken={AuthTokenStorage.get}
                            onClearAuthToken={AuthTokenStorage.clear}
                            onSaveAuthToken={AuthTokenStorage.save}
                          >
                            <NotificationsProvider>
                              <WalletContextProvider
                                disabledWalletsRdns={disabledWalletRdns}
                                onGetWallet={WalletStorage.get}
                                onClearWallet={WalletStorage.clear}
                                onSaveWallet={WalletStorage.save}
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
                            </NotificationsProvider>
                          </AuthTokenContextProvider>
                        </NiceModal.Provider>
                      </QueryProvider>
                    </TailwindProvider>
                  </FontProvider>
                </WithExtensionInfo>
              </PortalProvider>
            </WithPortal>
          </WithEventsLogger>
        </ErrorBoundary>
      </WithObservabilityScope>
    </StrictMode>
  );
};
