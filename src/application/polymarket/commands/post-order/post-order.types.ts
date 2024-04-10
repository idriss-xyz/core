import { NewOrder, OrderType } from '@polymarket/clob-client';

import { L2Headers } from '../../polymarket.types';

export interface PostOrderCommandDetails {
  orderPayload: NewOrder<OrderType.FOK>;
  headers: L2Headers;
}
