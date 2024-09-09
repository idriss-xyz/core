import { GetAcrossChainFeeCommand } from './get-across-chain-fee';
import { GetAcrossChainFeesCommand } from './get-across-chain-fees';
import { GetTokenPriceCommand } from './get-token-price';
import { GetWalletByEnsNameCommand } from './get-wallet-by-ens-name';

export const COMMAND_MAP = {
  [GetTokenPriceCommand.name]: GetTokenPriceCommand,
  [GetAcrossChainFeeCommand.name]: GetAcrossChainFeeCommand,
  [GetAcrossChainFeesCommand.name]: GetAcrossChainFeesCommand,
  [GetWalletByEnsNameCommand.name]: GetWalletByEnsNameCommand,
};

export { GetTokenPriceCommand } from './get-token-price';
export type {
  Payload as GetAcrossChainFeesPayload,
  Response as GetAcrossChainFeesResponse,
} from './get-across-chain-fees';
export { GetAcrossChainFeesCommand } from './get-across-chain-fees';
export { GetAcrossChainFeeCommand } from './get-across-chain-fee';
export { GetWalletByEnsNameCommand } from './get-wallet-by-ens-name';
