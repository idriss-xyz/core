import {
  FailureResult,
  Handler,
  HandlerError,
  OkResult,
} from 'shared/messaging';
import { sendHandlerExceptionEvent } from 'shared/monitoring';

import { GetApplicationsResponse } from '../../donation.types';

import { GetApplicationsCommand } from './get-applications.command';
import {
  GET_APPLICATIONS_QUERY,
  GITCOIN_GRAPHQL_API_URL,
} from './get-applications.constants';

export class GetApplicationsHandler implements Handler<GetApplicationsCommand> {
  async handle(command: GetApplicationsCommand) {
    try {
      const response = await fetch(GITCOIN_GRAPHQL_API_URL, {
        method: 'POST',
        body: JSON.stringify({
          query: GET_APPLICATIONS_QUERY,
          operationName: 'Applications',
          variables: {
            currentIsoDate:(new Date()).toISOString()
          },
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status !== 200) {
        throw new HandlerError();
      }

      // TODO: schema validation
      const json = (await response.json()) as { data: GetApplicationsResponse };

      return new OkResult(json.data);
    } catch (error) {
      await sendHandlerExceptionEvent(command);
      if (error instanceof HandlerError) {
        return new FailureResult(error.message);
      }

      return new FailureResult();
    }
  }
}
