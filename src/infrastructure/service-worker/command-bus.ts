import { Command, Handler } from 'shared/messaging';

import { SERVICE_WORKER_COMMAND_HANDLERS_MAP } from './constants';

export const CommandBus = {
  // executed inside service worker layer
  handle(command: Command) {
    const handler: Handler | undefined =
      SERVICE_WORKER_COMMAND_HANDLERS_MAP[command.name];

    if (!handler) {
      throw new Error(`Missing handler for ${command.name}`);
    }

    return handler.handle(command);
  },
};
