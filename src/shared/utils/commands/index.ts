import { GetImageAsBase64Command } from './get-image-as-base64';
import { GetImageCommand } from './get-image-command';
export const COMMAND_MAP = {
  [GetImageAsBase64Command.name]: GetImageAsBase64Command,
  [GetImageCommand.name]: GetImageCommand,
} as const;

export { GetImageAsBase64Command } from './get-image-as-base64';
export { GetImageCommand } from './get-image-command';
