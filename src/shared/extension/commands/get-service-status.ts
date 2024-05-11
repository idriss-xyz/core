import { Command, OkResult, useCommandQuery } from 'shared/messaging';

export class GetServiceStatusCommand extends Command<
  Record<string, never>,
  Record<string, boolean>
> {
  public readonly name = 'GetServiceStatusCommand' as const;

  constructor(
    public details: Record<string, never>,
    id?: string,
  ) {
    super(id ?? null);
  }

  async handle() {
    const response = await fetch('https://www.idriss.xyz/service-status');
    const json = await response.json();
    return new OkResult(json as Record<string, boolean>);
  }
}

export const useGetServiceStatus = () => {
  return useCommandQuery({
    staleTime: 0,
    command: new GetServiceStatusCommand({}),
  });
};
