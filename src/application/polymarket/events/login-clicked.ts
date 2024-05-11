import { MonitoringEvent } from 'shared/monitoring';

interface Data {
  conditionId: string;
  question: string;
}

export class LoginClickedEvent implements MonitoringEvent {
  name = 'login-clicked';

  constructor(public meta: Data) {}
}
