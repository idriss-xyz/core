import { OrderPlacer } from '../../polymarket.types';

export interface OrderPlacerErrorProperties {
  orderPlacer: OrderPlacer;
  onRetry: () => void;
  onSwitchWallet: () => void;
}
