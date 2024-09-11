import { ethers } from 'ethers';

import { Command, FailureResult, OkResult } from 'shared/messaging';

import { Hex } from '../types';
import { hexSchema } from '../schema';

interface Payload {
  username: string;
}

type Response = Hex;

export class GetWalletByEnsNameCommand extends Command<Payload, Response> {
  public readonly name = 'GetWalletByEnsNameCommand' as const;

  constructor(public payload: Payload) {
    super();
  }

  async handle() {
    try {
      const provider = new ethers.providers.JsonRpcProvider(
        'https://eth.llamarpc.com',
        { chainId: 1, name: 'mainnet' },
      );
      const maybeWallet = await provider.resolveName(this.payload.username);
      const walletValidationResult = hexSchema.safeParse(maybeWallet);
      if (!walletValidationResult.success) {
        return new FailureResult();
      }
      return new OkResult(walletValidationResult.data);
    } catch (error) {
      this.captureException(error);
      return new FailureResult();
    }
  }
}
