import { Command } from 'shared/messaging';

import { GetMarketByConditionIdCommandDetails } from './get-market-by-condition-id.types';

export class GetMarketByConditionIdCommand extends Command<GetMarketByConditionIdCommandDetails> {
  public readonly name = 'GetMarketByConditionIdCommand' as const;
  public id: string;

  constructor(public details: GetMarketByConditionIdCommandDetails) {
    super();
    this.id = `${this.name}-${details.conditionId}`;
  }
}
