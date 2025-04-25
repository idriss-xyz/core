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
  public readonly name = 'GetYapsCommand' as const;

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

      if (response.status === 204) {
        const zeroYaps = yapSchema.parse({
          user_id: '',
          username: this.payload.username,
          yaps_all: 0,
          yaps_l24h: 0,
          yaps_l48h: 0,
          yaps_l7d: 0,
          yaps_l30d: 0,
          yaps_l3m: 0,
          yaps_l6m: 0,
          yaps_l12m: 0,
        });
        return new OkResult(zeroYaps);
      }

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
