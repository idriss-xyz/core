import { Command, OkResult } from 'shared/messaging';

type Payload = {
  url: string;
  body: string | Uint8Array;
  headers?: Record<string, string>;
  fetchOptions?: RequestInit;
};

type Response = {
  status: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  headers: {
    'x-sentry-rate-limits': string | null;
    'retry-after': string | null;
  };
};

export class SendToSentryCommand extends Command<Payload, Response> {
  public readonly name = 'SendToSentryCommand' as const;

  constructor(public payload: Payload) {
    super();
  }

  async handle() {
    const response = await fetch(this.payload.url, {
      method: 'POST',
      body: this.payload.body,
      referrerPolicy: 'origin',
      headers: this.payload.headers,
      ...this.payload.fetchOptions,
    });

    return new OkResult({
      status: response.status,
      headers: {
        'x-sentry-rate-limits': response.headers.get('x-sentry-rate-limits'),
        'retry-after': response.headers.get('retry-after'),
      },
    });
  }
}
