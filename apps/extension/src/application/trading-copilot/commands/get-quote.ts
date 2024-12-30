import {
  Command,
  FailureResult,
  HandlerError,
  HandlerResponseError,
  OkResult,
} from 'shared/messaging';

import { QuoteResponse as Response, QuotePayload as Payload } from '../types';

import { QUOTE_API_URL } from './constants';

export class GetQuoteCommand extends Command<Payload, Response> {
  public readonly name = 'GetQuoteCommand' as const;

  constructor(public payload: Payload) {
    super();
  }

  async handle() {
    try {
      const response = await fetch(QUOTE_API_URL, {
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
