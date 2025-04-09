import { GetYapsCommand } from './get-yaps.command';
import { GetSmartFollowersCommand } from './get-smart-followers.command';

export const COMMAND_MAP = {
  [GetYapsCommand.name]: GetYapsCommand,
  [GetSmartFollowersCommand.name]: GetSmartFollowersCommand,
};

export { GetYapsCommand } from './get-yaps.command';
export { GetSmartFollowersCommand } from './get-smart-followers.command';
