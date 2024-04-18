import {
  EnhancedToken,
  MarketData,
  MarketFormValues,
} from '../../polymarket.types';

export interface MarketProperties {
  data: MarketData;
  tokens: EnhancedToken[];
  defaultValues?: Partial<MarketFormValues>;
  onRefresh: () => void;
  top: number;
  isAvailable: boolean;
  imageUrl: string;
  chance: number;
}

export interface MarketContainerProperties {
  top: number;
  conditionId: string;
  isAvailable: boolean;
}
