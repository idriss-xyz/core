import { Command, OkResult } from 'shared/messaging';

import { VerifyAuthTokenPayload as Payload } from '../types';

import { COPILOT_API_URL } from './constants';

export class VerifyTokenCommand extends Command<Payload, boolean> {
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

      // endpoint throws 401 if token is outdated
      if (response.status === 401) {
        return new OkResult(false);
      }

      return new OkResult(true);
    } catch (error) {
      this.captureException(error);
      return new OkResult(false);
    }
  }
}
