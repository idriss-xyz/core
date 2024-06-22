import { ErrorBoundary } from 'shared/observability';
import { useExtensionSettings } from 'shared/extension';
import { useTwitterLocationInfo } from 'host/twitter';
import { useWarpcastLocationInfo } from 'host/warpcast';

import { MarketWidgetContainer } from './widgets';
import {
  TwitterVisibleMarketsProvider,
  WarpcastVisibleMarketsProvider,
  useVisibleMarkets,
} from './context';

export const App = () => {
  const { experimentalFeatures } = useExtensionSettings();

  const { isTwitter } = useTwitterLocationInfo();

  const { isWarpcast } = useWarpcastLocationInfo();

  if (!experimentalFeatures) {
    return null;
  }

  return (
    <ErrorBoundary exceptionEventName="polymarket-runtime-error">
      {isTwitter ? (
        <TwitterVisibleMarketsProvider>
          <InjectVisibleMarkets />
        </TwitterVisibleMarketsProvider>
      ) : null}
      {isWarpcast ? (
        <WarpcastVisibleMarketsProvider>
          <InjectVisibleMarkets />
        </WarpcastVisibleMarketsProvider>
      ) : null}
    </ErrorBoundary>
  );
};

const InjectVisibleMarkets = () => {
  const markets = useVisibleMarkets();

  return markets.map((market) => {
    return (
      <ErrorBoundary
        key={`${market.top}-${market.conditionId}`}
        exceptionEventName="polymarket-widget-runtime-error"
      >
        <MarketWidgetContainer
          top={market.top}
          conditionId={market.conditionId}
        />
      </ErrorBoundary>
    );
  });
};
