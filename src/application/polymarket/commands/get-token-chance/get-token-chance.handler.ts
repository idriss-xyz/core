// https://clob.polymarket.com/midpoint
import {
  FailureResult,
  Handler,
  HandlerError,
  OkResult,
} from 'shared/messaging';
import { sendHandlerExceptionEvent } from 'shared/monitoring';

import { POLYMARKET_CLOB_API } from '../../polymarket.constants';

import { GetTokenChanceCommand } from './get-token-chance.command';

export class GetTokenChanceHandler implements Handler {
  async handle(command: GetTokenChanceCommand) {
    try {
      const response = await fetch(
        `${POLYMARKET_CLOB_API}/midpoint?token_id=${command.details.tokenId}`,
        {
          method: 'GET',
          headers: {
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
      // TODO: validate response
      const json = (await response.json()) as { mid: string };
      return new OkResult(
        Number((Math.round(Number(json.mid) * 100) / 100).toFixed(2)),
      );
    } catch (error) {
      await sendHandlerExceptionEvent(command);
      if (error instanceof HandlerError) {
        return new FailureResult(error.message);
      }

      return new FailureResult();
    }
  }
}
