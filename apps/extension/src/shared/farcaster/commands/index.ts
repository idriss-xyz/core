import { GetFollowersCommand } from './get-followers-status-lookup-command';
import { GetFarcasterVerifiedAddressCommand } from './get-verified-address';

export const COMMAND_MAP = {
  [GetFollowersCommand.name]: GetFollowersCommand,
  [GetFarcasterVerifiedAddressCommand.name]: GetFarcasterVerifiedAddressCommand,
};

export { GetFollowersCommand } from './get-followers-status-lookup-command';
export { GetFarcasterVerifiedAddressCommand } from './get-verified-address';
