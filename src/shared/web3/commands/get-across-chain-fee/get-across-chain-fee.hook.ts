import { useCommandMutation } from 'shared/messaging/command.hook';

import { GetAcrossChainFeeCommand } from './get-across-chain-fee.command';

export const useGetAcrossChainFeeCommandMutation = () => {
  return useCommandMutation(GetAcrossChainFeeCommand);
};
