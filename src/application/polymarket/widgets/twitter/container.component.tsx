import { ErrorBoundary } from 'shared/monitoring';

import { useAvailability, useTwitterMarkets } from '../../hooks';
import { MarketWidget } from '../market';

// TODO: widget generic component with padding, placement and shadow?
export const Container = () => {
  const marketsQuery = useTwitterMarkets();
  const availabilityQuery = useAvailability();

  return marketsQuery.data?.map((market) => {
    return (
      <ErrorBoundary
        key={`${market.top}-${market.conditionId}`}
        exceptionEventName="polymarket-widget-twitter-runtime-error"
      >
        <MarketWidget
          top={market.top}
          conditionId={market.conditionId}
          isAvailable={availabilityQuery.data ?? true}
        />
      </ErrorBoundary>
    );
  });
};
