import { Command } from 'shared/messaging';

import { GetConditionIdCommandDetails } from './get-condition-id.types';

export class GetConditionIdCommand extends Command<
  GetConditionIdCommandDetails,
  string
> {
  public readonly name = 'GetConditionIdCommand' as const;
  public id: string;

  constructor(public details: GetConditionIdCommandDetails) {
    super();
    this.id = `${this.name}-${details.url}`;
  }
}
