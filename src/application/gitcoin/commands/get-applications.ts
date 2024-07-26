import { z } from 'zod';

import {
  Command,
  FailureResult,
  HandlerError,
  OkResult,
} from 'shared/messaging';

import { Api } from '../api';
import { Application } from '../types';
import { applicationSchema } from '../schema';

type Payload = Record<string, never>;
const responseSchema = z.array(applicationSchema);

export class GetApplicationsCommand extends Command<Payload, Application[]> {
  public readonly name = 'GetApplicationsCommand' as const;

  constructor(
    public payload: Payload,
    id?: string,
  ) {
    super(id ?? null);
  }

  async handle() {
    try {
      const response = await Api.getApplications();

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
      await this.logException(error);
      if (error instanceof HandlerError) {
        return new FailureResult(error.message);
      }

      return new FailureResult();
    }
  }
}
