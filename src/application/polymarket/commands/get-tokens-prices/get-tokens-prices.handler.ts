import {
  FailureResult,
  Handler,
  HandlerError,
  OkResult,
} from 'shared/messaging';
import { sendHandlerExceptionEvent } from 'shared/monitoring';

import { POLYMARKET_CLOB_API } from '../../polymarket.constants';
import { GetTokenPriceResponse, TokenIdToPrice } from '../../polymarket.types';

import { GetTokensPricesCommand } from './get-tokens-prices.command';

export class GetTokensPricesHandler implements Handler {
  async handle(command: GetTokensPricesCommand) {
    try {
      const requests = command.details.tokensIds.map(async (tokenId) => {
        const response = await fetch(
          `${POLYMARKET_CLOB_API}/price?token_id=${tokenId}&side=sell`,
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

        const json = (await response.json()) as GetTokenPriceResponse;

        return [tokenId, Number(json.price)];
      });
      const responses = await Promise.all(requests);
      const result: TokenIdToPrice = Object.fromEntries(responses);
      return new OkResult(result);
    } catch (error) {
      await sendHandlerExceptionEvent(command);
      if (error instanceof HandlerError) {
        return new FailureResult(error.message);
      }

      return new FailureResult();
    }
  }
}
