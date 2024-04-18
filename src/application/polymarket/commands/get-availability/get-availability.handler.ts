import { Handler, OkResult } from 'shared/messaging';
import { sendHandlerMonitoringEvent } from 'shared/monitoring';

import { POLYMARKET_CLOB_API } from '../../polymarket.constants';

import { GetAvailabilityCommand } from './get-availability.command';

export class GetAvailabilityHandler implements Handler<GetAvailabilityCommand> {
  async handle(_command: GetAvailabilityCommand) {
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
      await sendHandlerMonitoringEvent({ name: 'polymarket-unavailable' });
      return new OkResult(false);
    }
  }
}
