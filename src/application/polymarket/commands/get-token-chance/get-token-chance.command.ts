import { Command } from 'shared/messaging';

import { GetTokenChanceCommandDetails } from './get-token-chance.types';

export class GetTokenChanceCommand extends Command<GetTokenChanceCommandDetails> {
  public readonly name = 'GetTokenChanceCommand' as const;
  public id: string;

  constructor(public details: GetTokenChanceCommandDetails) {
    super();
    this.id = `${this.name}-${details.tokenId}`;
  }
}
