import { Command, FailureResult, OkResult } from 'shared/messaging';

export interface GetImageAsBase64CommandDetails {
  url: string;
}

export class GetImageAsBase64Command extends Command<
  GetImageAsBase64CommandDetails,
  string
> {
  public readonly name = 'GetImageAsBase64Command' as const;

  constructor(
    public details: GetImageAsBase64CommandDetails,
    id?: string,
  ) {
    super(id ?? null);
  }

  async handle() {
    try {
      if (this.details.url.startsWith('data:image')) {
        return new OkResult(this.details.url);
      }

      const response = await fetch(
        `https://www.idriss.xyz/fetch-image?url=${this.details.url}`,
      );
      const json = await response.json();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return new OkResult((json as any).image as string);
    } catch {
      await this.trackHandlerException();

      return new FailureResult();
    }
  }
}
