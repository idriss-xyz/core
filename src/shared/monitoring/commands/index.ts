import { SendExceptionEventCommand } from './send-exception-event';
import { SendMonitoringEventCommand } from './send-monitoring-event';

export const COMMAND_MAP = {
  [SendMonitoringEventCommand.name]: SendMonitoringEventCommand,
  [SendExceptionEventCommand.name]: SendExceptionEventCommand,
};

export { SendMonitoringEventCommand } from './send-monitoring-event';
export { SendExceptionEventCommand } from './send-exception-event';
