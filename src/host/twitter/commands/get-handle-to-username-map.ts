import { z } from 'zod';

import {
  Command,
  FailureResult,
  HandlerError,
  OkResult,
} from 'shared/messaging';

type Payload = Record<string, never>;

const responseSchema = z.record(z.string(), z.record(z.string(), z.string()));
type Response = z.infer<typeof responseSchema>;

export class GetHandleToUsernameMapCommand extends Command<Payload, Response> {
  public readonly name = 'GetHandleToUsernameMapCommand' as const;

  constructor(
    public payload: Payload,
    id?: string,
  ) {
    super(id ?? null);
  }

  async handle() {
    try {
      const response = await fetch(
        'https://api.idriss.xyz/dao-twitter-handles',
      );
      const json = await response.json();
      const validationResult = responseSchema.safeParse(json);
      if (!validationResult.success) {
        throw new HandlerError('Schema validation failed');
      }

      return new OkResult(validationResult.data);
    } catch (error) {
      await this.logException(error);
      if (error instanceof HandlerError) {
        return new FailureResult(error.message);
      }

      return new FailureResult();
    }
  }
}
