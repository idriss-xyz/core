import { ErrorBoundary } from 'shared/observability';
import { MarketWidgetContainer } from 'application/polymarket';
import { useExtensionSettings } from 'shared/extension';

import { usePolymarketMarkets } from '../hooks';

export const PolymarketMarkets = () => {
  const markets = usePolymarketMarkets();
  const { extensionSettings } = useExtensionSettings();

  if (!extensionSettings['polymarket-enabled']) {
    return null;
  }

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
