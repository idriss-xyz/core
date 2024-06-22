import { GetCustomRecipientsCommand } from './get-custom-recipients';

export const COMMAND_MAP = {
  [GetCustomRecipientsCommand.name]: GetCustomRecipientsCommand,
} as const;

export { GetCustomRecipientsCommand } from './get-custom-recipients';
