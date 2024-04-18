import { resolveAddress } from 'shared/web3';
import {
  FailureResult,
  Handler,
  HandlerError,
  OkResult,
} from 'shared/messaging';
import { sendHandlerExceptionEvent } from 'shared/monitoring';

import { generateGetProposalsQuery } from '../utils';
import { SNAPSHOT_GRAPHQL_API_URL } from '../constants';
import { getProposalsResponseSchema } from '../schema';

import { GetProposalsCommand } from './get-proposals.command';

export class GetProposalsHandler implements Handler<GetProposalsCommand> {
  async handle(command: GetProposalsCommand) {
    try {
      const query = generateGetProposalsQuery(command.details.snapshotNames, {
        first: 30,
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
        throw new HandlerError(
          'Something went wrong when fetching snapshot api.',
        );
      }

      const json = await response.json();
      const validResponse = getProposalsResponseSchema.parse(json);
      const proposals = validResponse.data.proposals;

      const uniqueAuthors = [
        ...new Set(
          proposals.map((proposal) => {
            return proposal.author;
          }),
        ),
      ];

      const resolvedAddressessMap: Record<string, string> = Object.fromEntries(
        await Promise.all(
          uniqueAuthors.map(async (authorAddress) => {
            const resolvedAddress = await resolveAddress(authorAddress);
            return [authorAddress, resolvedAddress];
          }),
        ),
      );

      const mappedProposals = proposals.map((proposal) => {
        return {
          ...proposal,
          author: {
            address: proposal.author,
            resolvedAddress: resolvedAddressessMap[proposal.author],
          },
        };
      });

      return new OkResult(mappedProposals);
    } catch (error) {
      await sendHandlerExceptionEvent(command);
      if (error instanceof HandlerError) {
        return new FailureResult(error.message);
      }

      return new FailureResult();
    }
  }
}
