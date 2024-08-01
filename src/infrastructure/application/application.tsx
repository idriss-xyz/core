import { useMemo, createElement, StrictMode, useEffect } from 'react';
import NiceModal from '@ebay/nice-modal-react';
import { createRoot } from 'react-dom/client';

import { Final } from 'final';
import {
  ExtensionSettingsProvider,
  GetServiceStatusCommand,
  useExtensionSettings,
} from 'shared/extension';
import {
  PortalProvider,
  QueryProvider,
  TailwindProvider,
  WidgetTabsProvider,
} from 'shared/ui';
import { WalletContextProvider } from 'shared/web3';
import { ErrorBoundary, WithObservabilityScope } from 'shared/observability';
import {
  TwitterScrapingContextProvider,
  useTwitterLocationInfo,
} from 'host/twitter';
import {
  WarpcastScrapingContextProvider,
  useWarpcastLocationInfo,
} from 'host/warpcast';
import { useCommandQuery } from 'shared/messaging';
import { TallyApp } from 'application/tally';
import { AgoraApp } from 'application/agora';
import { SnapshotApp } from 'application/snapshot';
import { PolymarketApp } from 'application/polymarket';
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
      <WithObservabilityScope>
        <ErrorBoundary exceptionEventName="application-runtime-error">
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
      </WithObservabilityScope>
    </StrictMode>
  );
};

const Applications = () => {
  const { isTwitter } = useTwitterLocationInfo();
  const { isWarpcast } = useWarpcastLocationInfo();
  const { enabled } = useExtensionSettings();

  useEffect(() => {
    if (!enabled) {
      for (const element of document.querySelectorAll(
        '[data-idriss-widget="true"]',
      ))
        element.remove();
    }
  }, [enabled]);

  const isExpectedPage = isTwitter || isWarpcast;

  const serviceStatusQuery = useCommandQuery({
    staleTime: Number.POSITIVE_INFINITY,
    command: new GetServiceStatusCommand({}),
    enabled: isTwitter || isWarpcast,
  });

  const applicationsStatus = useMemo(() => {
    return {
      polymarket: Boolean(serviceStatusQuery.data?.polymarket),
      snapshot: Boolean(serviceStatusQuery.data?.snapshot),
      agora: Boolean(serviceStatusQuery.data?.agora),
      tally: Boolean(serviceStatusQuery.data?.tally),
    };
  }, [serviceStatusQuery.data]);

  if (!enabled || !isExpectedPage) {
    return null;
  }

  return (
    <>
      <WidgetTabsProvider>
        {applicationsStatus.snapshot ? <SnapshotApp /> : null}
        {applicationsStatus.tally ? <TallyApp /> : null}
        {applicationsStatus.agora ? <AgoraApp /> : null}
      </WidgetTabsProvider>
      {applicationsStatus.polymarket ? <PolymarketApp /> : null}
      <Final />
    </>
  );
};
