import { useMemo } from 'react';

import { useTwitterLocationInfo } from 'host/twitter';
import { useWarpcastLocationInfo } from 'host/warpcast';
import { ErrorBoundary } from 'shared/observability';

import { MarketWidgetContainer } from './widgets';
import {
  TwitterVisibleMarketsProvider,
  WarpcastVisibleMarketsProvider,
  useVisibleMarkets,
} from './context';

const Base = () => {
  const { isHost: isTwitter } = useTwitterLocationInfo();
  const { isHost: isWarpcast } = useWarpcastLocationInfo();

  const isExpectedHost = isTwitter || isWarpcast;

  const Wrapper = useMemo(() => {
    if (isTwitter) {
      return TwitterVisibleMarketsProvider;
    }
    if (isWarpcast) {
      return WarpcastVisibleMarketsProvider;
    }

    throw new Error('Unexpected host');
  }, [isTwitter, isWarpcast]);

  if (!isExpectedHost) {
    return null;
  }

  return (
    <Wrapper>
      <InjectVisibleMarkets />
    </Wrapper>
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
