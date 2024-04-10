import { MonitoringEvent } from 'shared/monitoring';

import { BuyClickedEventMeta } from './buy-clicked.types';

export class BuyClickedEvent implements MonitoringEvent {
  name = 'buy-clicked';

  constructor(public meta: BuyClickedEventMeta) {}
}
