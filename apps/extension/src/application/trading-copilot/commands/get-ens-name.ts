import { createPublicClient, Hex, http, isAddress } from 'viem';
import { mainnet } from 'viem/chains';
import { isSolanaAddress } from '@idriss-xyz/utils';

import {
  Command,
  FailureResult,
  HandlerError,
  OkResult,
} from 'shared/messaging';

type Payload = {
  address: Hex;
};

type Response = string | null;

export class GetEnsNameCommand extends Command<Payload, Response> {
  public readonly name = 'GetEnsNameCommand' as const;

  constructor(public payload: Payload) {
    super();
  }

  async handle() {
    try {
      // We son't resolve for solana names
      if (isSolanaAddress(this.payload.address)) {
        return new OkResult(this.payload.address);
      }
      if (!isAddress(this.payload.address)) {
        return new FailureResult('Not an EVM address');
      }
      const client = createPublicClient({
        chain: { ...mainnet },
        transport: http('https://eth.llamarpc.com'),
      });
      const result = await client.getEnsName(this.payload);

      return new OkResult(result);
    } catch (error) {
      this.captureException(error);
      if (error instanceof HandlerError) {
        return new FailureResult(error.message);
      }

      return new FailureResult();
    }
  }
}
