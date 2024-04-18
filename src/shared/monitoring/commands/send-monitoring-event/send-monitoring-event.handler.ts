import { Handler, OkResult } from 'shared/messaging';

import { SendMonitoringEventCommand } from './send-monitoring-event.command';

export class SendMonitoringEventHandler
  implements Handler<SendMonitoringEventCommand>
{
  async handle(command: SendMonitoringEventCommand) {
    const response = await fetch('https://www.idriss.xyz/submit-event', {
      method: 'POST',
      body: JSON.stringify(command.details.event),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    await response.json();
    return new OkResult(undefined);
  }
}
