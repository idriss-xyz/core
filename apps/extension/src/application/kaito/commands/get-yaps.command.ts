import {
  Command,
  FailureResult,
  HandlerError,
  HandlerResponseError,
  OkResult,
} from 'shared/messaging';

import { yapSchema } from '../schema';
import { YapResponse } from '../types';

type Payload = {
  username: string;
};

export class GetYapsCommand extends Command<Payload, YapResponse> {
  public readonly name = 'GetYapsProposalsCommand' as const;

  constructor(public payload: Payload) {
    super();
  }

  async handle() {
    try {
      const kaito_url = `https://api.kaito.ai/api/v1/yaps?username=${this.payload.username}`;

      const response = await fetch(kaito_url, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const responseText = await response.text();
        throw new HandlerResponseError(
          this.name,
          responseText,
          response.status,
        );
      }

      const json = await response.json();

      const validResponse = yapSchema.parse(json);

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
