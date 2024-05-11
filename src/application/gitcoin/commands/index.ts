import { GetApplicationsCommand } from './get-applications';

export const COMMAND_MAP = {
  [GetApplicationsCommand.name]: GetApplicationsCommand,
} as const;

export { GetApplicationsCommand } from './get-applications';
