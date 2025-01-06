import {
  Command,
  FailureResult,
  HandlerError,
  HandlerResponseError,
  OkResult,
} from 'shared/messaging';

import { SubscriptionRequest as Payload } from '../types';

import { COPILOT_API_URL } from './constants';

type Response = boolean;

export class AddTradingCopilotSubscriptionCommand extends Command<
  Payload,
  Response
> {
  public readonly name = 'AddTradingCopilotSubscriptionCommand' as const;

  constructor(public payload: Payload) {
    super();
  }

  async handle() {
    try {
      const response = await fetch(`${COPILOT_API_URL}/subscribe`, {
        method: 'POST',
        body: JSON.stringify(this.payload),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const responseText = await response.text();
        throw new HandlerResponseError(
          this.name,
          responseText,
          response.status,
        );
      }

      const json = (await response.json()) as Response;

      return new OkResult(json);
    } catch (error) {
      this.captureException(error);
      if (error instanceof HandlerError) {
        return new FailureResult(error.message);
      }

      return new FailureResult();
    }
  }
}
