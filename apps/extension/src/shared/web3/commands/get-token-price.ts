import {
  Command,
  FailureResult,
  HandlerError,
  HandlerResponseError,
  OkResult,
} from 'shared/messaging';

type Payload = {
  buyToken: string;
  sellToken: string;
  chainId: number;
  amount: number;
};

type Response = {
  price: string;
};

export class GetTokenPriceCommand extends Command<Payload, Response> {
  public readonly name = 'GetTokenPriceCommand' as const;

  constructor(public payload: Payload) {
    super();
  }

  async handle() {
    try {
      if (this.payload.buyToken === this.payload.sellToken) {
        return new OkResult({ price: '1' });
      }

      const response = await fetch(
        `https://api.idriss.xyz/token-price?${new URLSearchParams({
          sellToken: this.payload.sellToken,
          buyToken: this.payload.buyToken,
          sellAmount: this.payload.amount.toString(),
          network: this.payload.chainId.toString(),
        }).toString()}`,
      );

      if (!response.ok) {
        const responseText = await response.text();
        throw new HandlerResponseError(
          this.name,
          responseText,
          response.status,
        );
      }

      // TODO: schema validation
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
