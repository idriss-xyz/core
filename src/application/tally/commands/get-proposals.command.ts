import {
  Command,
  FailureResult,
  HandlerError,
  HandlerResponseError,
  OkResult,
} from 'shared/messaging';

import { generateGetProposalsQuery } from '../utils';
import { getProposalsResponseSchema } from '../schema';
import { ProposalsResponse } from '../types';

type Payload = {
  username: string;
  afterCursor: string | null;
};

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
        username: this.payload.username,
      });

      const response = await fetch(query, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const responseText = await response.text();
        throw new HandlerResponseError(
          this.name,
          responseText,
          response.status,
        );
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
