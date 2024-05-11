import { GetImageAsBase64Command } from './get-image-as-base64';

export const COMMAND_MAP = {
  [GetImageAsBase64Command.name]: GetImageAsBase64Command,
} as const;

export { GetImageAsBase64Command } from './get-image-as-base64';
