import {
  FailureResult,
  Handler,
  HandlerError,
  OkResult,
} from 'shared/messaging';
// eslint-disable-next-line boundaries/element-types
import { sendHandlerExceptionEvent } from 'shared/monitoring';
import { GetEthPriceResponse } from 'shared/web3/web3.types';

import { GetTokenPriceCommand } from './get-token-price.command';

export class GetTokenPriceHandler implements Handler<GetTokenPriceCommand> {
  async handle(command: GetTokenPriceCommand) {
    try {
      const response = await fetch(
        `https://www.idriss.xyz/token-price?${new URLSearchParams({
          sellToken: command.details.sellToken,
          buyToken: command.details.buyToken,
          sellAmount: command.details.amount.toString(),
        }).toString()}`,
      );

      if (response.status !== 200) {
        throw new HandlerError();
      }

      // TODO: schema validation
      const json = (await response.json()) as GetEthPriceResponse;

      return new OkResult(json);
    } catch (error) {
      await sendHandlerExceptionEvent(command);
      if (error instanceof HandlerError) {
        return new FailureResult(error.message);
      }

      return new FailureResult();
    }
  }
}
