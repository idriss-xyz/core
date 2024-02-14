import { generateGetProposalsQuery } from '../utils';
import { SNAPSHOT_GRAPHQL_API_URL } from '../constants';
import { getProposalsResponseSchema } from '../schema';
import { resolveAddress } from '../../ts-utils';
import { Proposal } from '../types';

import { GetProposalsCommand } from './get-proposals.command';

export class GetProposalsHandler {
  static async handle(command: GetProposalsCommand): Promise<Proposal[]> {
    const query = generateGetProposalsQuery(command.details.snapshotNames, {
      first: 30,
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
    const proposals = validResponse.data.proposals;

    const uniqueAuthors = [
      ...new Set(proposals.map((proposal) => proposal.author)),
    ];

    const resolvedAddressessMap: Record<string, string> = Object.fromEntries(
      await Promise.all(
        uniqueAuthors.map(async (authorAddress) => {
          const resolvedAddress = await resolveAddress(authorAddress);
          return [authorAddress, resolvedAddress];
        }),
      ),
    );

    const mappedProposals = proposals.map((proposal) => ({
      ...proposal,
      author: {
        address: proposal.author,
        resolvedAddress: resolvedAddressessMap[proposal.author],
      },
    }));

    return mappedProposals;
  }
}
