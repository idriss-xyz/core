import {
  GetProposalCommand,
  GetProposalHandler,
  GetProposalsCommand,
  GetProposalsHandler,
} from '../snapshot/commands';

export const COMMAND_REQUEST = 'COMMAND_REQUEST';
export const COMMAND_RESPONSE = 'COMMAND_RESPONSE';

export const COMMAND_TO_HANDLERS = {
  [GetProposalCommand.name]: GetProposalHandler,
  [GetProposalsCommand.name]: GetProposalsHandler,
};
