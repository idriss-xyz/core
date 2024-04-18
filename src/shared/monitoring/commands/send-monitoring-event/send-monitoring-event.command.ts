import { Command } from 'shared/messaging';

import { SendMonitoringEventCommandDetails } from './send-monitoring-event.types';

export class SendMonitoringEventCommand extends Command<
  SendMonitoringEventCommandDetails,
  undefined
> {
  public readonly name = 'SendMonitoringEventCommand' as const;
  public id: string;

  constructor(public details: SendMonitoringEventCommandDetails) {
    super();
    this.id = `${this.name}-${details.event.name}`;
  }
}
