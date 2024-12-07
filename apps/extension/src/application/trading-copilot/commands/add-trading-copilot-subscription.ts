import {
  Command,
  FailureResult,
  HandlerError,
  OkResult,
} from 'shared/messaging';

import { Subscription } from '../types';
import { TradingCopilotSettingsManager } from '../subscriptions-manager';

interface Payload {
  subscription: Subscription;
}

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
      await TradingCopilotSettingsManager.subscribe(this.payload.subscription);

      return new OkResult(true);
    } catch (error) {
      this.captureException(error);
      if (error instanceof HandlerError) {
        return new FailureResult(error.message);
      }

      return new FailureResult();
    }
  }
}
