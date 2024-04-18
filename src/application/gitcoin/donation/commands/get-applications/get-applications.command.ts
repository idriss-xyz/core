import { Command } from 'shared/messaging';

import { GetApplicationsResponse } from '../../donation.types';

export class GetApplicationsCommand extends Command<
  Record<string, never>,
  GetApplicationsResponse
> {
  public readonly name = 'GetApplicationsCommand' as const;
  public readonly id: string;

  constructor(public details: Record<string, never>) {
    super();
    this.id = this.name;
  }
}
