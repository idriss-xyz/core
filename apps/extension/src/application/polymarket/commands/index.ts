import { GetApiKeyCommand } from './get-api-key';
import { GetAvailabilityCommand } from './get-availability';
import { GetConditionIdCommand } from './get-condition-id';
import { GetMarketByConditionIdCommand } from './get-market-by-condition-id';
import { GetFunderAddresCommand } from './get-funder-address';
import { GetTokenChanceCommand } from './get-token-chance';
import { GetTokensBooksCommand } from './get-tokens-books';
import { GetTokensPricesCommand } from './get-tokens-prices';
import { PostOrderCommand } from './post-order';

export const COMMAND_MAP = {
  [GetApiKeyCommand.name]: GetApiKeyCommand,
  [PostOrderCommand.name]: PostOrderCommand,
  [GetConditionIdCommand.name]: GetConditionIdCommand,
  [GetTokenChanceCommand.name]: GetTokenChanceCommand,
  [GetTokensBooksCommand.name]: GetTokensBooksCommand,
  [GetAvailabilityCommand.name]: GetAvailabilityCommand,
  [GetFunderAddresCommand.name]: GetFunderAddresCommand,
  [GetTokensPricesCommand.name]: GetTokensPricesCommand,
  [GetMarketByConditionIdCommand.name]: GetMarketByConditionIdCommand,
} as const;

export { PostOrderCommand } from './post-order';
export { GetFunderAddresCommand } from './get-funder-address';
export { GetMarketByConditionIdCommand } from './get-market-by-condition-id';
export { GetTokensPricesCommand } from './get-tokens-prices';
export { GetApiKeyCommand } from './get-api-key';
export { GetTokenChanceCommand } from './get-token-chance';
export { GetConditionIdCommand } from './get-condition-id';
export { GetTokensBooksCommand } from './get-tokens-books';
export { GetAvailabilityCommand } from './get-availability';
