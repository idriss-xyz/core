import { MonitoringEvent } from 'shared/monitoring';

interface Data {
  conditionId: string;
  amount: number;
  tokenId: string;
}

export class BuyClickedEvent implements MonitoringEvent {
  name = 'buy-clicked';

  constructor(public meta: Data) {}
}
