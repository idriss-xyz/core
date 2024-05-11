import { NewOrder, OrderType } from '@polymarket/clob-client';

import {
  Command,
  FailureResult,
  HandlerError,
  OkResult,
} from 'shared/messaging';

import { POLYMARKET_CLOB_API } from '../constants';
import { L2Headers } from '../types';

interface Details {
  orderPayload: NewOrder<OrderType.FOK>;
  headers: L2Headers;
}

export class PostOrderCommand extends Command<Details, undefined> {
  public readonly name = 'PostOrderCommand' as const;

  constructor(
    public details: Details,
    id?: string,
  ) {
    super(id ?? null);
  }

  async handle() {
    try {
      const response = await fetch(`${POLYMARKET_CLOB_API}/order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...this.details.headers,
        },
        body: JSON.stringify(this.details.orderPayload),
      });

      if (response.status !== 200) {
        throw new HandlerError();
      }

      return new OkResult(undefined);
    } catch (error) {
      await this.trackHandlerException();
      if (error instanceof HandlerError) {
        return new FailureResult(error.message);
      }
      return new FailureResult();
    }
  }
}
