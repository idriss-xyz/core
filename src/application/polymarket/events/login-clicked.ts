import { MonitoringEvent } from 'shared/observability';

interface Data {
  conditionId: string;
  question: string;
}

export class LoginClickedEvent implements MonitoringEvent {
  name = 'login-clicked';

  constructor(public meta: Data) {}
}
