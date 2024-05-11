import {
  Command,
  FailureResult,
  HandlerError,
  OkResult,
} from 'shared/messaging';

interface Details {
  url: string;
}

export class GetOriginalShortenedUrlCommand extends Command<Details, string> {
  public readonly name = 'GetOriginalShortenedUrlCommand' as const;

  constructor(
    public details: Details,
    id?: string,
  ) {
    super(id ?? null);
  }

  async handle() {
    try {
      const response = await fetch(this.details.url, {
        redirect: 'manual', // TODO: is it needed?
      });
      const html = await response.text();

      const regex = /URL=(https:\/\/[^"]+)/;
      const match = html.match(regex);
      if (!match?.[1]) {
        return new OkResult('');
      }
      return new OkResult(match[1]);
    } catch (error) {
      await this.trackHandlerException();

      if (error instanceof HandlerError) {
        return new FailureResult(error.message);
      }

      return new FailureResult();
    }
  }
}
