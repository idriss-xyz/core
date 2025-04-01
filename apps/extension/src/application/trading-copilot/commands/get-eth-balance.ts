import { createPublicClient, formatEther, Hex, http } from 'viem';
import { base } from 'viem/chains';

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

type Response = string | null;

export class GetEthBalanceCommand extends Command<Payload, Response> {
  public readonly name = 'GetEthBalanceCommand' as const;

  constructor(public payload: Payload) {
    super();
  }

  async handle() {
    try {
      const client = createPublicClient({
        chain: { ...base },
        transport: http('https://base.llamarpc.com/'),
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
