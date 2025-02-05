import { createPublicClient, http, isAddress } from 'viem';
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
};

export class GetEnsNameCommand extends Command<Payload, string | null> {
  public readonly name = 'GetEnsNameCommand' as const;

  constructor(public payload: Payload) {
    super();
  }

  async handle() {
    try {
      if (!isAddress(this.payload.address)){
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
