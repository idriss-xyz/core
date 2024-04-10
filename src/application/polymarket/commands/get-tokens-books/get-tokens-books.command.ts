import { Command } from 'shared/messaging';

import { GetTokensBooksCommandDetails } from './get-tokens-books.types';

export class GetTokensBooksCommand extends Command<GetTokensBooksCommandDetails> {
  public readonly name = 'GetTokensBooksCommand' as const;
  public id: string;

  constructor(public details: GetTokensBooksCommandDetails) {
    super();
    this.id = `${this.name}-${details.tokensIds.join('-')}`;
  }
}
