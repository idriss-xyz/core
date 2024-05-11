import {
  SendExceptionEventCommand,
  SendMonitoringEventCommand,
} from './commands';
import { MonitoringEvent, ExceptionEvent } from './monitoring.types';

export const sendMonitoringEvent = (event: MonitoringEvent) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  if (!ENABLE_EVENTS) {
    return;
  }

  const command = new SendMonitoringEventCommand({ event });
  return command.send();
};

export const sendExceptionEvent = (event: ExceptionEvent) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  if (!ENABLE_EVENTS) {
    return;
  }

  const command = new SendExceptionEventCommand({ event });
  return command.send();
};
