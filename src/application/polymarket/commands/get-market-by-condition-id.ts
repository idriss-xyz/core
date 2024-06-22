import {
  Command,
  FailureResult,
  HandlerError,
  OkResult,
} from 'shared/messaging';

import { MarketData } from '../types';
import { POLYMARKET_CLOB_API } from '../constants';

interface Payload {
  conditionId: string;
}

export class GetMarketByConditionIdCommand extends Command<
  Payload,
  MarketData
> {
  public readonly name = 'GetMarketByConditionIdCommand' as const;

  constructor(
    public payload: Payload,
    id?: string,
  ) {
    super(id ?? null);
  }

  async handle() {
    try {
      const response = await fetch(
        `${POLYMARKET_CLOB_API}/markets/${this.payload.conditionId}`,
      );

      if (response.status !== 200) {
        throw new HandlerError();
      }

      // TODO: validate response
      const json = await response.json();
      return new OkResult(json as MarketData);
    } catch (error) {
      await this.logException();
      if (error instanceof HandlerError) {
        return new FailureResult(error.message);
      }
      return new FailureResult();
    }
  }
}
