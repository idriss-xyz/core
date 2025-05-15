import { formatEther, Hex } from 'viem';
import { clients } from '@idriss-xyz/blockchain-clients';

import {
  Command,
  FailureResult,
  HandlerError,
  OkResult,
} from 'shared/messaging';

import { ERC20_ABI } from '../constants';

type Payload = {
  userAddress: Hex;
  tokenAddress: Hex;
  chainId: number;
};

type Response = string | null;

export class GetTokenBalanceCommand extends Command<Payload, Response> {
  public readonly name = 'GetTokenBalanceCommand' as const;

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

      const result = await client.readContract({
        abi: ERC20_ABI,
        functionName: 'balanceOf',
        args: [this.payload.userAddress],
        address: this.payload.tokenAddress,
      });
      const balanceAsEth = formatEther(result); // TODO: format with decimals (fetch decimals from token contract)

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
