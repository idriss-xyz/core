import { z } from 'zod';

import {
  Command,
  FailureResult,
  HandlerError,
  OkResult,
} from 'shared/messaging';

type Payload = Record<string, never>;

const responseSchema = z.record(z.string(), z.boolean());
type Response = z.infer<typeof responseSchema>;

export class GetServiceStatusCommand extends Command<Payload, Response> {
  public readonly name = 'GetServiceStatusCommand' as const;

  constructor(public payload: Record<string, never>) {
    super();
  }

  async handle() {
    try {
      const response = await fetch('https://api.idriss.xyz/service-status');
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
