import { BigNumber } from 'ethers';

import { Command, FailureResult, HandlerError } from 'shared/messaging';
import {
  GetAcrossChainFeesCommand,
  GetAcrossChainFeesPayload,
  GetAcrossChainFeesResponse,
} from 'shared/web3';

import { generateAcrossMessage } from '../utils';

interface Payload extends Omit<GetAcrossChainFeesPayload, 'message'> {
  anchorAddress: string;
  roundId: number;
}

export class GetGitcoinAcrossChainFeesCommand extends Command<
  Payload,
  GetAcrossChainFeesResponse
> {
  public readonly name = 'GetGitcoinAcrossChainFeesCommand' as const;

  constructor(public payload: Payload) {
    super();
  }

  async handle() {
    try {
      const message = await generateAcrossMessage({
        amount: BigNumber.from(this.payload.amount.toString()),
        anchorAddress: this.payload.anchorAddress,
        roundId: this.payload.roundId,
        destinationChainId: this.payload.destinationChainId,
      });
      const command = new GetAcrossChainFeesCommand({
        message,
        destinationChainId: this.payload.destinationChainId,
        amount: this.payload.amount,
        chains: this.payload.chains,
        recipient: this.payload.recipient,
      });
      return command.handle();
    } catch (error) {
      this.captureException(error);
      if (error instanceof HandlerError) {
        return new FailureResult(error.message);
      }

      return new FailureResult();
    }
  }
}
