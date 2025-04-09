import {
  Command,
  FailureResult,
  HandlerError,
  HandlerResponseError,
  OkResult,
} from 'shared/messaging';

import { smartFollowersSchema } from '../schema';
import { SmartFollowersResponse } from '../types';

type Payload = {
  username: string;
};

export class GetSmartFollowersCommand extends Command<
  Payload,
  SmartFollowersResponse
> {
  public readonly name = 'GetSmartFollowersCommand' as const;

  constructor(public payload: Payload) {
    super();
  }

  async handle() {
    try {
      const response = await fetch(
        `https://api.idriss.xyz/smart-followers?username=${this.payload.username}`,
        {
          headers: {
            'Content-Type': 'application/json',
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

      const validResponse = smartFollowersSchema.parse(json);

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
