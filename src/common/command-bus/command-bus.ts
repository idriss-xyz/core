import {
  COMMAND_REQUEST,
  COMMAND_RESPONSE,
  COMMAND_TO_HANDLERS,
} from './constants';
import { Command } from './types';

export class CommandBus {
  static invoke<Response>(command: Command): Promise<Response> {
    return new Promise((resolve) => {
      window.postMessage({
        type: COMMAND_REQUEST,
        detail: command,
      });

      const listener = (event: MessageEvent) => {
        if (
          event.data.type === COMMAND_RESPONSE &&
          event.data.detail.commandId === command.id
        ) {
          window.removeEventListener('message', listener);
          resolve(event.data.detail.response as Response);
        }
      };

      window.addEventListener('message', listener);
    });
  }

  static execute(command: Command) {
    const handler = COMMAND_TO_HANDLERS[command.name];

    if (!handler) {
      throw new Error(`Missing handler for ${command.name}`);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return handler.handle(command as any);
  }
}
