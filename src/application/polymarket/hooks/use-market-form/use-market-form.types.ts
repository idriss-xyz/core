import { MarketForm } from '../../polymarket.types';

export interface UseMarketFormProperties {
  defaultValues?: Partial<MarketForm>;
  availableBalance: number;
}
