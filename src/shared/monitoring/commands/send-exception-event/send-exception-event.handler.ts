import { Handler, OkResult } from 'shared/messaging';

import { SendExceptionEventCommand } from './send-exception-event.command';

export class SendExceptionEventHandler implements Handler {
  async handle(command: SendExceptionEventCommand) {
    const response = await fetch('https://www.idriss.xyz/submit-error', {
      method: 'POST',
      body: JSON.stringify(command.details.event),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    await response.json();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return new OkResult({});
  }
}
