import { PlaceOrderParameters } from '../../polymarket.types';

export interface UseOrderPlacerParameters {
  onSuccess?: (parameters: PlaceOrderParameters) => void;
}
