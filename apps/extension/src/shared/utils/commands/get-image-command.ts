import {
  Command,
  FailureResult,
  HandlerError,
  OkResult,
} from 'shared/messaging';

type Payload = {
  src: string;
};

export class GetImageCommand extends Command<Payload, string | null> {
  public readonly name = 'GetImageCommand' as const;

  constructor(public payload: Payload) {
    super();
  }

  blobToDataUri(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        resolve(reader.result as string);
      });
      reader.addEventListener('error', reject);
      reader.readAsDataURL(blob);
    });
  }

  async handle() {
    try {
      const response = await fetch(this.payload.src);
      if (!response.ok) {
        throw new HandlerError(
          `Unable to fetch image, response: ${JSON.stringify(response)} `,
        );
      }
      const blob = await response.blob();
      const dataUri = await this.blobToDataUri(blob);

      return new OkResult(dataUri);
    } catch (error) {
      this.captureException(error);
      if (error instanceof HandlerError) {
        return new FailureResult(error.message);
      }

      return new FailureResult();
    }
  }
}
