import * as amplitude from '@amplitude/analytics-browser';

import { Command, OkResult } from 'shared/messaging';

type Payload = {
  event: amplitude.Types.Event;
};

type Response = {
  code: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  event: any; // it should be amplitude.Types.Event be this is an interface which doesn't work with our JSONValue type expected by command
  message: string;
};

export class SendToAmplitudeCommand extends Command<Payload, Response> {
  public readonly name = 'SendToAmplitudeCommand' as const;

  constructor(public payload: Payload) {
    super();
  }

  async handle() {
    const response = await fetch('https://api2.amplitude.com/2/httpapi', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': '*/*',
      },
      body: JSON.stringify({
        api_key: process.env.AMPLITUDE_API_KEY,
        events: [this.payload.event],
      }),
    });

    return new OkResult({
      code: response.status,
      event: this.payload.event,
      message: response.statusText,
    });
  }
}
