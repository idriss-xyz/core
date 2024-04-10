import { Command } from 'shared/messaging';

import { GetApiKeyCommandDetails } from './get-api-key.types';

export class GetApiKeyCommand extends Command<GetApiKeyCommandDetails> {
  public readonly name = 'GetApiKeyCommand' as const;
  public id: string;

  constructor(public details: GetApiKeyCommandDetails) {
    super();
    this.id = this.name;
  }
}
