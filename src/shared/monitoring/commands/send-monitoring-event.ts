import { Command, OkResult } from 'shared/messaging';

import { MonitoringEvent } from '../monitoring.types';

interface SendMonitoringEventCommandDetails {
  event: MonitoringEvent;
}

export class SendMonitoringEventCommand extends Command<
  SendMonitoringEventCommandDetails,
  undefined
> {
  public readonly name = 'SendMonitoringEventCommand' as const;

  constructor(
    public details: SendMonitoringEventCommandDetails,
    id?: string,
  ) {
    super(id ?? null);
  }

  async handle() {
    const response = await fetch('https://www.idriss.xyz/submit-event', {
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
