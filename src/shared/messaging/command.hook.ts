import { useMutation, useQuery } from '@tanstack/react-query';

import { Command } from './command';

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
  queryKey: string[];
  command: Command<Parameters, ExpectedResponse>;
  retry?: number;
  refetchInterval?: number;
  select?: (response: ExpectedResponse) => MappedResponse;
  enabled?: boolean;
  staleTime?: number;
}

export const useCommandQuery = <
  Parameters,
  ExpectedResponse,
  MappedResponse = ExpectedResponse,
>({
  queryKey,
  command,
  select,
  retry,
  staleTime,
  refetchInterval,
  enabled = true,
}: CommandQueryProperties<Parameters, ExpectedResponse, MappedResponse>) => {
  return useQuery({
    queryKey: queryKey,
    refetchInterval,
    retry,
    retryDelay: 1000,
    staleTime,
    enabled,
    select,
    queryFn: () => {
      return command.send();
    },
  });
};
