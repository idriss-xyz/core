import {
  FailureResult,
  Handler,
  HandlerError,
  OkResult,
} from 'shared/messaging';
import { sendHandlerExceptionEvent } from 'shared/monitoring';

import { POLYMARKET_CLOB_API } from '../../polymarket.constants';
import { getApiKeyResponseSchema } from '../../polymarket.schema';

import { GetApiKeyCommand } from './get-api-key.command';

export class GetApiKeyHandler implements Handler<GetApiKeyCommand> {
  async handle(command: GetApiKeyCommand) {
    try {
      const response = await fetch(
        `${POLYMARKET_CLOB_API}/auth/derive-api-key`,
        {
          headers: {
            ...command.details.headers,
          },
        },
      );

      if (response.status !== 200) {
        throw new HandlerError();
      }

      const json = await response.json();

      const validResponse = getApiKeyResponseSchema.parse(json);
      return new OkResult(validResponse);
    } catch (error) {
      await sendHandlerExceptionEvent(command);
      if (error instanceof HandlerError) {
        return new FailureResult(error.message);
      }
      return new FailureResult();
    }
  }
}
