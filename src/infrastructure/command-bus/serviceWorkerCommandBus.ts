import { onWindowMessage } from '../../lib/dom';
import {
  COMMAND_BUS_RESPONSE_MESSAGE,
  COMMAND_BUS_REQUEST_MESSAGE,
} from '../constants';

import { SERVICE_WORKER_COMMAND_HANDLERS_MAP } from './constants';
import type { ServiceWorkerCommand, ServiceWorkerResponse } from './types';

export class ServiceWorkerCommandBus {
  static invoke<ExpectedResponse>(
    command: ServiceWorkerCommand,
  ): Promise<ExpectedResponse> {
    return new Promise((resolve) => {
      window.postMessage({
        type: COMMAND_BUS_REQUEST_MESSAGE,
        detail: command,
      });
      onWindowMessage<ServiceWorkerResponse<ExpectedResponse>>(
        COMMAND_BUS_RESPONSE_MESSAGE,
        (detail, removeEventListener) => {
          if (detail.commandId !== command.id) {
            return;
          }
          resolve(detail.response);
          removeEventListener();
        },
      );
    });
  }

  static execute(command: ServiceWorkerCommand) {
    const handler = SERVICE_WORKER_COMMAND_HANDLERS_MAP[command.name];

    if (!handler) {
      throw new Error(`Missing handler for ${command.name}`);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return handler.handle(command as any);
  }
}
