import { Command } from 'shared/messaging';

import { GetFunderAddressCommandDetails } from './get-funder-address.types';

export class GetFunderAddresCommand extends Command<GetFunderAddressCommandDetails> {
  public name = 'GetFunderAddresCommand' as const;
  public id: string;

  constructor(public details: GetFunderAddressCommandDetails) {
    super();
    this.id = this.name;
  }
}
