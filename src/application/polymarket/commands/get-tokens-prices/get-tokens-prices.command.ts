import { Command } from 'shared/messaging';

import { GetTokensPricesCommandDetails } from './get-tokens-prices.types';

export class GetTokensPricesCommand extends Command<GetTokensPricesCommandDetails> {
  public readonly name = 'GetTokensPricesCommand' as const;
  public id: string;

  constructor(public details: GetTokensPricesCommandDetails) {
    super();
    this.id = `${this.name}-${details.tokensIds.join('-')}`;
  }
}
