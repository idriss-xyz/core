import {
  Command,
  FailureResult,
  HandlerError,
  OkResult,
} from 'shared/messaging';

import { generateGetProposalsQuery } from '../utils';
import { getProposalsResponseSchema } from '../schema';
import { ProposalsResponse } from '../types';

interface Payload {
  twitterHandle: string;
  afterCursor: string | null;
}

export class GetTallyProposalsCommand extends Command<
  Payload,
  ProposalsResponse
> {
  public readonly name = 'GetTallyProposalsCommand' as const;

  constructor(public payload: Payload) {
    super();
  }

  async handle() {
    try {
      const query = generateGetProposalsQuery({
        afterCursor: this.payload.afterCursor,
        twitterName: this.payload.twitterHandle,
      });

      const response = await fetch(query, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status !== 200) {
        throw new HandlerError('Something went wrong when fetching tally api.');
      }

      const json = await response.json();

      const validResponse = getProposalsResponseSchema.parse(json);
      const activeProposals = {
        nodes: validResponse.data.proposalsV2.nodes.filter((proposal) => {
          return proposal.status === 'active';
        }),
        pageInfo: validResponse.data.proposalsV2.pageInfo,
      };
      return new OkResult(activeProposals);
    } catch (error) {
      this.captureException(error);
      if (error instanceof HandlerError) {
        return new FailureResult(error.message);
      }

      return new FailureResult();
    }
  }
}
