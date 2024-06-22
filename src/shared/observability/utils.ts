import { LogExceptionCommand, LogEventCommand } from './commands';
import { MonitoringEvent, ExceptionEvent } from './types';

export const logEvent = (event: MonitoringEvent) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  if (!ENABLE_EVENTS) {
    return;
  }

  const command = new LogEventCommand({ event });
  return command.send();
};

export const logException = (event: ExceptionEvent) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  if (!ENABLE_EVENTS) {
    return;
  }

  const command = new LogExceptionCommand({ event });
  return command.send();
};
