import { PolymarketUser } from '../../polymarket.types';

export interface UserErrorProperties {
  user: PolymarketUser;
  onRetry: () => void;
}
