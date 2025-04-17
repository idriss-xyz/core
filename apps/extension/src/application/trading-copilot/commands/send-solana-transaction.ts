import { COPILOT_API_URL } from '@idriss-xyz/constants';

import {
  Command,
  FailureResult,
  HandlerError,
  HandlerResponseError,
  OkResult,
} from 'shared/messaging';

import {
  SendSolanaTxResponse as Response,
  SendSolanaTxPayload as Payload,
} from '../types';

export class SendSolanaTransactionCommand extends Command<Payload, Response> {
  public readonly name = 'SendSolanaTransactionCommand' as const;

  constructor(public payload: Payload) {
    super();
  }

  async handle() {
    try {
      const response = await fetch(`${COPILOT_API_URL}/solana/send`, {
        method: 'POST',
        body: JSON.stringify(this.payload),
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
