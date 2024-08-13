import { useTwitterLocationInfo } from 'host/twitter';
import { ErrorBoundary } from 'shared/observability';

import { MarketWidgetContainer } from './widgets';
import { TwitterVisibleMarketsProvider, useVisibleMarkets } from './context';

const Base = () => {
  const { isHost: isTwitter } = useTwitterLocationInfo();

  const isExpectedHost = isTwitter;

  if (!isExpectedHost) {
    return null;
  }

  return (
    <TwitterVisibleMarketsProvider>
      <InjectVisibleMarkets />
    </TwitterVisibleMarketsProvider>
  );
};

const InjectVisibleMarkets = () => {
  const markets = useVisibleMarkets();

  return markets.map((market) => {
    return (
      <MarketWidgetContainer
        key={`${market.top}-${market.conditionId}`}
        top={market.top}
        conditionId={market.conditionId}
      />
    );
  });
};

export const App = () => {
  return (
    <ErrorBoundary>
      <Base />
    </ErrorBoundary>
  );
};
