import {
  Command,
  FailureResult,
  HandlerError,
  OkResult,
} from 'shared/messaging';

import { ProposalData, ProposalMetadata } from '../types';
import { getProposalsResponseSchema } from '../schema';
import { AGORA_API_URL } from '../constants';

interface Payload {
  offset: number;
}

interface Response {
  metadata: ProposalMetadata;
  proposal: ProposalData | undefined;
}

const DISPLAYED_PROPOSAL_STATUS = 'ACTIVE';
const NUMBER_OF_FETCHED_PROPOSALS = 2;

export class GetAgoraProposalsCommand extends Command<Payload, Response> {
  public readonly name = 'GetAgoraProposalsCommand' as const;

  constructor(public payload: Payload) {
    super();
  }

  async handle() {
    try {
      const response = await fetch(
        `${AGORA_API_URL}?limit=${NUMBER_OF_FETCHED_PROPOSALS}&offset=${this.payload.offset}`,
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
      const [currentProposal, nextProposal] = validResponse.data;
      const result: Response = {
        proposal:
          currentProposal?.status.toUpperCase() === DISPLAYED_PROPOSAL_STATUS
            ? currentProposal
            : undefined,
        metadata: {
          has_next:
            nextProposal?.status.toUpperCase() === DISPLAYED_PROPOSAL_STATUS &&
            validResponse.meta.has_next,
        },
      };
      return new OkResult(result);
    } catch (error) {
      this.captureException(error);
      if (error instanceof HandlerError) {
        return new FailureResult(error.message);
      }

      return new FailureResult();
    }
  }
}
