import { formatEther, Hex } from 'viem';
import { clients } from '@idriss-xyz/blockchain-clients';

import {
  Command,
  FailureResult,
  HandlerError,
  OkResult,
} from 'shared/messaging';

type Payload = {
  address: Hex;
  chainId: number;
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
      const clientDetails = clients.find((client) => {
        console.log(client.chain, this.payload.chainId);
        return client.chain === this.payload.chainId;
      });

      if (!clientDetails) {
        return new FailureResult('Chain not supported');
      }

      const { client } = clientDetails;

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
