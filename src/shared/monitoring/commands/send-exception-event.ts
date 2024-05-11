import { Command, OkResult } from 'shared/messaging';

import { ExceptionEvent } from '../monitoring.types';

interface SendExceptionEventCommandDetails {
  event: ExceptionEvent;
}

export class SendExceptionEventCommand extends Command<
  SendExceptionEventCommandDetails,
  undefined
> {
  public readonly name = 'SendExceptionEventCommand' as const;

  constructor(
    public details: SendExceptionEventCommandDetails,
    id?: string,
  ) {
    super(id ?? null);
  }

  async handle() {
    const response = await fetch('https://www.idriss.xyz/submit-error', {
      method: 'POST',
      body: JSON.stringify(this.details.event),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    await response.json();
    return new OkResult(undefined);
  }
}
