import { GetApiKeyCommand, GetApiKeyHandler } from './get-api-key';
import {
  GetAvailabilityCommand,
  GetAvailabilityHandler,
} from './get-availability';
import {
  GetConditionIdCommand,
  GetConditionIdHandler,
} from './get-condition-id';
import {
  GetImageAsBase64Command,
  GetImageAsBase64Handler,
} from './get-image-as-base64';
import {
  GetMarketByConditionIdCommand,
  GetMarketsByConditionIdHandler,
} from './get-market-by-condition-id';
import {
  GetFunderAddresCommand,
  GetFunderAddressHandler,
} from './get-funder-address';
import {
  GetTokenChanceCommand,
  GetTokenChanceHandler,
} from './get-token-chance';
import {
  GetTokensBooksCommand,
  GetTokensBooksHandler,
} from './get-tokens-books';
import {
  GetTokensPricesCommand,
  GetTokensPricesHandler,
} from './get-tokens-prices';
import { PostOrderCommand, PostOrderHandler } from './post-order';

export const POLYMARKET_COMMAND_TO_HANDLER_MAP = {
  [PostOrderCommand.name]: new PostOrderHandler(),
  [GetApiKeyCommand.name]: new GetApiKeyHandler(),
  [GetTokenChanceCommand.name]: new GetTokenChanceHandler(),
  [GetTokensPricesCommand.name]: new GetTokensPricesHandler(),
  [GetImageAsBase64Command.name]: new GetImageAsBase64Handler(),
  [GetFunderAddresCommand.name]: new GetFunderAddressHandler(),
  [GetConditionIdCommand.name]: new GetConditionIdHandler(),
  [GetMarketByConditionIdCommand.name]: new GetMarketsByConditionIdHandler(),
  [GetTokensBooksCommand.name]: new GetTokensBooksHandler(),
  [GetAvailabilityCommand.name]: new GetAvailabilityHandler(),
};

export { PostOrderCommand } from './post-order';
export { GetMarketsByConditionIdHandler } from './get-market-by-condition-id';
export { GetFunderAddresCommand } from './get-funder-address';
export { GetMarketByConditionIdCommand } from './get-market-by-condition-id';
export { GetTokensPricesCommand } from './get-tokens-prices';
export { GetApiKeyCommand } from './get-api-key';
export { GetImageAsBase64Command } from './get-image-as-base64';
export { GetTokenChanceCommand } from './get-token-chance';
export { GetConditionIdCommand } from './get-condition-id';
export { GetTokensBooksCommand } from './get-tokens-books';
export { GetAvailabilityCommand } from './get-availability';
