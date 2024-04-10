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

export class GetApiKeyHandler implements Handler {
  async handle(command: GetApiKeyCommand) {
    try {
      const response = await fetch(
        `${POLYMARKET_CLOB_API}/auth/derive-api-key`,
        {
          method: 'GET',
          headers: {
            ...command.details.headers,
            'Accept-Encoding': 'gzip',
            'Content-Type': 'application/json',
            'User-Agent': `@polymarket/clob-client`,
            'Accept': '*/*',
            'Connection': 'keep-alive',
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
