import {
  Command,
  FailureResult,
  HandlerError,
  OkResult,
  useCommandQuery,
} from 'shared/messaging';

interface GetAcrossChainFeesCommandDetails {
  chains: { id: number; wrappedEthAddress: string }[];
  destinationChainId: number;
  amount: string;
  message: string;
  recipient: string;
}

interface GetAcrossChainFeesResponse {
  totalRelayFee: {
    total: string;
  };
}

export class GetAcrossChainFeesCommand extends Command<
  GetAcrossChainFeesCommandDetails,
  Record<string, GetAcrossChainFeesResponse>
> {
  public readonly name = 'GetAcrossChainFeesCommand' as const;

  constructor(
    public details: GetAcrossChainFeesCommandDetails,
    id?: string,
  ) {
    super(id ?? null);
  }

  async handle() {
    try {
      const promises = this.details.chains.map(async (chain) => {
        const url = `https://across.to/api/suggested-fees?${new URLSearchParams(
          {
            originChainId: chain.id.toString(),
            token: chain.wrappedEthAddress,
            amount: this.details.amount,
            message: this.details.message,
            recipient: this.details.recipient,
            destinationChainId: this.details.destinationChainId.toString(),
          },
        ).toString()}`;

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

        const json = (await response.json()) as GetAcrossChainFeesResponse;
        return [chain.id.toString(), json];
      });

      const response: Record<string, GetAcrossChainFeesResponse> =
        Object.fromEntries(await Promise.all(promises));

      return new OkResult(response);
    } catch (error) {
      await this.trackHandlerException();
      if (error instanceof HandlerError) {
        return new FailureResult(error.message);
      }

      return new FailureResult();
    }
  }
}

export const useGetAcrossChainFeesCommandQuery = (
  details: GetAcrossChainFeesCommandDetails,
  options: {
    enabled?: boolean;
  } = {},
) => {
  return useCommandQuery({
    command: new GetAcrossChainFeesCommand(details),
    enabled: options?.enabled ?? Number(details.amount) > 0,
    refetchInterval: 60_000, // each 1m,
    retry: 3,
  });
};
