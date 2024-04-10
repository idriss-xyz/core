import {
  SendExceptionEventCommand,
  SendExceptionEventHandler,
} from './send-exception-event';
import {
  SendMonitoringEventCommand,
  SendMonitoringEventHandler,
} from './send-monitoring-event';

export const MONITORING_COMMAND_TO_HANDLER_MAP = {
  [SendMonitoringEventCommand.name]: new SendMonitoringEventHandler(),
  [SendExceptionEventCommand.name]: new SendExceptionEventHandler(),
};

export { SendMonitoringEventCommand } from './send-monitoring-event';
export { SendExceptionEventCommand } from './send-exception-event';
