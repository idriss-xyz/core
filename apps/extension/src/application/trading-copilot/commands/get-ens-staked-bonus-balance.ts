import {
  Command,
  FailureResult,
  HandlerError,
  HandlerResponseError,
  OkResult,
} from 'shared/messaging';
import { Hex } from 'shared/web3';

import { ClaimedEventsResponse } from '../types';

import { MAIN_API_URL } from './constants';

type Payload = {
  address: Hex;
};

type Response = string | null;

export class GetEnsStakedBonusBalanceCommand extends Command<
  Payload,
  Response
> {
  public readonly name = 'GetEnsStakedBonusBalanceCommand' as const;

  constructor(public payload: Payload) {
    super();
  }

  async handle() {
    try {
      const response = await fetch(`${MAIN_API_URL}/api/claimed-events`, {
        method: 'GET',
      });

      if (!response.ok) {
        const responseText = await response.text();
        throw new HandlerResponseError(
          this.name,
          responseText,
          response.status,
        );
      }

      const claimedEvents = (await response.json()) as ClaimedEventsResponse;

      const claimedEvent = claimedEvents.events.find((event) => {
        return event.to === this.payload.address && event.bonus;
      });

      return new OkResult(claimedEvent?.total ?? null);
    } catch (error) {
      this.captureException(error);
      if (error instanceof HandlerError) {
        return new FailureResult(error.message);
      }

      return new FailureResult();
    }
  }
}
