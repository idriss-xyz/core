import {
  Command,
  FailureResult,
  HandlerError,
  OkResult,
} from 'shared/messaging';

interface Payload {
  handles: string[];
}

type Response = Record<string, string | null>;

export class GetHandleToTwitterIdCommand extends Command<Payload, Response> {
  public readonly name = 'GetHandleToTwitterIdCommand' as const;

  constructor(
    public payload: Payload,
    id?: string,
  ) {
    super(id ?? null);
  }

  async handle() {
    try {
      const response = await fetch(
        getRegisteredTwittersUrl(this.payload.handles),
      );

      if (response.status !== 200) {
        throw new HandlerError();
      }
      const json = await response.json();

      // TODO: schema validation
      return new OkResult(json as Response);
    } catch (error) {
      await this.logException();
      if (error instanceof HandlerError) {
        return new FailureResult(error.message);
      }

      return new FailureResult();
    }
  }
}

const GET_REGISTERED_TWITTERS_URL =
  'https://www.idriss.xyz/v2/getTwitterIDPlugin';

const getRegisteredTwittersUrl = (handles: string[]) => {
  return `${GET_REGISTERED_TWITTERS_URL}?usernames=${encodeURIComponent(handles.join(','))}`;
};
