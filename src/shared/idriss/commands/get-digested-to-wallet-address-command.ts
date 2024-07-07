import {
  Command,
  FailureResult,
  HandlerError,
  OkResult,
} from 'shared/messaging';
import { createContract } from 'shared/web3';

import { GET_MULTIPLE_IDRISS_REGISTRY_ABI } from '../constants';

interface Payload {
  digestedMessages: string[];
}

type ResponseBeforeParsing = [string, string][];

type Response = Record<string, string>;

export class GetDigestToWalletAddressCommand extends Command<
  Payload,
  Response
> {
  public readonly name = 'GetDigestToWalletAddressCommand' as const;

  constructor(
    public payload: Payload,
    id?: string,
  ) {
    super(id ?? null);
  }

  async handle() {
    try {
      const contract = createContract({
        abi: GET_MULTIPLE_IDRISS_REGISTRY_ABI,
        address: '0xa179BF6f32483A82d4BD726068EfD93E29f3c930',
        signerOrProvider: 'https://polygon-rpc.com/',
      });
      const [result] = (await contract?.functions?.getMultipleIDriss?.(
        this.payload.digestedMessages,
      )) as [ResponseBeforeParsing];

      return new OkResult(Object.fromEntries(result));
    } catch (error) {
      await this.logException(error);
      if (error instanceof HandlerError) {
        return new FailureResult(error.message);
      }

      return new FailureResult();
    }
  }
}
