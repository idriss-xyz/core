import {
  FailureResult,
  Handler,
  HandlerError,
  OkResult,
} from 'shared/messaging';
import { sendHandlerExceptionEvent } from 'shared/monitoring';

import { POLYMARKET_CLOB_API } from '../../polymarket.constants';

import { PostOrderCommand } from './post-order.command';

export class PostOrderHandler implements Handler {
  async handle(command: PostOrderCommand) {
    try {
      const response = await fetch(`${POLYMARKET_CLOB_API}/order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...command.details.headers,
        },
        body: JSON.stringify(command.details.orderPayload),
      });

      if (response.status !== 200) {
        throw new HandlerError();
      }

      return new OkResult(undefined);
    } catch (error) {
      await sendHandlerExceptionEvent(command);
      if (error instanceof HandlerError) {
        return new FailureResult(error.message);
      }
      return new FailureResult();
    }
  }
}
