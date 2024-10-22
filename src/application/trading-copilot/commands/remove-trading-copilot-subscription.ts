import {
  Command,
  FailureResult,
  HandlerError,
  OkResult,
} from 'shared/messaging';

import { Subscription } from '../types';
import { TradingCopilotSettingsManager } from '../subscriptions-manager';

interface Payload {
  ensName: Subscription['ensName'];
}

type Response = boolean;

export class RemoveTradingCopilotSubscriptionCommand extends Command<
  Payload,
  Response
> {
  public readonly name = 'RemoveTradingCopilotSubscriptionCommand' as const;

  constructor(public payload: Payload) {
    super();
  }

  async handle() {
    try {
      await TradingCopilotSettingsManager.unsubscribe(this.payload.ensName);

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
