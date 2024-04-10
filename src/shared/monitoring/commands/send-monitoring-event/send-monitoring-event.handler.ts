import { Handler, OkResult } from 'shared/messaging';

import { SendMonitoringEventCommand } from './send-monitoring-event.command';

export class SendMonitoringEventHandler implements Handler {
  async handle(command: SendMonitoringEventCommand) {
    const response = await fetch('https://www.idriss.xyz/submit-event', {
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
