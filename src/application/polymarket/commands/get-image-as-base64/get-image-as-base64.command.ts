import { Command } from 'shared/messaging';

import { GetImageAsBase64CommandDetails } from './get-image-as-base64.types';

// TODO: this command is too generic to live inside polymarket, move it to shared commands
export class GetImageAsBase64Command extends Command<GetImageAsBase64CommandDetails> {
  public readonly name = 'GetImageAsBase64Command' as const;
  public id: string;

  constructor(public details: GetImageAsBase64CommandDetails) {
    super();
    this.id = `${this.name}-${details.url}`;
  }
}
