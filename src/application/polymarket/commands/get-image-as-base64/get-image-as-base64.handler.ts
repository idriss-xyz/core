import { FailureResult, Handler, OkResult } from 'shared/messaging';
import { sendHandlerExceptionEvent } from 'shared/monitoring';

import { GetImageAsBase64Command } from './get-image-as-base64.command';

const base = 'https://www.idriss.xyz/fetch-image?url=';
export class GetImageAsBase64Handler
  implements Handler<GetImageAsBase64Command>
{
  async handle(command: GetImageAsBase64Command) {
    try {
      const response = await fetch(`${base}${command.details.url}`);
      const json = await response.json();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return new OkResult((json as any).image as string);
    } catch {
      await sendHandlerExceptionEvent(command);

      return new FailureResult();
    }
  }
}
