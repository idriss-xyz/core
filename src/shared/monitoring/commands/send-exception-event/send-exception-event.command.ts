import { Command } from 'shared/messaging';

import { SendExceptionEventCommandDetails } from './send-exception-event.types';

export class SendExceptionEventCommand extends Command<
  SendExceptionEventCommandDetails,
  undefined
> {
  public readonly name = 'SendExceptionEventCommand' as const;
  public id: string;

  constructor(public details: SendExceptionEventCommandDetails) {
    super();
    this.id = `${this.name}-${details.event.name}`;
  }
}
