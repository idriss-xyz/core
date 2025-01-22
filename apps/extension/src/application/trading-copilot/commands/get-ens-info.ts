import { createPublicClient, http } from 'viem';
import { mainnet } from 'viem/chains';
import { normalize } from 'viem/ens';

import {
  Command,
  FailureResult,
  HandlerError,
  OkResult,
} from 'shared/messaging';

type Payload = {
  ensName: string;
  infoKey: 'com.discord' | 'email' | 'com.github' | 'com.twitter' | 'avatar';
};

type Response = string | null;

export class GetEnsInfoCommand extends Command<Payload, Response> {
  public readonly name = 'GetEnsInfoCommand' as const;

  constructor(public payload: Payload) {
    super();
  }

  async handle() {
    try {
      const client = createPublicClient({
        chain: { ...mainnet },
        transport: http('https://eth.llamarpc.com'),
      });

      const result = await client.getEnsText({
        name: normalize(this.payload.ensName),
        key: this.payload.infoKey,
      });

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
