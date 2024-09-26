import {
  Command,
  FailureResult,
  HandlerError,
  OkResult,
} from 'shared/messaging';

import { generateGetTwitterIdsQuery } from '../utils';
import { twitterIdSchema } from '../schema';

interface Payload {
  username: string;
}

export class GetTwitterIdsCommand extends Command<Payload, string | null> {
  public readonly name = 'GetTwitterIdsCommand' as const;

  constructor(public payload: Payload) {
    super();
  }

  async handle() {
    try {
      const query = generateGetTwitterIdsQuery({
        username: this.payload.username,
      });

      const response = await fetch(query, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status !== 200) {
        throw new HandlerError(
          'Something went wrong when fetching extension twitter Ids.',
        );
      }

      const json = await response.json();

      const validResponse = twitterIdSchema.parse(json);
      /** the response usernames do not start with the '@' */
      const formattedUsername = this.payload.username.startsWith('@')
        ? this.payload.username.slice(1)
        : this.payload.username;
      return new OkResult(validResponse.twitterIDs[formattedUsername] ?? null);
    } catch (error) {
      this.captureException(error);
      if (error instanceof HandlerError) {
        return new FailureResult(error.message);
      }

      return new FailureResult();
    }
  }
}
