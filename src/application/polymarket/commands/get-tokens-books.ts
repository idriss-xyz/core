import {
  Command,
  FailureResult,
  HandlerError,
  OkResult,
} from 'shared/messaging';

import { GetTokenBookResponse, TokenIdToBook } from '../types';
import { POLYMARKET_CLOB_API } from '../constants';

interface Payload {
  tokensIds: string[];
}

export class GetTokensBooksCommand extends Command<Payload, TokenIdToBook> {
  public readonly name = 'GetTokensBooksCommand' as const;

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
          `${POLYMARKET_CLOB_API}/book?token_id=${tokenId}`,
        );

        if (response.status !== 200) {
          throw new HandlerError();
        }

        const json = (await response.json()) as GetTokenBookResponse;

        return [tokenId, json];
      });

      const responses = await Promise.all(requests);
      const result: TokenIdToBook = Object.fromEntries(responses);
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
