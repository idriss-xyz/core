import {
  FailureResult,
  Handler,
  HandlerError,
  OkResult,
} from 'shared/messaging';
// eslint-disable-next-line boundaries/element-types
import { sendHandlerExceptionEvent } from 'shared/monitoring';

import { GetAcrossChainFeesCommand } from './get-across-chain-fees.command';
import { GetAcrossChainFeesResponse } from './get-across-chain-fees.types';

export class GetAcrossChainFeesHandler
  implements Handler<GetAcrossChainFeesCommand>
{
  async handle(command: GetAcrossChainFeesCommand) {
    try {
      const promises = command.details.chains.map(async (chain) => {
        const url = `https://across.to/api/suggested-fees?${new URLSearchParams(
          {
            originChainId: chain.id.toString(),
            token: chain.wrappedEthAddress,
            amount: command.details.amount,
            message: command.details.message,
            recipient: command.details.recipient,
            destinationChainId: command.details.destinationChainId.toString(),
          },
        ).toString()}`;

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

        const json = (await response.json()) as GetAcrossChainFeesResponse;
        return [chain.id.toString(), json];
      });

      const response: Record<string, GetAcrossChainFeesResponse> =
        Object.fromEntries(await Promise.all(promises));

      return new OkResult(response);
    } catch (error) {
      await sendHandlerExceptionEvent(command);
      if (error instanceof HandlerError) {
        return new FailureResult(error.message);
      }

      return new FailureResult();
    }
  }
}
