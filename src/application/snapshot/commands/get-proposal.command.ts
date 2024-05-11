import {
  Command,
  FailureResult,
  HandlerError,
  OkResult,
} from 'shared/messaging';
import { resolveAddress } from 'shared/web3';

import { ProposalData } from '../types';
import { generateGetProposalsQuery } from '../utils';
import { SNAPSHOT_GRAPHQL_API_URL } from '../constants';
import { getProposalsResponseSchema } from '../schema';

interface Details {
  snapshotName: string;
}

export class GetProposalCommand extends Command<Details, ProposalData> {
  public readonly name = 'GetProposalCommand' as const;

  constructor(
    public details: Details,
    id?: string,
  ) {
    super(id ?? null);
  }

  async handle() {
    try {
      const query = generateGetProposalsQuery([this.details.snapshotName], {
        first: 1,
      });
      const response = await fetch(SNAPSHOT_GRAPHQL_API_URL, {
        method: 'POST',
        body: JSON.stringify({
          query: query,
          operationName: 'Proposals',
          variables: undefined,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status !== 200) {
        throw new HandlerError();
      }
      const json = await response.json();
      const validResponse = getProposalsResponseSchema.parse(json);
      const proposal = validResponse.data.proposals[0];
      if (!proposal) {
        throw new HandlerError('Proposal not found');
      }

      const resolvedAddress = await resolveAddress(proposal.author);
      return new OkResult({
        ...proposal,
        author: {
          address: proposal.author,
          resolvedAddress,
        },
      });
    } catch (error) {
      await this.trackHandlerException();
      if (error instanceof HandlerError) {
        return new FailureResult(error.message);
      }

      return new FailureResult();
    }
  }
}
