import { createPublicClient, formatEther, http, parseAbi } from 'viem';
import { base } from 'viem/chains';

import { Hex } from 'shared/web3';
import {
  Command,
  FailureResult,
  HandlerError,
  OkResult,
} from 'shared/messaging';

import { ERC_20_ABI } from './constants';

type Payload = {
  address: Hex;
  args: readonly [Hex];
};

type Response = string | null;

export class GetEnsBalanceOfCommand extends Command<Payload, Response> {
  public readonly name = 'GetEnsBalanceOfCommand' as const;

  constructor(public payload: Payload) {
    super();
  }

  async handle() {
    try {
      const client = createPublicClient({
        chain: { ...base },
        transport: http(),
      });

      const balance = await client.readContract({
        functionName: 'balanceOf',
        abi: parseAbi(ERC_20_ABI),
        args: this.payload.args,
        address: this.payload.address,
      });

      const balanceAsNumber = formatEther(balance);

      return new OkResult(balanceAsNumber);
    } catch (error) {
      this.captureException(error);
      if (error instanceof HandlerError) {
        return new FailureResult(error.message);
      }

      return new FailureResult();
    }
  }
}
