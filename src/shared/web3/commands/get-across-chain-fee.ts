import {
  Command,
  FailureResult,
  HandlerError,
  OkResult,
} from 'shared/messaging';

interface Payload {
  chain: {
    id: number;
    wrappedEthAddress: string;
  };
  destinationChainId: number;
  amount: string;
  message: string;
  recipient: string;
}

interface Response {
  timestamp: string;
  totalRelayFee: {
    total: string;
  };
}

export class GetAcrossChainFeeCommand extends Command<Payload, Response> {
  public readonly name = 'GetAcrossChainFeeCommand' as const;

  constructor(public payload: Payload) {
    super();
  }

  async handle() {
    try {
      const url = `https://across.to/api/suggested-fees?${new URLSearchParams({
        originChainId: this.payload.chain.id.toString(),
        token: this.payload.chain.wrappedEthAddress,
        amount: this.payload.amount,
        message: this.payload.message,
        recipient: this.payload.recipient,
        destinationChainId: this.payload.destinationChainId.toString(),
      }).toString()}`;

      const response = await fetch(`https://api.idriss.xyz/post-data`, {
        method: 'POST',
        body: JSON.stringify({ url }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status !== 200) {
        throw new HandlerError();
      }

      const json = (await response.json()) as Response;

      return new OkResult(json);
    } catch (error) {
      this.captureException(error);
      if (error instanceof HandlerError) {
        return new FailureResult(error.message);
      }

      return new FailureResult();
    }
  }
}
