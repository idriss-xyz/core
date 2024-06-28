import { useMemo, createElement, StrictMode, useEffect } from 'react';
import NiceModal from '@ebay/nice-modal-react';
import { createRoot } from 'react-dom/client';

import {
  ExtensionSettingsProvider,
  GetServiceStatusCommand,
  useExtensionSettings,
} from 'shared/extension';
import { PortalProvider, QueryProvider, TailwindProvider } from 'shared/ui';
import { WalletContextProvider } from 'shared/web3';
import { ErrorBoundary } from 'shared/observability';
import { PolymarketApp } from 'application/polymarket';
import { SnapshotApp } from 'application/snapshot';
// import { GitcoinApp } from 'application/gitcoin';
import { IdrissSendApp } from 'application/idriss-send';
import { useCommandQuery } from 'shared/messaging';
import {
  TwitterScrapingContextProvider,
  useTwitterLocationInfo,
} from 'host/twitter';
import {
  WarpcastScrapingContextProvider,
  useWarpcastLocationInfo,
} from 'host/warpcast';
import { AgoraApp } from 'application/agora';
import { TallyApp } from 'application/tally';
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
  const { isTwitter } = useTwitterLocationInfo();

  const disabledWalletRdns = useMemo(() => {
    if (isTwitter) {
      return ['coinbase'];
    }
    return [];
  }, [isTwitter]);

  return (
    <StrictMode>
      <ErrorBoundary exceptionEventName="application-runtime-error">
        <PortalProvider>
          <TailwindProvider>
            <QueryProvider>
              <NiceModal.Provider>
                <WalletContextProvider disabledWalletsRdns={disabledWalletRdns}>
                  <ExtensionSettingsProvider>
                    <TwitterScrapingContextProvider>
                      <WarpcastScrapingContextProvider>
                        <Applications />
                      </WarpcastScrapingContextProvider>
                    </TwitterScrapingContextProvider>
                  </ExtensionSettingsProvider>
                </WalletContextProvider>
              </NiceModal.Provider>
            </QueryProvider>
          </TailwindProvider>
        </PortalProvider>
      </ErrorBoundary>
    </StrictMode>
  );
};

const Applications = () => {
  const { isTwitter } = useTwitterLocationInfo();
  const { isWarpcast } = useWarpcastLocationInfo();
  const { enabled } = useExtensionSettings();

  const serviceStatusQuery = useCommandQuery({
    staleTime: Number.POSITIVE_INFINITY,
    command: new GetServiceStatusCommand({}),
    enabled: isTwitter || isWarpcast,
  });

  const applicationsStatus = useMemo(() => {
    return {
      polymarket: Boolean(serviceStatusQuery.data?.polymarket),
      snapshot: Boolean(serviceStatusQuery.data?.snapshot),
      gitcoin: Boolean(serviceStatusQuery.data?.gitcoin),
      agora: Boolean(serviceStatusQuery.data?.agora),
      idrissSend: Boolean(serviceStatusQuery.data?.['idriss-send']),
      tally: Boolean(serviceStatusQuery.data?.tally),
    };
  }, [serviceStatusQuery.data]);

  useEffect(() => {
    if (!enabled) {
      for (const element of document.querySelectorAll(
        '[data-idriss-send-widget="true"]',
      ))
        element.remove();
    }
  }, [enabled]);

  if (!serviceStatusQuery.data || !enabled) {
    return null;
  }

  return (
    <>
      {applicationsStatus.polymarket ? <PolymarketApp /> : null}
      {applicationsStatus.snapshot ? <SnapshotApp /> : null}
      {applicationsStatus.agora ? <AgoraApp /> : null}
      {/* {applicationsStatus.gitcoin ? <GitcoinApp /> : null} */}
      {applicationsStatus.idrissSend ? <IdrissSendApp /> : null}
      {applicationsStatus.tally ? <TallyApp /> : null}
    </>
  );
};
