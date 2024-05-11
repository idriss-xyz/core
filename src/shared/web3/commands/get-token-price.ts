import {
  Command,
  FailureResult,
  HandlerError,
  OkResult,
  useCommandQuery,
} from 'shared/messaging';

import { GetEthPriceResponse } from '../web3.types';

interface GetTokenPriceCommandDetails {
  buyToken: string;
  sellToken: string;
  amount: number;
}

export class GetTokenPriceCommand extends Command<
  GetTokenPriceCommandDetails,
  GetEthPriceResponse
> {
  public readonly name = 'GetTokenPriceCommand' as const;

  constructor(
    public details: GetTokenPriceCommandDetails,
    id?: string,
  ) {
    super(id ?? null);
  }

  async handle() {
    try {
      const response = await fetch(
        `https://www.idriss.xyz/token-price?${new URLSearchParams({
          sellToken: this.details.sellToken,
          buyToken: this.details.buyToken,
          sellAmount: this.details.amount.toString(),
        }).toString()}`,
      );

      if (response.status !== 200) {
        throw new HandlerError();
      }

      // TODO: schema validation
      const json = (await response.json()) as GetEthPriceResponse;

      return new OkResult(json);
    } catch (error) {
      await this.trackHandlerException();
      if (error instanceof HandlerError) {
        return new FailureResult(error.message);
      }

      return new FailureResult();
    }
  }
}

export const useGetTokenPriceCommandQuery = (
  details: GetTokenPriceCommandDetails,
) => {
  return useCommandQuery({
    command: new GetTokenPriceCommand(details),
    refetchInterval: 60_000, // each 1m,
  });
};
