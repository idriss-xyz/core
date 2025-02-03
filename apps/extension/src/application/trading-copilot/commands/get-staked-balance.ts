import { createPublicClient, formatEther, http } from 'viem';
import { base } from 'viem/chains';
import { STAKER_ADDRESS, StakingABI } from '@idriss-xyz/constants';

import { Hex } from 'shared/web3';
import {
  Command,
  FailureResult,
  HandlerError,
  OkResult,
} from 'shared/messaging';

type Payload = {
  args: Hex;
};

type Response = string | null;

export class GetStakedBalanceCommand extends Command<Payload, Response> {
  public readonly name = 'GetStakedBalanceCommand' as const;

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
        abi: StakingABI,
        address: STAKER_ADDRESS,
        functionName: 'getStakedBalance',
        args: [this.payload.args],
      });

      const balanceAsNumber = formatEther(balance as bigint);

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
