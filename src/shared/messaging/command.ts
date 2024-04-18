import {
  COMMAND_BUS_REQUEST_MESSAGE,
  COMMAND_BUS_RESPONSE_MESSAGE,
} from './constants';
import { onWindowMessage } from './on-window-message';
import { Result } from './result';

export interface CommandResponse<ExpectedResponse> {
  response: ExpectedResponse;
  commandId: string;
}

export abstract class Command<Parameters, ExpectedResponse> {
  public abstract readonly name: string;
  public abstract readonly id: string;
  public abstract readonly details: Parameters;

  public send(): Promise<ExpectedResponse> {
    return new Promise((resolve, reject) => {
      window.postMessage({
        type: COMMAND_BUS_REQUEST_MESSAGE,
        detail: this,
      });

      onWindowMessage<CommandResponse<Result<ExpectedResponse>>>(
        COMMAND_BUS_RESPONSE_MESSAGE,
        (detail, removeEventListener) => {
          if (detail.commandId !== this.id) {
            return;
          }
          // TODO: serialize and de-serialize Result obj
          if ('reason' in detail.response) {
            reject(detail.response.reason);
          } else {
            resolve(detail.response.data);
          }
          removeEventListener();
        },
      );
    });
  }
}
