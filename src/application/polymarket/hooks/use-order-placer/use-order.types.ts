import { TickSize } from '@polymarket/clob-client';

import { Hex, Wallet } from 'shared/web3';

export interface OrderDetails {
  minimumTickSize: TickSize;
  negRisk: boolean;
  tokenId: string;
  amount: number;
}

export interface UseOrderPlacerParameters {
  onSuccess?: (parameters: PlaceOrderParameters) => void;
}

export interface PlaceOrderParameters {
  wallet: Wallet;
  funderAddress: Hex;
  orderDetails: OrderDetails;
}
