import { Command, OkResult } from 'shared/messaging';

import { POLYMARKET_CLOB_API } from '../constants';

type Payload = Record<string, never>;

export class GetAvailabilityCommand extends Command<Payload, boolean> {
  public readonly name = 'GetAvailabilityCommand' as const;

  constructor(
    public payload: Payload,
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
    } catch (error) {
      await this.logException(error);
      return new OkResult(false);
    }
  }
}
