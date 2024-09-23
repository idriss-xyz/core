import { v4 as uuidv4 } from 'uuid';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';
import { Scope } from '@sentry/browser';

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
type JsonValue =
  | JsonPrimitive
  | JsonValue[]
  | {
      [key: string]: JsonValue;
    };

export abstract class Command<Payload, ExpectedResponse extends JsonValue> {
  public abstract readonly name: string;
  public abstract readonly payload: Payload;
  public id: string;
  public observabilityScope?: Scope;

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
            this.captureWarning('missing response field in event detail', {
              commandName: this.name,
              detail: detail,
            });
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

  protected captureException(exception: unknown) {
    this.observabilityScope?.captureException(exception);
  }

  protected captureWarning(warning: string, data?: Record<string, unknown>) {
    this.observabilityScope?.captureMessage(warning, 'warning', { data });
  }
}

type CommandConstructor<Payload, Response extends JsonValue> = new (
  payload: Payload,
) => Command<Payload, Response>;

export const useCommandMutation = <Payload, Response extends JsonValue>(
  commandConstructor: CommandConstructor<Payload, Response>,
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
  });
};

interface CommandQueryProperties<
  Payload,
  Response extends JsonValue,
  MappedResponse = Response,
> {
  command: Command<Payload, Response>;
  retry?: number;
  retryDelay?: number;
  refetchInterval?: number;
  select?: (response: Response) => MappedResponse;
  enabled?: boolean;
  staleTime?: number;
  placeholderData?: (previousData?: Response) => Response | undefined;
}

export const useCommandQuery = <
  Parameters,
  ExpectedResponse extends JsonValue,
  MappedResponse = ExpectedResponse,
>({
  command,
  select,
  retry,
  retryDelay = 1000,
  staleTime,
  refetchInterval,
  placeholderData,
  enabled = true,
}: CommandQueryProperties<Parameters, ExpectedResponse, MappedResponse>) => {
  const queryFunction = useCallback(() => {
    return command.send();
  }, [command]);

  const queryOptions = useMemo(() => {
    return {
      queryKey: [command.name, JSON.stringify(command.payload)],
      refetchInterval,
      retry,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      placeholderData: placeholderData as any,
      retryDelay: retryDelay,
      staleTime,
      enabled,
      select,
      queryFn: queryFunction,
    };
  }, [
    command.name,
    command.payload,
    refetchInterval,
    retry,
    placeholderData,
    retryDelay,
    staleTime,
    enabled,
    select,
    queryFunction,
  ]);

  return useQuery(queryOptions);
};
