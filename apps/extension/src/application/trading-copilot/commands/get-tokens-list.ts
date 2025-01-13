import {
  Command,
  FailureResult,
  HandlerError,
  HandlerResponseError,
  OkResult,
} from 'shared/messaging';

import { QuoteResponse as Response } from '../types';

type Payload = {
  tokenAddress: string;
};

export class GetTokensListCommand extends Command<Payload, Response> {
  public readonly name = 'GetTokensListCommand' as const;

  constructor(public payload: Payload) {
    super();
  }

  async handle() {
    try {
      const response = await fetch(
        'https://tokens.coingecko.com/uniswap/all.json',
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      if (!response.ok) {
        const responseText = await response.text();
        throw new HandlerResponseError(
          this.name,
          responseText,
          response.status,
        );
      }

      const json = (await response.json()) as Response;

      return new OkResult(json);
    } catch (error) {
      this.captureException(error);
      if (error instanceof HandlerError) {
        return new FailureResult(error.message);
      }

      return new FailureResult();
    }
  }
}
