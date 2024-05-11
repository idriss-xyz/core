import { GetProposalCommand } from './get-proposal.command';
import { GetProposalsCommand } from './get-proposals.command';

export const COMMAND_MAP = {
  [GetProposalCommand.name]: GetProposalCommand,
  [GetProposalsCommand.name]: GetProposalsCommand,
};

export { GetProposalCommand } from './get-proposal.command';
export { GetProposalsCommand } from './get-proposals.command';
