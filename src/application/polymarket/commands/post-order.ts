import {
  Command,
  FailureResult,
  HandlerError,
  HandlerResponseError,
  OkResult,
} from 'shared/messaging';
import { Hex } from 'shared/web3';

import { POLYMARKET_CLOB_API } from '../constants';
import { L2Headers, Order } from '../types';

type Payload = {
  order: Order;
  headers: L2Headers;
};

type Response = {
  transactionsHashes: Hex[];
  orderID: Hex;
};

export class PostOrderCommand extends Command<Payload, Response> {
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

      // TODO: validate schema
      const json = (await response.json()) as Response;

      const { transactionsHashes, orderID } = json;

      return new OkResult({ transactionsHashes, orderID });
    } catch (error) {
      this.captureException(error);
      if (error instanceof HandlerError) {
        return new FailureResult(error.message);
      }
      return new FailureResult();
    }
  }
}
