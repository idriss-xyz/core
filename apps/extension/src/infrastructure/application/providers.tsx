import NiceModal from '@ebay/nice-modal-react';
import { ReactNode, StrictMode } from 'react';
import { WithPortal } from '@idriss-xyz/ui/providers/with-portal';

import { ErrorBoundary } from 'shared/observability';
import {
  NotificationsProvider,
  FontProvider,
  PortalProvider,
  QueryProvider,
  TailwindProvider,
  WithExtensionInfo,
} from 'shared/ui';
import {
  ExtensionPopupProvider,
  ExtensionSettingsProvider,
} from 'shared/extension';

type Properties = {
  children: ReactNode;
  disabledWalletRdns?: string[];
};

export const Providers = ({ children }: Properties) => {
  return (
    <StrictMode>
      <ErrorBoundary>
        <WithPortal>
          <PortalProvider>
            <WithExtensionInfo>
              <FontProvider>
                <TailwindProvider>
                  <QueryProvider>
                    <NiceModal.Provider>
                      <NotificationsProvider>
                        <ExtensionPopupProvider>
                          <ExtensionSettingsProvider>
                            {children}
                          </ExtensionSettingsProvider>
                        </ExtensionPopupProvider>
                      </NotificationsProvider>
                    </NiceModal.Provider>
                  </QueryProvider>
                </TailwindProvider>
              </FontProvider>
            </WithExtensionInfo>
          </PortalProvider>
        </WithPortal>
      </ErrorBoundary>
    </StrictMode>
  );
};
