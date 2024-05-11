import { GetServiceStatusCommand } from './get-service-status';

export { useGetServiceStatus } from './get-service-status';

export const COMMAND_MAP = {
  [GetServiceStatusCommand.name]: GetServiceStatusCommand,
};
