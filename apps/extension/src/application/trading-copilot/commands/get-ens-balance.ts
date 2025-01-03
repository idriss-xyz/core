import { createPublicClient, formatEther, http } from 'viem';
import { mainnet } from 'viem/chains';

import { Hex } from 'shared/web3';
import {
  Command,
  FailureResult,
  HandlerError,
  OkResult,
} from 'shared/messaging';

type Payload = {
  address: Hex;
  blockTag: 'latest' | 'earliest' | 'pending' | 'safe' | 'finalized';
};

export class GetEnsBalanceCommand extends Command<Payload, string | null> {
  public readonly name = 'GetEnsBalanceCommand' as const;

  constructor(public payload: Payload) {
    super();
  }

  async handle() {
    try {
      const client = createPublicClient({
        chain: { ...mainnet },
        transport: http('https://eth.llamarpc.com'),
      });

      const result = await client.getBalance(this.payload);
      const balanceAsEth = formatEther(result);

      return new OkResult(balanceAsEth);
    } catch (error) {
      this.captureException(error);
      if (error instanceof HandlerError) {
        return new FailureResult(error.message);
      }

      return new FailureResult();
    }
  }
}
