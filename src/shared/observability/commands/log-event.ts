import { Command, OkResult } from 'shared/messaging';

import { MonitoringEvent } from '../types';

interface Payload {
  event: MonitoringEvent;
}

type Response = undefined;

export class LogEventCommand extends Command<Payload, Response> {
  public readonly name = 'LogEventCommand' as const;

  constructor(
    public payload: Payload,
    id?: string,
  ) {
    super(id ?? null);
  }

  async handle() {
    const response = await fetch('https://www.idriss.xyz/submit-event', {
      method: 'POST',
      body: JSON.stringify(this.payload.event),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    await response.json();
    return new OkResult(undefined);
  }
}
