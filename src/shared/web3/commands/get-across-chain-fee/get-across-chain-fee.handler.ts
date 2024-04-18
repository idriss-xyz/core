import {
  FailureResult,
  Handler,
  HandlerError,
  OkResult,
} from 'shared/messaging';
// eslint-disable-next-line boundaries/element-types
import { sendHandlerExceptionEvent } from 'shared/monitoring';

import { GetAcrossChainFeeCommand } from './get-across-chain-fee.command';
import { GetAcrossChainFeeResponse } from './get-across-chain-fee.types';

export class GetAcrossChainFeeHandler
  implements Handler<GetAcrossChainFeeCommand>
{
  async handle(command: GetAcrossChainFeeCommand) {
    try {
      const url = `https://across.to/api/suggested-fees?${new URLSearchParams({
        originChainId: command.details.chain.id.toString(),
        token: command.details.chain.wrappedEthAddress,
        amount: command.details.amount,
        message: command.details.message,
        recipient: command.details.recipient,
        destinationChainId: command.details.destinationChainId.toString(),
      }).toString()}`;

      const response = await fetch(`https://www.idriss.xyz/post-data`, {
        method: 'POST',
        body: JSON.stringify({ url }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status !== 200) {
        throw new HandlerError();
      }

      const json = (await response.json()) as GetAcrossChainFeeResponse;

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
