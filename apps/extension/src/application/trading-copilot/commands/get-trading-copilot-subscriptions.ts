import {
  Command,
  FailureResult,
  HandlerError,
  HandlerResponseError,
  OkResult,
} from 'shared/messaging';
import { COPILOT_API_URL } from 'application/trading-copilot/commands/constants';

import {
  SubscriptionsRequest as Payload,
  SubscriptionsResponse as Response,
} from '../types';

export class GetTradingCopilotSubscriptionsCommand extends Command<
  Payload,
  Response
> {
  public readonly name = 'GetTradingCopilotSubscriptionsCommand' as const;

  constructor(public payload: Payload) {
    super();
  }

  async handle() {
    try {
      const response = await fetch(
        `${COPILOT_API_URL}/subscriptions/${this.payload.subscriberId}`,
        {
          method: 'GET',
        },
      );

      if (!response.ok) {
        const responseText = await response.text();
        throw new HandlerResponseError(
          this.name,
          responseText,
          response.status,
        );
      }

      const subscriptions = (await response.json()) as Response;

      return new OkResult(subscriptions);
    } catch (error) {
      this.captureException(error);
      if (error instanceof HandlerError) {
        return new FailureResult(error.message);
      }

      return new FailureResult();
    }
  }
}
