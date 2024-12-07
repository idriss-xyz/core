import {
  Command,
  FailureResult,
  HandlerError,
  HandlerResponseError,
  OkResult,
} from 'shared/messaging';

import { GetApiKeyResponse, L1Headers } from '../types';
import { POLYMARKET_CLOB_API } from '../constants';
import { getApiKeyResponseSchema } from '../schema';

type Payload = {
  headers: L1Headers;
};

export class GetApiKeyCommand extends Command<Payload, GetApiKeyResponse> {
  public readonly name = 'GetApiKeyCommand' as const;

  constructor(public payload: Payload) {
    super();
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

      if (!response.ok) {
        const responseText = await response.text();
        throw new HandlerResponseError(
          this.name,
          responseText,
          response.status,
        );
      }

      const json = await response.json();

      const validResponse = getApiKeyResponseSchema.parse(json);
      return new OkResult(validResponse);
    } catch (error) {
      this.captureException(error);
      if (error instanceof HandlerError) {
        return new FailureResult(error.message);
      }
      return new FailureResult();
    }
  }
}
