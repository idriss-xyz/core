import { Command, FailureResult, OkResult } from 'shared/messaging';

interface Payload {
  url: string;
}

export class GetImageAsBase64Command extends Command<Payload, string> {
  public readonly name = 'GetImageAsBase64Command' as const;

  constructor(
    public payload: Payload,
    id?: string,
  ) {
    super(id ?? null);
  }

  async handle() {
    try {
      if (this.payload.url.startsWith('data:image')) {
        return new OkResult(this.payload.url);
      }

      const response = await fetch(
        `https://www.idriss.xyz/fetch-image?url=${this.payload.url}`,
      );
      const json = await response.json();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return new OkResult((json as any).image as string);
    } catch (error) {
      await this.logException(error);

      return new FailureResult();
    }
  }
}
