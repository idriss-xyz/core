import {
  GetAcrossChainFeeCommand,
  GetAcrossChainFeeHandler,
} from './get-across-chain-fee';
import {
  GetAcrossChainFeesCommand,
  GetAcrossChainFeesHandler,
} from './get-across-chain-fees';
import { GetTokenPriceCommand, GetTokenPriceHandler } from './get-token-price';

export const HANDLER_MAP = {
  [GetTokenPriceCommand.name]: new GetTokenPriceHandler(),
  [GetAcrossChainFeesCommand.name]: new GetAcrossChainFeesHandler(),
  [GetAcrossChainFeeCommand.name]: new GetAcrossChainFeeHandler(),
};

export { useGetTokenPriceCommandQuery } from './get-token-price';
export { useGetAcrossChainFeesCommandQuery } from './get-across-chain-fees';
export { useGetAcrossChainFeeCommandMutation } from './get-across-chain-fee';
