import { Connection, PublicKey } from '@solana/web3.js';

import {
  Command,
  FailureResult,
  HandlerError,
  OkResult,
} from 'shared/messaging';

type Payload = {
  address: string;
};

export class GetSolanaBalanceCommand extends Command<Payload, string | null> {
  public readonly name = 'GetSolanaBalanceCommand' as const;

  constructor(public payload: Payload) {
    super();
  }

  async handle() {
    try {
      const connection = new Connection('https://solana-rpc.publicnode.com');

      const result = await connection.getBalance(
        new PublicKey(this.payload.address),
      );
      const balanceAsSol = (result / 1_000_000_000).toString();

      return new OkResult(balanceAsSol);
    } catch (error) {
      this.captureException(error);
      if (error instanceof HandlerError) {
        return new FailureResult(error.message);
      }

      return new FailureResult();
    }
  }
}
