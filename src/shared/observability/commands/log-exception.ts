import { Command, OkResult } from 'shared/messaging';

import { ExceptionEvent } from '../types';

interface Payload {
  event: ExceptionEvent;
}

type Response = undefined;

export class LogExceptionCommand extends Command<Payload, Response> {
  public readonly name = 'LogExceptionCommand' as const;

  constructor(
    public payload: Payload,
    id?: string,
  ) {
    super(id ?? null);
  }

  async handle() {
    const response = await fetch('https://www.idriss.xyz/submit-error', {
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
