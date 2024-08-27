import { z } from 'zod';

import {
  Command,
  FailureResult,
  HandlerError,
  HandlerResponseError,
  OkResult,
} from 'shared/messaging';

import { Api } from '../api';
import { customRecipientSchema } from '../schema';

type Payload = Record<string, never>;

const responseSchema = z.record(z.string(), customRecipientSchema);

type Response = z.infer<typeof responseSchema>;

export class GetCustomRecipientsCommand extends Command<Payload, Response> {
  public readonly name = 'GetCustomRecipientsCommand' as const;

  constructor(public payload: Payload) {
    super();
  }

  async handle() {
    try {
      const response = await Api.getCustomRecipients();
      if (!response.ok) {
        const responseText = await response.text();
        throw new HandlerResponseError(
          this.name,
          responseText,
          response.status,
        );
      }
      const json = await response.json();
      const validationResult = responseSchema.safeParse(json);
      if (!validationResult.success) {
        throw new HandlerError('Schema validation failed');
      }
      return new OkResult(validationResult.data);
    } catch (error) {
      this.captureException(error);
      if (error instanceof HandlerError) {
        return new FailureResult(error.message);
      }

      return new FailureResult();
    }
  }
}
