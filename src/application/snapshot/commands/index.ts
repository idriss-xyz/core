import { GetProposalCommand } from './get-proposal.command';
import { GetProposalHandler } from './get-proposal.handler';
import { GetProposalsCommand } from './get-proposals.command';
import { GetProposalsHandler } from './get-proposals.handler';

export const SNAPSHOT_COMMAND_TO_HANDLER_MAP = {
  [GetProposalCommand.name]: new GetProposalHandler(),
  [GetProposalsCommand.name]: new GetProposalsHandler(),
};

export { GetProposalCommand } from './get-proposal.command';
export { GetProposalsCommand } from './get-proposals.command';
