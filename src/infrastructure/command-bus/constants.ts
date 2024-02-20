import {
  GetProposalCommand,
  GetProposalHandler,
  GetProposalsCommand,
  GetProposalsHandler,
} from '../../snapshot/commands';

export const SERVICE_WORKER_COMMAND_REQUEST = 'SERVICE_WORKER_COMMAND_REQUEST';
export const SERVICE_WORKER_COMMAND_RESPONSE =
  'SERVICE_WORKER_COMMAND_RESPONSE';
export const SERVICE_WORKER_COMMAND_HANDLERS_MAP = {
  [GetProposalCommand.name]: GetProposalHandler,
  [GetProposalsCommand.name]: GetProposalsHandler,
};
