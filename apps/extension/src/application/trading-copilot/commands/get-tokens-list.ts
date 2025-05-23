import {
  Command,
  FailureResult,
  HandlerError,
  HandlerResponseError,
  OkResult,
} from 'shared/messaging';

import { SwapDataToken } from '../types';

type Response = {
  tokens: Record<string, SwapDataToken[]>;
};

export class GetTokensListCommand extends Command<void, Response> {
  public readonly name = 'GetTokensListCommand' as const;
  public readonly payload = undefined;

  constructor() {
    super();
  }

  async handle() {
    try {
      const response = await fetch('https://li.quest/v1/tokens?chains=bas', {
        headers: {
          'Content-Type': 'application/json',
        },
      });

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
