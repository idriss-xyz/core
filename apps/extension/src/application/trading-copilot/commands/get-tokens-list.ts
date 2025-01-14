import {
  Command,
  FailureResult,
  HandlerError,
  HandlerResponseError,
  OkResult,
} from 'shared/messaging';

type Response = {
  tokens: {
    [chainId: string]: Record<string, string>[]; // TODO: Correctly type record depending on API response
  }
};

export class GetTokensListCommand extends Command<void, Response> {
  public readonly name = 'GetTokensListCommand' as const;
  public readonly payload = undefined;

  constructor() {
    super();
  }

  async handle() {
    try {
      const response = await fetch(
        'https://li.quest/v1/tokens?chains=bas',
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
