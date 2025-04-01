import { COPILOT_API_URL } from '@idriss-xyz/constants';

import {
  Command,
  FailureResult,
  HandlerError,
  HandlerResponseError,
  OkResult,
} from 'shared/messaging';

import {
  VerifySiweSignaturePayload as Payload,
  VerifySiweSignatureResponse as Response,
} from '../types';

export class VerifySiweSignatureCommand extends Command<Payload, Response> {
  public readonly name = 'VerifySiweSignatureCommand' as const;

  constructor(public payload: Payload) {
    super();
  }

  async handle() {
    try {
      const response = await fetch(`${COPILOT_API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(this.payload),
      });

      if (!response.ok) {
        const responseText = await response.text();
        throw new HandlerResponseError(
          this.name,
          responseText,
          response.status,
        );
      }

      const json = (await response.json()) as Response;

      return new OkResult(json);
    } catch (error) {
      this.captureException(error);
      if (error instanceof HandlerError) {
        return new FailureResult(error.message);
      }

      return new FailureResult();
    }
  }
}
