import {
  Command,
  FailureResult,
  HandlerError,
  HandlerResponseError,
  OkResult,
} from 'shared/messaging';

import {
  FarcasterAddressPayload as Payload,
  FarcasterAddressResponse as Response,
  FarcasterTransferResponse,
  FarcasterConnectedAddressesResponse,
} from '../types';

export class GetFarcasterAddressCommand extends Command<Payload, Response> {
  public readonly name = 'GetFarcasterAddressCommand' as const;

  constructor(public payload: Payload) {
    super();
  }

  async handle() {
    try {
      const transferResponse = await fetch(
        `https://fnames.farcaster.xyz/transfers/current?name=${this.payload.name}`,
        {
          method: 'GET',
        },
      );

      if (!transferResponse.ok) {
        const responseText = await transferResponse.text();
        throw new HandlerResponseError(
          this.name,
          responseText,
          transferResponse.status,
        );
      }

      const transferData =
        (await transferResponse.json()) as FarcasterTransferResponse;

      const connectedAddressesResponse = await fetch(
        `https://api.idriss.xyz/snap/get-connected-addresses?fid=${transferData.transfer.to}`,
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
        ? new OkResult({
            fid: transferData.transfer.to,
            address: verifiedAddress.address,
          })
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
