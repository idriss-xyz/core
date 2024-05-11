import { Command, OkResult } from 'shared/messaging';

import { POLYMARKET_CLOB_API } from '../constants';

type Details = Record<string, never>;

export class GetAvailabilityCommand extends Command<Details, boolean> {
  public readonly name = 'GetAvailabilityCommand' as const;

  constructor(
    public details: Details,
    id?: string,
  ) {
    super(id ?? null);
  }

  async handle() {
    try {
      // order throws 403 if user is sending this request from banned region
      const response = await fetch(`${POLYMARKET_CLOB_API}/order`, {
        method: 'POST',
      });

      if (response.status === 403) {
        return new OkResult(false);
      }
      return new OkResult(true);
    } catch {
      await this.trackHandlerException();
      return new OkResult(false);
    }
  }
}
