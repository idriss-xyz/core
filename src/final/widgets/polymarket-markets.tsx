import { ErrorBoundary } from 'shared/observability';
import { MarketWidgetContainer } from 'application/polymarket';

import { usePolymarketMarkets } from '../hooks';

export const PolymarketMarkets = () => {
  const markets = usePolymarketMarkets();

  return (
    <ErrorBoundary>
      {markets.map((market) => {
        return (
          <MarketWidgetContainer
            key={`${market.top}-${market.conditionId}`}
            top={market.top}
            conditionId={market.conditionId}
          />
        );
      })}
    </ErrorBoundary>
  );
};
