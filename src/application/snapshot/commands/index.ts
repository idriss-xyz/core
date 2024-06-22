import { GetProposalCommand } from './get-proposal';
import { GetProposalsCommand } from './get-proposals';

export const COMMAND_MAP = {
  [GetProposalCommand.name]: GetProposalCommand,
  [GetProposalsCommand.name]: GetProposalsCommand,
};

export { GetProposalCommand } from './get-proposal';
export { GetProposalsCommand } from './get-proposals';
