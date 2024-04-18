import { Handler, OkResult } from 'shared/messaging';

import { GetServiceStatusCommand } from './get-service-status.command';

export class GetServiceStatusHandler
  implements Handler<GetServiceStatusCommand>
{
  async handle(_command: GetServiceStatusCommand) {
    const response = await fetch('https://www.idriss.xyz/service-status');
    const json = await response.json();
    return new OkResult(json as Record<string, boolean>);
  }
}
