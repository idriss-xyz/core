import { z } from 'zod';

import {
  Command,
  FailureResult,
  HandlerError,
  OkResult,
} from 'shared/messaging';

import { Api } from '../api';
import { customRecipientSchema } from '../schema';

type Payload = Record<string, never>;

const responseSchema = z.record(z.string(), customRecipientSchema);

type Response = z.infer<typeof responseSchema>;

export class GetCustomRecipientsCommand extends Command<Payload, Response> {
  public readonly name = 'GetCustomRecipientsCommand' as const;

  constructor(
    public payload: Payload,
    id?: string,
  ) {
    super(id ?? null);
  }

  async handle() {
    try {
      const response = await Api.getCustomRecipients();
      if (response.status !== 200) {
        throw new HandlerError();
      }
      const json = await response.json();
      const validationResult = responseSchema.safeParse(json);
      if (!validationResult.success) {
        throw new HandlerError('Schema validation failed');
      }
      return new OkResult(validationResult.data);
    } catch (error) {
      await this.logException();
      if (error instanceof HandlerError) {
        return new FailureResult(error.message);
      }

      return new FailureResult();
    }
  }
}
