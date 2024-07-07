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

interface Payload {
  snapshotNames: string[];
  pageNumber: number;
}

interface Response {
  proposal: ProposalData | null;
  hasNextProposal: boolean;
}

export class GetProposalCommand extends Command<Payload, Response> {
  public readonly name = 'GetProposalCommand' as const;

  constructor(
    public payload: Payload,
    id?: string,
  ) {
    super(id ?? null);
  }

  async handle() {
    try {
      const query = generateGetProposalsQuery();
      const response = await fetch(SNAPSHOT_GRAPHQL_API_URL, {
        method: 'POST',
        body: JSON.stringify({
          query: query,
          operationName: 'Proposals',
          variables: {
            first: 2,
            snapshotNames: this.payload.snapshotNames,
            skip: this.payload.pageNumber,
          },
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status !== 200) {
        throw new HandlerError();
      }
      const json = await response.json();
      const validationResult = getProposalsResponseSchema.safeParse(json);
      if (!validationResult.success) {
        throw new HandlerError('Schema validation failed');
      }
      const [currentProposal, nextProposal] =
        validationResult.data.data.proposals;
      const hasNextProposal = Boolean(nextProposal);
      if (!currentProposal) {
        return new OkResult({
          proposal: null,
          hasNextProposal: false,
        });
      }

      const resolvedAddress = await resolveAddress(currentProposal.author);
      return new OkResult({
        proposal: {
          ...currentProposal,
          author: { address: currentProposal.author, resolvedAddress },
        },
        hasNextProposal,
      });
    } catch (error) {
      await this.logException();
      if (error instanceof HandlerError) {
        return new FailureResult(error.message);
      }

      return new FailureResult();
    }
  }
}
