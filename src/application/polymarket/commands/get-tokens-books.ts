import {
  Command,
  FailureResult,
  HandlerError,
  HandlerResponseError,
  OkResult,
} from 'shared/messaging';

import { GetTokenBookResponse, TokenIdToBook } from '../types';
import { POLYMARKET_CLOB_API } from '../constants';

type Payload = {
  tokensIds: string[];
};

export class GetTokensBooksCommand extends Command<Payload, TokenIdToBook> {
  public readonly name = 'GetTokensBooksCommand' as const;

  constructor(public payload: Payload) {
    super();
  }

  async handle() {
    try {
      const requests = this.payload.tokensIds.map(async (tokenId) => {
        const response = await fetch(
          `${POLYMARKET_CLOB_API}/book?token_id=${tokenId}`,
        );

        if (!response.ok) {
          const responseText = await response.text();
          throw new HandlerResponseError(
            this.name,
            responseText,
            response.status,
          );
        }

        const json = (await response.json()) as GetTokenBookResponse;

        return [tokenId, json];
      });

      const responses = await Promise.all(requests);
      const result: TokenIdToBook = Object.fromEntries(responses);
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
