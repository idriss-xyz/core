import { v4 as uuidv4 } from 'uuid';
import { useMutation, useQuery } from '@tanstack/react-query';

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

export interface SerializedCommand<Parameters> {
  id: string;
  name: string;
  details: Parameters;
}

export abstract class Command<Parameters, ExpectedResponse> {
  public abstract readonly name: string;
  public abstract readonly details: Parameters;
  public readonly id: string;

  constructor(id: string | null) {
    this.id = id ?? uuidv4();
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

  public serialize(): SerializedCommand<Parameters> {
    return { name: this.name, details: this.details, id: this.id };
  }

  protected trackHandlerException() {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (!ENABLE_EVENTS) {
      return;
    }

    const payload = {
      name: 'handler-exception',
      meta: {
        command: this.serialize(),
      },
    };

    return fetch('https://www.idriss.xyz/submit-error', {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}

type CommandConstructor<Parameters, ExpectedResponse> = new (
  parameters: Parameters,
) => Command<Parameters, ExpectedResponse>;

export const useCommandMutation = <Parameters, ExpectedResponse>(
  commandConstructor: CommandConstructor<Parameters, ExpectedResponse>,
) => {
  return useMutation({
    mutationFn: (parameters: Parameters) => {
      const command = new commandConstructor(parameters);
      return command.send();
    },
  });
};

interface CommandQueryProperties<
  Parameters,
  ExpectedResponse,
  MappedResponse = ExpectedResponse,
> {
  command: Command<Parameters, ExpectedResponse>;
  retry?: number;
  refetchInterval?: number;
  select?: (response: ExpectedResponse) => MappedResponse;
  enabled?: boolean;
  staleTime?: number;
  placeholderData?: (
    previousData?: ExpectedResponse,
  ) => ExpectedResponse | undefined;
}

export const useCommandQuery = <
  Parameters,
  ExpectedResponse,
  MappedResponse = ExpectedResponse,
>({
  command,
  select,
  retry,
  staleTime,
  refetchInterval,
  placeholderData,
  enabled = true,
}: CommandQueryProperties<Parameters, ExpectedResponse, MappedResponse>) => {
  return useQuery({
    queryKey: [command.name, JSON.stringify(command.details)],
    refetchInterval,
    retry,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    placeholderData: placeholderData as any,
    retryDelay: 1000,
    staleTime,
    enabled,
    select,
    queryFn: () => {
      return command.send();
    },
  });
};
