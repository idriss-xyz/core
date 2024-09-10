import { GetResolvedAddressCommand } from './get-addresses.command';
import { GetTwitterIdsCommand } from './get-twitter-ids.command';

export const COMMAND_MAP = {
  [GetTwitterIdsCommand.name]: GetTwitterIdsCommand,
  [GetResolvedAddressCommand.name]: GetResolvedAddressCommand,
};

export { GetTwitterIdsCommand } from './get-twitter-ids.command';
export { GetResolvedAddressCommand } from './get-addresses.command';
