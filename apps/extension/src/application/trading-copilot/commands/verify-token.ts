import { COPILOT_API_URL } from '@idriss-xyz/constants';

import { Command, OkResult } from 'shared/messaging';


type Payload = {
  token: string;
};

type Response = boolean;

export class VerifyTokenCommand extends Command<Payload, Response> {
  public readonly name = 'VerifyTokenCommand' as const;

  constructor(public payload: Payload) {
    super();
  }

  async handle() {
    try {
      const response = await fetch(`${COPILOT_API_URL}/auth/verify-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(this.payload),
      });

      // endpoint return status 200 if token is valid
      if (response.status === 200) {
        return new OkResult(true);
      }

      return new OkResult(false);
    } catch (error) {
      this.captureException(error);
      return new OkResult(false);
    }
  }
}
