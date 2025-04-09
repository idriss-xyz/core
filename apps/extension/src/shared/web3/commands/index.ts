import { GetAcrossChainFeeCommand } from './get-across-chain-fee';
import { GetAcrossChainFeesCommand } from './get-across-chain-fees';
import { GetTokenPriceCommand } from './get-token-price';
import { GetEnsBalanceCommand } from './get-ens-balance';
import { GetTokenBalanceCommand } from './get-token-balance';

export const COMMAND_MAP = {
  [GetTokenPriceCommand.name]: GetTokenPriceCommand,
  [GetAcrossChainFeeCommand.name]: GetAcrossChainFeeCommand,
  [GetAcrossChainFeesCommand.name]: GetAcrossChainFeesCommand,
  [GetEnsBalanceCommand.name]: GetEnsBalanceCommand,
  [GetTokenBalanceCommand.name]: GetTokenBalanceCommand,
};

export { GetTokenPriceCommand } from './get-token-price';
export { GetEnsBalanceCommand } from './get-ens-balance';
export { GetTokenBalanceCommand } from './get-token-balance';
export type {
  Payload as GetAcrossChainFeesPayload,
  Response as GetAcrossChainFeesResponse,
} from './get-across-chain-fees';
export { GetAcrossChainFeesCommand } from './get-across-chain-fees';
export { GetAcrossChainFeeCommand } from './get-across-chain-fee';
