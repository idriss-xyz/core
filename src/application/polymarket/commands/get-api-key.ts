import {
  Command,
  FailureResult,
  HandlerError,
  OkResult,
} from 'shared/messaging';

import { GetApiKeyResponse, L1Headers } from '../types';
import { POLYMARKET_CLOB_API } from '../constants';
import { getApiKeyResponseSchema } from '../schema';

interface Payload {
  headers: L1Headers;
}

export class GetApiKeyCommand extends Command<Payload, GetApiKeyResponse> {
  public readonly name = 'GetApiKeyCommand' as const;

  constructor(
    public payload: Payload,
    id?: string,
  ) {
    super(id ?? null);
  }

  async handle() {
    try {
      const response = await fetch(
        `${POLYMARKET_CLOB_API}/auth/derive-api-key`,
        {
          headers: {
            ...this.payload.headers,
          },
        },
      );

      if (response.status !== 200) {
        throw new HandlerError();
      }

      const json = await response.json();

      const validResponse = getApiKeyResponseSchema.parse(json);
      return new OkResult(validResponse);
    } catch (error) {
      await this.logException(error);
      if (error instanceof HandlerError) {
        return new FailureResult(error.message);
      }
      return new FailureResult();
    }
  }
}
