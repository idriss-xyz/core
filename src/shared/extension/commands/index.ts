import { ManageExtensionSettingsCommand } from './manage-extension-settings';
import { GetServiceStatusCommand } from './get-service-status';

export const COMMAND_MAP = {
  [GetServiceStatusCommand.name]: GetServiceStatusCommand,
  [ManageExtensionSettingsCommand.name]: ManageExtensionSettingsCommand,
};

export { GetServiceStatusCommand } from './get-service-status';
export { ManageExtensionSettingsCommand } from './manage-extension-settings';
