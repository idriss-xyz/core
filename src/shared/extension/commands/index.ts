import { ChangeExtensionSettingsCommand } from './manage-extension-settings';
import { GetServiceStatusCommand } from './get-service-status';

export const COMMAND_MAP = {
  [GetServiceStatusCommand.name]: GetServiceStatusCommand,
  [ChangeExtensionSettingsCommand.name]: ChangeExtensionSettingsCommand,
};

export { GetServiceStatusCommand } from './get-service-status';
export { ChangeExtensionSettingsCommand } from './manage-extension-settings';
