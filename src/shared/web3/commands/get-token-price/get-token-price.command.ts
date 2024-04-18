import { Command } from 'shared/messaging';

import { GetEthPriceResponse } from '../../web3.types';

import { GetTokenPriceCommandDetails } from './get-token-price.types';

export class GetTokenPriceCommand extends Command<
  GetTokenPriceCommandDetails,
  GetEthPriceResponse
> {
  public readonly name = 'GetTokenPriceCommand' as const;
  public readonly id: string;

  constructor(public details: GetTokenPriceCommandDetails) {
    super();
    this.id = this.name;
  }
}
