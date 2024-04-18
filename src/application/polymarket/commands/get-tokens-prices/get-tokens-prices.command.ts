import { Command } from 'shared/messaging';
import { TokenIdToPrice } from 'application/polymarket/polymarket.types';

import { GetTokensPricesCommandDetails } from './get-tokens-prices.types';

export class GetTokensPricesCommand extends Command<
  GetTokensPricesCommandDetails,
  TokenIdToPrice
> {
  public readonly name = 'GetTokensPricesCommand' as const;
  public id: string;

  constructor(public details: GetTokensPricesCommandDetails) {
    super();
    this.id = `${this.name}-${details.tokensIds.join('-')}`;
  }
}
