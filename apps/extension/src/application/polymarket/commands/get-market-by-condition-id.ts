import {
  Command,
  FailureResult,
  HandlerError,
  HandlerResponseError,
  OkResult,
} from 'shared/messaging';

import { MarketData } from '../types';
import { POLYMARKET_CLOB_API } from '../constants';

type Payload = {
  conditionId: string;
};

export class GetMarketByConditionIdCommand extends Command<
  Payload,
  MarketData
> {
  public readonly name = 'GetMarketByConditionIdCommand' as const;

  constructor(public payload: Payload) {
    super();
  }

  async handle() {
    try {
      const response = await fetch(
        `${POLYMARKET_CLOB_API}/markets/${this.payload.conditionId}`,
      );

      if (!response.ok) {
        const responseText = await response.text();
        throw new HandlerResponseError(
          this.name,
          responseText,
          response.status,
        );
      }

      // TODO: validate response
      const json = await response.json();
      return new OkResult(json as MarketData);
    } catch (error) {
      this.captureException(error);
      if (error instanceof HandlerError) {
        return new FailureResult(error.message);
      }
      return new FailureResult();
    }
  }
}
