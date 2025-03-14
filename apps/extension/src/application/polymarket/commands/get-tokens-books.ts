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
      if (error instanceof HandlerResponseError && error.statusCode === 404) {
        // polymarket copilot-api returns 404 if market is closed, we don't want to capture this exception
        return new FailureResult('Books does not exist for these tokens');
      }
      this.captureException(error);
      if (error instanceof HandlerError) {
        return new FailureResult(error.message);
      }

      return new FailureResult();
    }
  }
}
