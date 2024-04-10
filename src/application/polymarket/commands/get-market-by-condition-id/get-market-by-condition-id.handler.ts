import {
  FailureResult,
  Handler,
  HandlerError,
  OkResult,
} from 'shared/messaging';
import { sendHandlerExceptionEvent } from 'shared/monitoring';

import { POLYMARKET_CLOB_API } from '../../polymarket.constants';
import { MarketData } from '../../polymarket.types';

import { GetMarketByConditionIdCommand } from './get-market-by-condition-id.command';

export class GetMarketsByConditionIdHandler implements Handler {
  async handle(command: GetMarketByConditionIdCommand) {
    try {
      const response = await fetch(
        `${POLYMARKET_CLOB_API}/markets/${command.details.conditionId}`,
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
      const json = await response.json();
      return new OkResult(json as MarketData);
    } catch (error) {
      await sendHandlerExceptionEvent(command);
      if (error instanceof HandlerError) {
        return new FailureResult(error.message);
      }
      return new FailureResult();
    }
  }
}
