import {
  Command,
  FailureResult,
  HandlerError,
  HandlerResponseError,
  OkResult,
} from 'shared/messaging';

type Payload = {
  tokenURI: string;
};

export class GetTokensImageCommand extends Command<Payload, string> {
  public readonly name = 'GetTokensImageCommand' as const;

  constructor(public payload: Payload) {
    super();
  }

  async handle() {
    try {
      // Improvement: Add a timeout for long fetches "{ signal: AbortSignal.timeout(5000) }""
      const response = await fetch(this.payload.tokenURI);

      if (!response.ok) {
        const responseText = await response.text();
        throw new HandlerResponseError(
          this.name,
          responseText,
          response.status,
        );
      }

      const blob = await response.blob();

      const url: string =
        (await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            resolve(reader.result as string);
          };
          //eslint-disable-next-line unicorn/prefer-add-event-listener
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        })) ?? '';

      return new OkResult(url);
    } catch (error) {
      this.captureException(error);
      if (error instanceof HandlerError) {
        return new FailureResult(error.message);
      }

      return new FailureResult();
    }
  }
}
