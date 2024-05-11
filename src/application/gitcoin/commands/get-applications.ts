import {
  Command,
  FailureResult,
  HandlerError,
  OkResult,
} from 'shared/messaging';

import { Api } from '../api';
import { GetApplicationsResponse } from '../types';

type Details = Record<string, never>;

export class GetApplicationsCommand extends Command<
  Details,
  GetApplicationsResponse
> {
  public readonly name = 'GetApplicationsCommand' as const;

  constructor(
    public details: Details,
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

      // TODO: schema validation
      const json = (await response.json()) as { data: GetApplicationsResponse };

      return new OkResult(json.data);
    } catch (error) {
      await this.trackHandlerException();
      if (error instanceof HandlerError) {
        return new FailureResult(error.message);
      }

      return new FailureResult();
    }
  }
}
