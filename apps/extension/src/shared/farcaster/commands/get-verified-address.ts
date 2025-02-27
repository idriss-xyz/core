import { Hex } from 'viem';

import {
  Command,
  FailureResult,
  HandlerError,
  HandlerResponseError,
  OkResult,
} from 'shared/messaging';

type Payload = {
  name: string;
};
type Response = {
  fid: number;
  address: Hex;
} | null;

export class GetFarcasterVerifiedAddressCommand extends Command<
  Payload,
  Response
> {
  public readonly name = 'GetFarcasterVerifiedAddressCommand' as const;

  constructor(public payload: Payload) {
    super();
  }

  async handle() {
    try {
      const connectedAddressesResponse = await fetch(
        `https://api.idriss.xyz/get-connected-addresses?name=${this.payload.name}`,
        {
          method: 'GET',
        },
      );

      if (!connectedAddressesResponse.ok) {
        const responseText = await connectedAddressesResponse.text();
        throw new HandlerResponseError(
          this.name,
          responseText,
          connectedAddressesResponse.status,
        );
      }

      const connectedAddressesData =
        (await connectedAddressesResponse.json()) as Response;

      return new OkResult(connectedAddressesData);
    } catch (error) {
      this.captureException(error);
      if (error instanceof HandlerError) {
        return new FailureResult(error.message);
      }

      return new FailureResult();
    }
  }
}
