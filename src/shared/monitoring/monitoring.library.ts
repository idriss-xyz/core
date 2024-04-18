import { Command } from 'shared/messaging';

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

export const sendHandlerMonitoringEvent = async (event: MonitoringEvent) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  if (!ENABLE_EVENTS) {
    return;
  }
  const command = new SendMonitoringEventCommand({ event });
  return fetch('https://www.idriss.xyz/submit-event', {
    method: 'POST',
    body: JSON.stringify(command.details.event),
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const sendHandlerExceptionEvent = async (
  command: Command<unknown, unknown>,
) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  if (!ENABLE_EVENTS) {
    return;
  }

  const exceptionCommand = new SendExceptionEventCommand({
    event: { name: 'handler-exception', meta: command },
  });

  return fetch('https://www.idriss.xyz/submit-error', {
    method: 'POST',
    body: JSON.stringify(exceptionCommand.details.event),
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
