import {
  Command,
  FailureResult,
  HandlerError,
  OkResult,
} from 'shared/messaging';

import { GetEthPriceResponse } from '../types';

interface Payload {
  buyToken: string;
  sellToken: string;
  chainId: number;
  amount: number;
}

export class GetTokenPriceCommand extends Command<
  Payload,
  GetEthPriceResponse
> {
  public readonly name = 'GetTokenPriceCommand' as const;

  constructor(
    public payload: Payload,
    id?: string,
  ) {
    super(id ?? null);
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

      if (response.status !== 200) {
        throw new HandlerError();
      }

      // TODO: schema validation
      const json = (await response.json()) as GetEthPriceResponse;

      return new OkResult(json);
    } catch (error) {
      await this.logException();
      if (error instanceof HandlerError) {
        return new FailureResult(error.message);
      }

      return new FailureResult();
    }
  }
}
