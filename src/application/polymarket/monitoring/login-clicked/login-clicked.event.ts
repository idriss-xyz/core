import { MonitoringEvent } from 'shared/monitoring';

import { LoginClickedEventMeta } from './login-clicked.types';

export class LoginClickedEvent implements MonitoringEvent {
  name = 'login-clicked';

  constructor(public meta: LoginClickedEventMeta) {}
}
