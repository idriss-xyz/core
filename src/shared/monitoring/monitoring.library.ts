import { Command } from 'shared/messaging';

import {
  SendExceptionEventCommand,
  SendMonitoringEventCommand,
} from './commands';
import { MonitoringEvent, ExceptionEvent } from './monitoring.types';

export const sendMonitoringEvent = async (event: MonitoringEvent) => {
  try {
    const command = new SendMonitoringEventCommand({ event });
    return command.send<void>();
  } catch {
    console.error(`Couldn't send monitoring event`);
  }
};

export const sendExceptionEvent = async (event: ExceptionEvent) => {
  try {
    const command = new SendExceptionEventCommand({ event });
    await command.send<void>();
  } catch {
    console.error(`Couldn't send exception event`);
  }
};

export const sendHandlerMonitoringEvent = async (event: MonitoringEvent) => {
  const command = new SendMonitoringEventCommand({ event });
  return fetch('https://www.idriss.xyz/submit-event', {
    method: 'POST',
    body: JSON.stringify(command.details.event),
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const sendHandlerExceptionEvent = async (command: Command) => {
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
