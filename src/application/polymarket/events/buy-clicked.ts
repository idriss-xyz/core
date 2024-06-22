import { MonitoringEvent } from 'shared/observability';

interface Data {
  conditionId: string;
  amount: number;
  tokenId: string;
}

export class BuyClickedEvent implements MonitoringEvent {
  name = 'buy-clicked';

  constructor(public meta: Data) {}
}
