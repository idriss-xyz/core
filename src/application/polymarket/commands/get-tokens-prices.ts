import {
  Command,
  FailureResult,
  HandlerError,
  OkResult,
} from 'shared/messaging';
import {
  GetTokenPriceResponse,
  TokenIdToPrice,
} from 'application/polymarket/types';

import { POLYMARKET_CLOB_API } from '../constants';

interface Payload {
  tokensIds: string[];
}

export class GetTokensPricesCommand extends Command<Payload, TokenIdToPrice> {
  public readonly name = 'GetTokensPricesCommand' as const;

  constructor(
    public payload: Payload,
    id?: string,
  ) {
    super(id ?? null);
  }

  async handle() {
    try {
      const requests = this.payload.tokensIds.map(async (tokenId) => {
        const response = await fetch(
          `${POLYMARKET_CLOB_API}/price?token_id=${tokenId}&side=sell`,
        );

        if (response.status !== 200) {
          throw new HandlerError();
        }

        const json = (await response.json()) as GetTokenPriceResponse;

        return [tokenId, Number(json.price)];
      });
      const responses = await Promise.all(requests);
      const result: TokenIdToPrice = Object.fromEntries(responses);
      return new OkResult(result);
    } catch (error) {
      await this.logException();
      if (error instanceof HandlerError) {
        return new FailureResult(error.message);
      }

      return new FailureResult();
    }
  }
}
