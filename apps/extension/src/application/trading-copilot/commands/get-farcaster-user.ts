import {
  Command,
  FailureResult,
  HandlerError,
  HandlerResponseError,
  OkResult,
} from 'shared/messaging';

import {
  FarcasterUserRequest as Payload,
  FarcasterUserResponse as Response,
} from '../types';

export class GetFarcasterUserCommand extends Command<Payload, Response> {
  public readonly name = 'GetFarcasterUserCommand' as const;

  constructor(public payload: Payload) {
    super();
  }

  async handle() {
    try {
      const userResponse = await fetch(
        `https://client.warpcast.com/v2/user?fid=${this.payload.id}`,
        {
          method: 'GET',
        },
      );

      if (!userResponse.ok) {
        const responseText = await userResponse.text();
        throw new HandlerResponseError(
          this.name,
          responseText,
          userResponse.status,
        );
      }

      const userData = (await userResponse.json()) as Response;

      return new OkResult(userData);
    } catch (error) {
      this.captureException(error);
      if (error instanceof HandlerError) {
        return new FailureResult(error.message);
      }

      return new FailureResult();
    }
  }
}
