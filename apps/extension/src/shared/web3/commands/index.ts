import { GetAcrossChainFeeCommand } from './get-across-chain-fee';
import { GetAcrossChainFeesCommand } from './get-across-chain-fees';
import { GetTokenPriceCommand } from './get-token-price';

export const COMMAND_MAP = {
  [GetTokenPriceCommand.name]: GetTokenPriceCommand,
  [GetAcrossChainFeeCommand.name]: GetAcrossChainFeeCommand,
  [GetAcrossChainFeesCommand.name]: GetAcrossChainFeesCommand,
};

export { GetTokenPriceCommand } from './get-token-price';
export type {
  Payload as GetAcrossChainFeesPayload,
  Response as GetAcrossChainFeesResponse,
} from './get-across-chain-fees';
export { GetAcrossChainFeesCommand } from './get-across-chain-fees';
export { GetAcrossChainFeeCommand } from './get-across-chain-fee';
