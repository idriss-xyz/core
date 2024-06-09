import {
  Command,
  FailureResult,
  HandlerError,
  OkResult,
} from 'shared/messaging';

import { ProposalsResponseData } from '../types';
import { getProposalsResponseSchema } from '../schema';
import { AGORA_API_URL } from '../constants';

interface Details {
  limit: number;
  offset: number;
}

export class GetAgoraProposalsCommand extends Command<
  Details,
  ProposalsResponseData
> {
  public readonly name = 'GetAgoraProposalsCommand' as const;

  constructor(
    public details: Details,
    id?: string,
  ) {
    super(id ?? null);
  }

  async handle() {
    try {
      const response = await fetch(
        `${AGORA_API_URL}?limit=${this.details.limit}&offset=${this.details.offset}`,
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
      await this.trackHandlerException();
      if (error instanceof HandlerError) {
        return new FailureResult(error.message);
      }

      return new FailureResult();
    }
  }
}
