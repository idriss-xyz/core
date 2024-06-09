import { useMemo, createElement } from 'react';
import NiceModal from '@ebay/nice-modal-react';
import { createRoot } from 'react-dom/client';

import {
  useGetServiceStatus,
  ExtensionSettingsProvider,
} from 'shared/extension';
import {
  PortalProvider,
  QueryProvider,
  TailwindProvider,
} from 'shared/ui/providers';
import { WalletContextProvider } from 'shared/web3';
import { ErrorBoundary } from 'shared/monitoring';

import { SnapshotApp } from './snapshot';
import { GitcoinApp } from './gitcoin';
import { PolymarketApp } from './polymarket';
import { AgoraApp } from './agora';

export const bootstrap = () => {
  const root = document.createElement('div');
  const shadowRoot = root.attachShadow({ mode: 'open' });
  const reactRoot = createRoot(shadowRoot);
  reactRoot.render(createElement(ApplicationWithProviders));
  document.body.append(root);
};

const ApplicationWithProviders = () => {
  return (
    <ErrorBoundary exceptionEventName="application-runtime-error">
      <PortalProvider>
        <TailwindProvider>
          <QueryProvider>
            <NiceModal.Provider>
              <WalletContextProvider>
                <ExtensionSettingsProvider>
                  <Applications />
                </ExtensionSettingsProvider>
              </WalletContextProvider>
            </NiceModal.Provider>
          </QueryProvider>
        </TailwindProvider>
      </PortalProvider>
    </ErrorBoundary>
  );
};

const Applications = () => {
  const serviceStatusQuery = useGetServiceStatus();

  const applicationsStatus = useMemo(() => {
    return {
      polymarket: Boolean(serviceStatusQuery.data?.polymarket),
      snapshot: Boolean(serviceStatusQuery.data?.snapshot),
      gitcoin: Boolean(serviceStatusQuery.data?.gitcoin),
      agora: Boolean(serviceStatusQuery.data?.agora),
    };
  }, [
    serviceStatusQuery.data?.gitcoin,
    serviceStatusQuery.data?.polymarket,
    serviceStatusQuery.data?.snapshot,
    serviceStatusQuery.data?.agora,
  ]);

  if (!serviceStatusQuery.data) {
    return;
  }

  return (
    <>
      {applicationsStatus.polymarket ? <PolymarketApp /> : null}
      {applicationsStatus.snapshot ? <SnapshotApp /> : null}
      {applicationsStatus.gitcoin ? <GitcoinApp /> : null}
      {applicationsStatus.agora ? <AgoraApp /> : null}
    </>
  );
};
