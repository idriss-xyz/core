import {
  GetProposalCommand,
  GetProposalsCommand,
} from '../../snapshot/commands';

export type ServiceWorkerCommand = GetProposalCommand | GetProposalsCommand;

export type ServiceWorkerResponse<ExpectedResponse> = {
  response: ExpectedResponse;
  commandId: string;
};
