import {
  Command,
  FailureResult,
  HandlerError,
  HandlerResponseError,
  OkResult,
} from 'shared/messaging';

import { GetTokenPriceResponse, TokenIdToPrice } from '../types';
import { POLYMARKET_CLOB_API } from '../constants';

type Payload = {
  tokensIds: string[];
};

export class GetTokensPricesCommand extends Command<Payload, TokenIdToPrice> {
  public readonly name = 'GetTokensPricesCommand' as const;

  constructor(public payload: Payload) {
    super();
  }

  async handle() {
    try {
      const requests = this.payload.tokensIds.map(async (tokenId) => {
        const response = await fetch(
          `${POLYMARKET_CLOB_API}/price?token_id=${tokenId}&side=sell`,
        );

        if (!response.ok) {
          const responseText = await response.text();
          throw new HandlerResponseError(
            this.name,
            responseText,
            response.status,
          );
        }

        const json = (await response.json()) as GetTokenPriceResponse;

        return [tokenId, Number(json.price)];
      });
      const responses = await Promise.all(requests);
      const result: TokenIdToPrice = Object.fromEntries(responses);
      return new OkResult(result);
    } catch (error) {
      this.captureException(error);
      if (error instanceof HandlerError) {
        return new FailureResult(error.message);
      }

      return new FailureResult();
    }
  }
}
