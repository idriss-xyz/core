import { NewOrder, OrderType, TickSize } from '@polymarket/clob-client';
import { JsonRpcSigner } from '@ethersproject/providers';

import { L2Headers } from '../../polymarket.types';

export interface PostOrderProperties {
  orderPayload: NewOrder<OrderType.FOK>;
  l2Headers: L2Headers;
}

export interface PostOrderMutationProperties {
  signer: JsonRpcSigner;
  funderAddress: string;
  tokenID: string;
  amount: number;
  tickSize: TickSize;
  negRisk: boolean;
  credentials: {
    key: string;
    secret: string;
    passphrase: string;
  };
}
