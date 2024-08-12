import {
  Command,
  FailureResult,
  HandlerError,
  OkResult,
} from 'shared/messaging';

interface Payload {
  url: string;
}

type Response = string;

export class GetOriginalShortenedUrlCommand extends Command<Payload, Response> {
  public readonly name = 'GetOriginalShortenedUrlCommand' as const;

  constructor(public payload: Payload) {
    super();
  }

  async handle() {
    try {
      const response = await fetch(this.payload.url, {
        redirect: 'manual', // TODO: is it needed?
      });
      const html = await response.text();

      const regex = /URL=(https:\/\/[^"]+)/;
      const match = regex.exec(html);
      if (!match?.[1]) {
        return new OkResult('');
      }
      return new OkResult(match[1]);
    } catch (error) {
      this.captureException(error);

      if (error instanceof HandlerError) {
        return new FailureResult(error.message);
      }

      return new FailureResult();
    }
  }
}
