import {
  Command,
  FailureResult,
  HandlerError,
  HandlerResponseError,
  OkResult,
} from 'shared/messaging';

import {
  FarcasterAddressRequest as Payload,
  FarcasterAddressResponse as Response,
  FarcasterTransfersResponse,
  FarcasterConnectedAddressesResponse,
} from '../types';

export class GetFarcasterAddressCommand extends Command<Payload, Response> {
  public readonly name = 'GetFarcasterAddressCommand' as const;

  constructor(public payload: Payload) {
    super();
  }

  async handle() {
    try {
      const transfersResponse = await fetch(
        `https://fnames.farcaster.xyz/transfers/current?name=${this.payload.name}`,
        {
          method: 'GET',
        },
      );

      if (!transfersResponse.ok) {
        const responseText = await transfersResponse.text();
        throw new HandlerResponseError(
          this.name,
          responseText,
          transfersResponse.status,
        );
      }

      const transfersData =
        (await transfersResponse.json()) as FarcasterTransfersResponse;

      const connectedAddressesResponse = await fetch(
        `https://api.idriss.xyz/snap/get-connected-addresses?fid=${transfersData.transfer.to}`,
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
        (await connectedAddressesResponse.json()) as FarcasterConnectedAddressesResponse;

      const verifiedAddress =
        connectedAddressesData.result?.verifications?.find((address) => {
          return address.protocol === 'ethereum';
        });

      return verifiedAddress
        ? new OkResult(verifiedAddress.address)
        : new OkResult(null);
    } catch (error) {
      this.captureException(error);
      if (error instanceof HandlerError) {
        return new FailureResult(error.message);
      }

      return new FailureResult();
    }
  }
}
