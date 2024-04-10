import { MonitoringEvent } from 'shared/monitoring';

import { OrderSuccededEventMeta } from './order-succeeded.types';

export class OrderSucceededEvent implements MonitoringEvent {
  name = 'order-succeeded';

  constructor(public meta: OrderSuccededEventMeta) {}
}
