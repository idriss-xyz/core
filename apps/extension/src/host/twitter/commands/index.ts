import { GetHandleToUsernameMapCommand } from './get-handle-to-username-map';
import { GetOriginalShortenedUrlCommand } from './get-original-shortened-url';

export const COMMAND_MAP = {
  [GetOriginalShortenedUrlCommand.name]: GetOriginalShortenedUrlCommand,
  [GetHandleToUsernameMapCommand.name]: GetHandleToUsernameMapCommand,
};

export { GetOriginalShortenedUrlCommand } from './get-original-shortened-url';
export { GetHandleToUsernameMapCommand } from './get-handle-to-username-map';
