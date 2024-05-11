import { useLocation } from 'react-use';

import { useExtensionSettings } from 'shared/extension';
import { ErrorBoundary } from 'shared/monitoring';
import { isTwitterHostname } from 'host/twitter';
import { isWarpcastHostname } from 'host/warpcast';

import { MarketWidgetContainer } from './widgets';
import {
  TwitterVisibleMarketsProvider,
  WarpcastVisibleMarketsProvider,
  useVisibleMarkets,
} from './context';

export const App = () => {
  const location = useLocation();
  const { experimentalFeatures } = useExtensionSettings();

  // TODO: hide these behind facade
  const isTwitter = isTwitterHostname(location.hostname ?? '');
  const isWarpcast = isWarpcastHostname(location.hostname ?? '');

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
