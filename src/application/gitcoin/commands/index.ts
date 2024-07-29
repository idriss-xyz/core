import { GetApplicationsCommand } from './get-applications';
import { GetGitcoinAcrossChainFeesCommand } from './get-gitcoin-across-chain-fees';

export const COMMAND_MAP = {
  [GetApplicationsCommand.name]: GetApplicationsCommand,
  [GetGitcoinAcrossChainFeesCommand.name]: GetGitcoinAcrossChainFeesCommand,
} as const;

export { GetApplicationsCommand } from './get-applications';
export { GetGitcoinAcrossChainFeesCommand } from './get-gitcoin-across-chain-fees';
