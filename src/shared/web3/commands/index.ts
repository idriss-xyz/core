import { GetAcrossChainFeeCommand } from './get-across-chain-fee';
import { GetAcrossChainFeesCommand } from './get-across-chain-fees';
import { GetTokenPriceCommand } from './get-token-price';

export const COMMAND_MAP = {
  [GetTokenPriceCommand.name]: GetTokenPriceCommand,
  [GetAcrossChainFeeCommand.name]: GetAcrossChainFeeCommand,
  [GetAcrossChainFeesCommand.name]: GetAcrossChainFeesCommand,
};

export { useGetTokenPriceCommandQuery } from './get-token-price';
export { useGetAcrossChainFeesCommandQuery } from './get-across-chain-fees';
export { useGetAcrossChainFeeCommandMutation } from './get-across-chain-fee';
