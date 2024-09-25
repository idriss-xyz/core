import { z } from 'zod';

import {
  Command,
  FailureResult,
  HandlerError,
  OkResult,
} from 'shared/messaging';
import { Hex, hexSchema } from 'shared/web3';

import { getAccountByFid, getUserFid } from '../api';

// TODO: schema should be probably a part of api layer
const getUserFidResponseSchema = z.object({
  transfer: z.object({
    to: z.number(),
  }),
});

const getAccountResponseSchema = z.object({
  result: z.object({
    verifications: z.array(
      z.object({
        address: z.string(), // adressess from protocols other than ethereum are not Hexes
        protocol: z.string(),
        timestamp: z.number(),
      }),
    ),
  }),
});

type Payload = {
  username: string;
};

type Response = Hex;

export class GetWalletByFarcasterUsernameCommand extends Command<
  Payload,
  Response
> {
  public readonly name = 'GetWalletByFarcasterUsernameCommand' as const;

  constructor(public payload: Payload) {
    super();
  }

  async handle() {
    try {
      const { username } = this.payload;
      const userFidResponse = await getUserFid(username);
      if (!userFidResponse.ok && userFidResponse.status !== 404) {
        return new FailureResult();
      }
      const userFidResponseJson = await userFidResponse.json();
      const userFidResponseValidationResult =
        getUserFidResponseSchema.safeParse(userFidResponseJson);
      if (!userFidResponseValidationResult.success) {
        return new FailureResult();
      }
      const fid = userFidResponseValidationResult.data.transfer.to;

      const userAccountResponse = await getAccountByFid(fid);

      if (!userAccountResponse.ok) {
        return new FailureResult();
      }

      const userAccountResponseJson = await userAccountResponse.json();
      const userAccountResponseValidationResult =
        getAccountResponseSchema.safeParse(userAccountResponseJson);
      if (!userAccountResponseValidationResult.success) {
        return new FailureResult();
      }
      const [newesetEthereumVerification] =
        userAccountResponseValidationResult.data.result.verifications
          .filter((verification) => {
            return verification.protocol === 'ethereum';
          })
          .sort((a, b) => {
            return b.timestamp - a.timestamp;
          });

      if (!newesetEthereumVerification?.address) {
        return new FailureResult();
      }

      const addressValidationResult = hexSchema.safeParse(
        newesetEthereumVerification.address,
      );

      if (!addressValidationResult.success) {
        return new FailureResult();
      }

      return new OkResult(addressValidationResult.data);
    } catch (error) {
      this.captureException(error);
      if (error instanceof HandlerError) {
        return new FailureResult(error.message);
      }

      return new FailureResult();
    }
  }
}
