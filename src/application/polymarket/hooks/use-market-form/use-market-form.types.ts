import { MarketFormValues } from '../../polymarket.types';

export interface UseMarketFormProperties {
  defaultValues?: Partial<MarketFormValues>;
  availableBalance: number;
}
