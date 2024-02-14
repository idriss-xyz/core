import { generateGetProposalsQuery } from '../utils';
import { SNAPSHOT_GRAPHQL_API_URL } from '../constants';
import { getProposalsResponseSchema } from '../schema';
import { resolveAddress } from '../../ts-utils';
import { Proposal } from '../types';

import { GetProposalCommand } from './get-proposal.command';

export class GetProposalHandler {
  static async handle(
    command: GetProposalCommand,
  ): Promise<Proposal | undefined> {
    const query = generateGetProposalsQuery([command.details.snapshotName], {
      first: 1,
    });

    const res = await fetch(SNAPSHOT_GRAPHQL_API_URL, {
      method: 'POST',
      body: JSON.stringify({
        query: query,
        operationName: 'Proposals',
        variables: null,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (res.status !== 200) {
      throw new Error('Something went wrong when fetching snapshot api.');
    }

    const json = await res.json();
    const validResponse = getProposalsResponseSchema.parse(json);
    const proposal = validResponse.data.proposals[0];
    if (!proposal) {
      return;
    }

    const resolvedAddress = await resolveAddress(proposal.author);

    return {
      ...proposal,
      author: {
        address: proposal.author,
        resolvedAddress,
      },
    };
  }
}
