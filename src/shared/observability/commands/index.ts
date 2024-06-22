import { LogExceptionCommand } from './log-exception';
import { LogEventCommand } from './log-event';

export const COMMAND_MAP = {
  [LogEventCommand.name]: LogEventCommand,
  [LogExceptionCommand.name]: LogExceptionCommand,
};

export { LogEventCommand } from './log-event';
export { LogExceptionCommand } from './log-exception';
