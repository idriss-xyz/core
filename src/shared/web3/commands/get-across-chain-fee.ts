import {
  Command,
  FailureResult,
  HandlerError,
  OkResult,
  useCommandMutation,
} from 'shared/messaging';

interface GetAcrossChainFeeCommandDetails {
  chain: {
    id: number;
    wrappedEthAddress: string;
  };
  destinationChainId: number;
  amount: string;
  message: string;
  recipient: string;
}

interface GetAcrossChainFeeResponse {
  timestamp: string;
  totalRelayFee: {
    total: string;
  };
}

export class GetAcrossChainFeeCommand extends Command<
  GetAcrossChainFeeCommandDetails,
  GetAcrossChainFeeResponse
> {
  public readonly name = 'GetAcrossChainFeeCommand' as const;

  constructor(
    public details: GetAcrossChainFeeCommandDetails,
    id?: string,
  ) {
    super(id ?? null);
  }

  async handle() {
    try {
      const url = `https://across.to/api/suggested-fees?${new URLSearchParams({
        originChainId: this.details.chain.id.toString(),
        token: this.details.chain.wrappedEthAddress,
        amount: this.details.amount,
        message: this.details.message,
        recipient: this.details.recipient,
        destinationChainId: this.details.destinationChainId.toString(),
      }).toString()}`;

      const response = await fetch(`https://www.idriss.xyz/post-data`, {
        method: 'POST',
        body: JSON.stringify({ url }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status !== 200) {
        throw new HandlerError();
      }

      const json = (await response.json()) as GetAcrossChainFeeResponse;

      return new OkResult(json);
    } catch (error) {
      await this.trackHandlerException();
      if (error instanceof HandlerError) {
        return new FailureResult(error.message);
      }

      return new FailureResult();
    }
  }
}

export const useGetAcrossChainFeeCommandMutation = () => {
  return useCommandMutation(GetAcrossChainFeeCommand);
};
