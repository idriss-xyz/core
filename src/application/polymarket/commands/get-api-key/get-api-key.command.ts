import { Command } from 'shared/messaging';

import { GetApiKeyResponse } from '../../polymarket.types';

import { GetApiKeyCommandDetails } from './get-api-key.types';

export class GetApiKeyCommand extends Command<
  GetApiKeyCommandDetails,
  GetApiKeyResponse
> {
  public readonly name = 'GetApiKeyCommand' as const;
  public id: string;

  constructor(public details: GetApiKeyCommandDetails) {
    super();
    this.id = this.name;
  }
}
