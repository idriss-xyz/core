import { GetApplicationsCommand } from './get-applications';
import { GetGitcoinAcrossChainFeesCommand } from './get-gitcoin-across-chain-fees';
import { GetNonceCommand } from './get-nonce';

export const COMMAND_MAP = {
  [GetApplicationsCommand.name]: GetApplicationsCommand,
  [GetGitcoinAcrossChainFeesCommand.name]: GetGitcoinAcrossChainFeesCommand,
  [GetNonceCommand.name]: GetNonceCommand,
} as const;

export { GetApplicationsCommand } from './get-applications';
export { GetGitcoinAcrossChainFeesCommand } from './get-gitcoin-across-chain-fees';
export {GetNonceCommand} from './get-nonce'
