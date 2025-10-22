import { GetImageCommand } from './get-image-command';
export const COMMAND_MAP = {
  [GetImageCommand.name]: GetImageCommand,
} as const;

export { GetImageCommand } from './get-image-command';
