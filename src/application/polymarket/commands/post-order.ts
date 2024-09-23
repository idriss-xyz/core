import {
  Command,
  FailureResult,
  HandlerError,
  HandlerResponseError,
  OkResult,
} from 'shared/messaging';

import { POLYMARKET_CLOB_API } from '../constants';
import { L2Headers, Order } from '../types';

type Payload = {
  order: Order;
  headers: L2Headers;
};

export class PostOrderCommand extends Command<Payload, undefined> {
  public readonly name = 'PostOrderCommand' as const;

  constructor(public payload: Payload) {
    super();
  }

  async handle() {
    try {
      const response = await fetch(`${POLYMARKET_CLOB_API}/order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...this.payload.headers,
        },
        body: JSON.stringify(this.payload.order),
      });

      if (!response.ok) {
        const responseText = await response.text();
        throw new HandlerResponseError(
          this.name,
          responseText,
          response.status,
        );
      }

      return new OkResult(undefined);
    } catch (error) {
      this.captureException(error);
      if (error instanceof HandlerError) {
        return new FailureResult(error.message);
      }
      return new FailureResult();
    }
  }
}
