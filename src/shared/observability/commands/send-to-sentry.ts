import { Command, OkResult } from 'shared/messaging';

interface Payload {
  url: string;
  body: string | Uint8Array;
  headers?: Record<string, string>;
  fetchOptions?: RequestInit;
}

interface Response {
  status: number;
  headers: Headers;
}

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
      headers: response.headers,
    });
  }
}
