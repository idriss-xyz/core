import { v4 as uuidv4 } from 'uuid';
import { useMutation } from '@tanstack/react-query';
import { useCallback } from 'react';

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

export interface SerializedCommand<Payload> {
  id: string;
  name: string;
  payload: Payload;
}

// https://hackernoon.com/mastering-type-safe-json-serialization-in-typescript
type JsonPrimitive = string | number | boolean | null | undefined;
export type JsonValue =
  | JsonPrimitive
  | JsonValue[]
  | {
      [key: string]: JsonValue;
    };

export abstract class Command<Payload, ExpectedResponse extends JsonValue> {
  public abstract readonly name: string;
  public abstract readonly payload: Payload;
  public id: string;

  constructor() {
    this.id = uuidv4();
  }

  public abstract handle(): Promise<Result<ExpectedResponse>>;

  public send(): Promise<ExpectedResponse> {
    return new Promise((resolve, reject) => {
      window.postMessage({
        type: COMMAND_BUS_REQUEST_MESSAGE,
        detail: this.serialize(),
      });

      onWindowMessage<CommandResponse<Result<ExpectedResponse>>>(
        COMMAND_BUS_RESPONSE_MESSAGE,
        (detail, removeEventListener) => {
          if (detail.commandId !== this.id) {
            return;
          }
          if (!detail?.response) {
            reject(new Error('Unexpected error'));
          }
          // TODO: serialize and de-serialize Result obj
          if ('reason' in detail.response) {
            // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
            reject(detail.response.reason);
          } else {
            resolve(detail.response.data);
          }
          removeEventListener();
        },
      );
    });
  }

  public serialize(): SerializedCommand<Payload> {
    return { name: this.name, payload: this.payload, id: this.id };
  }
}

type CommandConstructor<Payload, Response extends JsonValue> = new (
  payload: Payload,
) => Command<Payload, Response>;

export const useCommandMutation = <Payload, Response extends JsonValue>(
  commandConstructor: CommandConstructor<Payload, Response>,
  options?: { onMutate: (payload: Payload) => void },
) => {
  const mutationFunction = useCallback(
    (payload: Payload) => {
      const command = new commandConstructor(payload);
      return command.send();
    },
    [commandConstructor],
  );

  return useMutation({
    mutationFn: mutationFunction,
    onMutate: options?.onMutate,
  });
};
