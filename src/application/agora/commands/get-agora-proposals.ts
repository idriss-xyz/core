import {
  Command,
  FailureResult,
  HandlerError,
  OkResult,
} from 'shared/messaging';

import { ProposalsResponseData } from '../types';
import { getProposalsResponseSchema } from '../schema';
import { AGORA_API_URL } from '../constants';

interface Payload {
  limit: number;
  offset: number;
}

export class GetAgoraProposalsCommand extends Command<
  Payload,
  ProposalsResponseData
> {
  public readonly name = 'GetAgoraProposalsCommand' as const;

  constructor(
    public payload: Payload,
    id?: string,
  ) {
    super(id ?? null);
  }

  async handle() {
    try {
      const response = await fetch(
        `${AGORA_API_URL}?limit=${this.payload.limit}&offset=${this.payload.offset}`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      if (response.status !== 200) {
        throw new HandlerError('Something went wrong when fetching agora api.');
      }

      const json = await response.json();

      const validResponse = getProposalsResponseSchema.parse(json);
      return new OkResult(validResponse.data);
    } catch (error) {
      await this.logException();
      if (error instanceof HandlerError) {
        return new FailureResult(error.message);
      }

      return new FailureResult();
    }
  }
}
